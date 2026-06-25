import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { randomUUID } from "node:crypto";
import jwt from "jsonwebtoken";
import multer from "multer";

import { connectDb } from "./db.js";
import { getSettings } from "./models/Settings.js";
import { Product } from "./models/Product.js";
import { Order } from "./models/Order.js";
import { mergeContent } from "./defaultContent.js";
import { uploadImage, uploadPrivateFile, getSignedFileUrl } from "./lib/cloudinary.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 5000);
const jwtSecret = process.env.JWT_SECRET || "dev-secret";
const allowedOrigins = String(process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

function isLocalDevOrigin(origin) {
  try {
    return origin && ["localhost", "127.0.0.1"].includes(new URL(origin).hostname);
  } catch {
    return false;
  }
}

app.use(cors({
  origin(origin, callback) {
    if (!origin || isLocalDevOrigin(origin) || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error("Not allowed by CORS"));
  }
}));
app.use(express.json({ limit: "2mb" }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 60 * 1024 * 1024 }
});

function publicEbook(ebook) {
  return {
    title: ebook.title,
    subtitle: ebook.subtitle,
    description: ebook.description,
    price: ebook.price,
    originalPrice: ebook.originalPrice,
    coverUrl: ebook.coverUrl,
    hasFile: Boolean(ebook.filePublicId)
  };
}

function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "লগইন প্রয়োজন" });

  try {
    req.admin = jwt.verify(token, jwtSecret);
    next();
  } catch {
    res.status(401).json({ message: "সেশন শেষ হয়েছে, আবার লগইন করুন" });
  }
}

function createDownloadToken(orderId) {
  return jwt.sign({ orderId, purpose: "download" }, jwtSecret, {
    expiresIn: "7d"
  });
}

async function uploadIfPresent(req, fieldName) {
  const file = req.files?.[fieldName]?.[0];
  if (!file) return null;
  return uploadImage(file.buffer, "ebook-store");
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/ebook", async (_req, res) => {
  const settings = await getSettings();
  res.json({
    ebook: publicEbook(settings.ebook),
    payment: settings.payment,
    content: mergeContent(settings.content)
  });
});

app.post("/api/orders", async (req, res) => {
  const { name, phone, email, method, transactionId, amount, orderBump } = req.body;
  if (!name || !phone || !method || !transactionId) {
    return res.status(400).json({ message: "নাম, ফোন, পেমেন্ট মাধ্যম ও Transaction ID দিন" });
  }

  if (!["bkash", "nagad"].includes(method)) {
    return res.status(400).json({ message: "সঠিক পেমেন্ট মাধ্যম নির্বাচন করুন" });
  }

  const settings = await getSettings();
  const order = await Order.create({
    name,
    phone,
    email: email || "",
    method,
    transactionId,
    amount: Number(amount || settings.ebook.price),
    orderBump: Boolean(orderBump)
  });

  res.status(201).json({ orderId: order.id, status: order.status });
});

app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (email !== adminEmail || password !== adminPassword) {
    return res.status(401).json({ message: "ইমেইল বা পাসওয়ার্ড সঠিক নয়" });
  }

  const token = jwt.sign({ email, role: "admin" }, jwtSecret, { expiresIn: "12h" });
  const settings = await getSettings();
  res.json({
    token,
    ebook: settings.ebook,
    payment: settings.payment,
    content: mergeContent(settings.content)
  });
});

app.get("/api/admin/orders", requireAdmin, async (_req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json({ orders });
});

app.get("/api/admin/products", requireAdmin, async (_req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json({ products });
});

app.post("/api/admin/products", requireAdmin, upload.fields([
  { name: "productImage", maxCount: 1 },
  { name: "productFile", maxCount: 1 }
]), async (req, res) => {
  const { title, type, price, originalPrice, description, stock, sku, shippingCharge, deliveryOptions, deliveryNote } = req.body;

  if (!title || !["ebook", "physical"].includes(type)) {
    return res.status(400).json({ message: "Product title এবং type প্রয়োজন" });
  }

  const product = {
    title,
    type,
    price: Number(price || 0),
    originalPrice: Number(originalPrice || 0),
    description: description || "",
    stock: type === "physical" ? Number(stock || 0) : null,
    sku: sku || "",
    shippingCharge: type === "physical" ? Number(shippingCharge || 0) : 0,
    deliveryOptions: type === "physical" ? String(deliveryOptions || "").split(",").map((item) => item.trim()).filter(Boolean) : ["Digital download"],
    deliveryNote: deliveryNote || "",
    status: "active"
  };

  const imageFile = req.files?.productImage?.[0];
  if (imageFile) {
    product.imageUrl = await uploadImage(imageFile.buffer, "ebook-store/products");
  }

  const productFile = req.files?.productFile?.[0];
  if (productFile) {
    const uploaded = await uploadPrivateFile(productFile.buffer, "ebook-store/files", productFile.originalname);
    product.filePublicId = uploaded.publicId;
    product.fileFormat = uploaded.format;
    product.fileResourceType = uploaded.resourceType;
    product.originalFileName = productFile.originalname;
  }

  const created = await Product.create(product);
  res.status(201).json({ product: created });
});

app.patch("/api/admin/products/:id", requireAdmin, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product পাওয়া যায়নি" });

  if (req.body.status && ["active", "draft", "archived"].includes(req.body.status)) {
    product.status = req.body.status;
    await product.save();
  }

  res.json({ product });
});

app.get("/api/admin/settings", requireAdmin, async (_req, res) => {
  const settings = await getSettings();
  res.json({
    ebook: settings.ebook,
    payment: settings.payment,
    content: mergeContent(settings.content)
  });
});

app.put("/api/admin/settings", requireAdmin, upload.fields([
  { name: "ebookFile", maxCount: 1 },
  { name: "coverImage", maxCount: 1 },
  { name: "logoImage", maxCount: 1 },
  { name: "faviconImage", maxCount: 1 },
  { name: "seoImage", maxCount: 1 },
  { name: "heroBannerImage", maxCount: 1 },
  { name: "authorImage", maxCount: 1 },
  { name: "guaranteeImage", maxCount: 1 },
  { name: "testimonialImage0", maxCount: 1 },
  { name: "testimonialImage1", maxCount: 1 },
  { name: "testimonialImage2", maxCount: 1 },
  { name: "testimonialImage3", maxCount: 1 },
  { name: "testimonialImage4", maxCount: 1 },
  { name: "testimonialImage5", maxCount: 1 },
  { name: "customSectionImage0", maxCount: 1 },
  { name: "customSectionImage1", maxCount: 1 },
  { name: "customSectionImage2", maxCount: 1 },
  { name: "customSectionImage3", maxCount: 1 },
  { name: "customSectionImage4", maxCount: 1 },
  { name: "customSectionImage5", maxCount: 1 },
  { name: "v2AuthorImage", maxCount: 1 },
  { name: "v2VideoTestimonialImage0", maxCount: 1 },
  { name: "v2VideoTestimonialImage1", maxCount: 1 },
  { name: "v2VideoTestimonialImage2", maxCount: 1 },
  { name: "v2VideoTestimonialImage3", maxCount: 1 },
  { name: "v2VideoTestimonialImage4", maxCount: 1 },
  { name: "v2VideoTestimonialImage5", maxCount: 1 }
]), async (req, res) => {
  const settings = await getSettings();
  const { title, subtitle, description, price, originalPrice, bkashNumber, nagadNumber, instructions, contentJson } = req.body;

  settings.ebook.title = title || settings.ebook.title;
  settings.ebook.subtitle = subtitle || settings.ebook.subtitle;
  settings.ebook.description = description || settings.ebook.description;
  settings.ebook.price = Number(price || settings.ebook.price);
  settings.ebook.originalPrice = Number(originalPrice || settings.ebook.originalPrice);

  const ebookFile = req.files?.ebookFile?.[0];
  if (ebookFile) {
    const uploaded = await uploadPrivateFile(ebookFile.buffer, "ebook-store/files", ebookFile.originalname);
    settings.ebook.filePublicId = uploaded.publicId;
    settings.ebook.fileFormat = uploaded.format;
    settings.ebook.fileResourceType = uploaded.resourceType;
    settings.ebook.originalFileName = ebookFile.originalname;
  }

  const coverUrl = await uploadIfPresent(req, "coverImage");
  if (coverUrl) settings.ebook.coverUrl = coverUrl;

  settings.payment.bkashNumber = bkashNumber || settings.payment.bkashNumber;
  settings.payment.nagadNumber = nagadNumber || settings.payment.nagadNumber;
  settings.payment.instructions = instructions || settings.payment.instructions;

  let content = mergeContent(settings.content);
  if (contentJson) {
    try {
      content = mergeContent(JSON.parse(contentJson));
    } catch {
      return res.status(400).json({ message: "Content JSON সঠিক নয়" });
    }
  }

  const logoUrl = await uploadIfPresent(req, "logoImage");
  if (logoUrl) content.logoUrl = logoUrl;

  const faviconUrl = await uploadIfPresent(req, "faviconImage");
  if (faviconUrl) content.faviconUrl = faviconUrl;

  const seoImageUrl = await uploadIfPresent(req, "seoImage");
  if (seoImageUrl) content.seoImageUrl = seoImageUrl;

  const heroBannerUrl = await uploadIfPresent(req, "heroBannerImage");
  if (heroBannerUrl) content.heroBannerUrl = heroBannerUrl;

  const authorPhotoUrl = await uploadIfPresent(req, "authorImage");
  if (authorPhotoUrl) content.authorPhotoUrl = authorPhotoUrl;

  const guaranteeBadgeUrl = await uploadIfPresent(req, "guaranteeImage");
  if (guaranteeBadgeUrl) content.guaranteeBadgeUrl = guaranteeBadgeUrl;

  for (let index = 0; index < 6; index += 1) {
    const url = await uploadIfPresent(req, `testimonialImage${index}`);
    if (url && content.testimonials?.[index]) {
      content.testimonials[index].imageUrl = url;
    }
  }

  for (let index = 0; index < 6; index += 1) {
    const url = await uploadIfPresent(req, `customSectionImage${index}`);
    if (url && content.customSections?.[index]) {
      content.customSections[index].imageUrl = url;
    }
  }

  const v2AuthorPhotoUrl = await uploadIfPresent(req, "v2AuthorImage");
  if (v2AuthorPhotoUrl) content.v2.author.photoUrl = v2AuthorPhotoUrl;

  for (let index = 0; index < 6; index += 1) {
    const url = await uploadIfPresent(req, `v2VideoTestimonialImage${index}`);
    if (url && content.v2.videoTestimonials?.[index]) {
      content.v2.videoTestimonials[index].imageUrl = url;
    }
  }

  settings.content = content;
  settings.markModified("ebook");
  settings.markModified("payment");
  settings.markModified("content");
  await settings.save();

  res.json({
    ebook: settings.ebook,
    payment: settings.payment,
    content: mergeContent(settings.content)
  });
});

app.patch("/api/admin/orders/:id", requireAdmin, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "অর্ডার পাওয়া যায়নি" });

  const status = req.body.status || order.status;
  if (!["approved", "rejected", "pending"].includes(status)) {
    return res.status(400).json({ message: "সঠিক স্ট্যাটাস দিন" });
  }

  order.status = status;
  if (req.body.deliveryStatus) order.deliveryStatus = req.body.deliveryStatus;
  if (typeof req.body.trackingNumber === "string") order.trackingNumber = req.body.trackingNumber;
  if (typeof req.body.deliveryNote === "string") order.deliveryNote = req.body.deliveryNote;
  order.downloadToken = status === "approved" ? createDownloadToken(order.id) : "";
  await order.save();

  res.json({ order });
});

app.get("/api/download/:token", async (req, res) => {
  let payload;
  try {
    payload = jwt.verify(req.params.token, jwtSecret);
  } catch {
    return res.status(401).send("Download link expired");
  }

  const order = await Order.findById(payload.orderId);
  const settings = await getSettings();
  if (!order || order.status !== "approved" || !settings.ebook.filePublicId) {
    return res.status(403).send("Download not available");
  }

  const signedUrl = getSignedFileUrl(
    settings.ebook.filePublicId,
    settings.ebook.fileFormat,
    settings.ebook.fileResourceType
  );
  res.redirect(signedUrl);
});

connectDb().then(() => {
  app.listen(port, () => {
    console.log(`Ebook backend running on http://localhost:${port}`);
  });
});
