import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fsSync from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import jwt from "jsonwebtoken";
import multer from "multer";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const dataDir = path.join(rootDir, "data");
const uploadDir = path.join(rootDir, "uploads");
const dbPath = path.join(dataDir, "db.json");
const sqlitePath = path.join(dataDir, "store.sqlite");

fsSync.mkdirSync(dataDir, { recursive: true });
fsSync.mkdirSync(uploadDir, { recursive: true });

const app = express();
const port = Number(process.env.PORT || 5000);
const jwtSecret = process.env.JWT_SECRET || "dev-secret";

const defaultContent = {
  logoUrl: "",
  authorPhotoUrl: "",
  guaranteeBadgeUrl: "",
  videoReviewUrl: "",
  brandName: "ইবুক স্টোর",
  trustLine: "৩,৫০০+ মানুষ ইতোমধ্যে পড়েছেন ⭐⭐⭐⭐⭐",
  stickyCta: "এখনই নাও",
  heroKicker: "Limited Time Bangla eBook",
  heroHeadline: "এলোমেলো শেখা বন্ধ করে এবার clear roadmap হাতে নাও",
  heroSubheadline: "সহজ বাংলায় সাজানো practical guide, যাতে তুমি বুঝে বুঝে শুরু করতে পারো এবং দ্রুত action নিতে পারো।",
  heroCta: "এখনই ডাউনলোড করুন",
  whoForTitle: "এই বইটা তোমার জন্য যদি...",
  whoFor: [
    "তুমি যদি অনেক কিছু শুরু করেও শেষ করতে না পারো",
    "তুমি যদি সহজ বাংলায় step-by-step গাইড চাও",
    "তুমি যদি কোথা থেকে শুরু করবে বুঝতে না পারো",
    "তুমি যদি কম সময়ে কাজের মতো ফলাফল চাও"
  ],
  painsTitle: "তুমি কি এই সমস্যায় ভুগছো?",
  pains: [
    "অনেক free content দেখে মাথা আরও বেশি confusing হয়ে যাচ্ছে",
    "কী আগে শিখবে আর কী পরে শিখবে সেটা clear না",
    "Action plan না থাকায় শুরু করলেও consistency থাকে না",
    "ভুল resource follow করে সময় নষ্ট হচ্ছে"
  ],
  beforeAfterTitle: "এই বই পড়ার আগে ও পরে",
  beforeAfter: [
    { before: "এলোমেলো idea ও confusion", after: "clear roadmap ও priority" },
    { before: "শুরু করেও মাঝপথে থেমে যাওয়া", after: "ছোট ছোট step-এ consistent progress" },
    { before: "ভুল জায়গায় সময় নষ্ট", after: "যা দরকার শুধু সেটায় focus" }
  ],
  insideTitle: "এই বইয়ে তুমি যা পাবে",
  inside: [
    { title: "Foundation", text: "শুরু করার আগে কোন জিনিসগুলো পরিষ্কার করা দরকার" },
    { title: "Roadmap", text: "কোন step আগে, কোন step পরে - সম্পূর্ণ sequence" },
    { title: "Execution", text: "প্রতিদিন কী করলে progress হবে তার practical guide" }
  ],
  authorName: "Sadhin / Rayshani",
  authorBio: "প্র্যাকটিক্যাল learning material, checklist এবং simple explanation দিয়ে beginner-friendly guide তৈরি করা হয়।",
  authorBadges: ["Practical Guide", "Bangla Content", "Action Checklist"],
  ratingTitle: "৪.৯/৫ ⭐ — ৩,৫০০+ Reviews",
  testimonials: [
    { name: "আরিফ হাসান", city: "ঢাকা", text: "এই বইটা পড়ার পর পুরো roadmap বুঝেছি।" },
    { name: "নুসরাত জাহান", city: "চট্টগ্রাম", text: "বাংলায় এত structured guide আশা করিনি।" }
  ],
  bonuses: [
    { title: "Action Checklist", text: "প্রতিদিন follow করার ready checklist", value: 499 },
    { title: "Worksheet Pack", text: "নিজের plan সাজানোর printable worksheet", value: 299 },
    { title: "Mini Guide", text: "Common mistake এড়ানোর quick guide", value: 199 }
  ],
  guaranteeTitle: "১৪ দিনের Money-Back Guarantee",
  guaranteeText: "যদি সন্তুষ্ট না হও, কোনো প্রশ্ন ছাড়াই পুরো টাকা ফেরত।",
  faqTitle: "কেনার আগে সাধারণ প্রশ্ন",
  faqs: [
    { q: "এই বইটা কি আমার কাজে আসবে?", a: "তুমি যদি বাংলায় clear roadmap ও practical checklist চাও, তাহলে কাজে আসবে।" },
    { q: "eBook কীভাবে পাবো?", a: "পেমেন্ট verify হলে secure download link পাওয়া যাবে।" }
  ],
  finalHeadline: "এখনো ভাবছো? এই সুযোগ কিন্তু সীমিত সময়ের",
  finalText: "এই অফার শেষ হলে full price-এ কিনতে হবে।",
  footerText: "Support: WhatsApp + Email | Privacy Policy | Refund Policy"
};

const sql = new DatabaseSync(sqlitePath);
sql.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    price REAL NOT NULL DEFAULT 0,
    originalPrice REAL NOT NULL DEFAULT 0,
    description TEXT NOT NULL DEFAULT '',
    stock INTEGER,
    sku TEXT NOT NULL DEFAULT '',
    shippingCharge REAL NOT NULL DEFAULT 0,
    deliveryOptions TEXT NOT NULL DEFAULT '[]',
    deliveryNote TEXT NOT NULL DEFAULT '',
    imageUrl TEXT NOT NULL DEFAULT '',
    fileName TEXT NOT NULL DEFAULT '',
    originalFileName TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'active',
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL DEFAULT ''
  )
`);

function rowToProduct(row) {
  return {
    ...row,
    deliveryOptions: JSON.parse(row.deliveryOptions || "[]")
  };
}

function listProducts() {
  return sql.prepare("SELECT * FROM products ORDER BY createdAt DESC").all().map(rowToProduct);
}

function insertProduct(product) {
  sql.prepare(`
    INSERT INTO products (
      id, title, type, price, originalPrice, description, stock, sku,
      shippingCharge, deliveryOptions, deliveryNote, imageUrl, fileName,
      originalFileName, status, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    product.id,
    product.title,
    product.type,
    product.price,
    product.originalPrice,
    product.description,
    product.stock,
    product.sku,
    product.shippingCharge,
    JSON.stringify(product.deliveryOptions || []),
    product.deliveryNote,
    product.imageUrl,
    product.fileName,
    product.originalFileName,
    product.status,
    product.createdAt,
    product.updatedAt || ""
  );
}

app.use(cors({ origin: process.env.CLIENT_URL || true }));
app.use(express.json({ limit: "2mb" }));

const storage = multer.diskStorage({
  destination: async (_req, _file, cb) => {
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "-");
    cb(null, `${Date.now()}-${safeName}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 60 * 1024 * 1024 }
});

async function ensureDb() {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.mkdir(uploadDir, { recursive: true });
  try {
    await fs.access(dbPath);
  } catch {
    const initial = {
      ebook: {
        title: "বাংলা ইবুক",
        subtitle: "আপনার জ্ঞান, এক জায়গায় সুন্দরভাবে সাজানো",
        description:
          "এই ইবুকে ধাপে ধাপে শেখার মতো করে গুরুত্বপূর্ণ বিষয়গুলো সাজানো হয়েছে। পেমেন্ট করার পর এডমিন অনুমোদন দিলে ডাউনলোড লিংক পাওয়া যাবে।",
        price: 499,
        coverUrl: "",
        fileName: "",
        originalFileName: ""
      },
      payment: {
        bkashNumber: "01XXXXXXXXX",
        nagadNumber: "01XXXXXXXXX",
        instructions:
          "Send Money করুন, তারপর আপনার Transaction ID দিয়ে অর্ডার সাবমিট করুন।"
      },
      content: defaultContent,
      products: [],
      orders: []
    };
    await fs.writeFile(dbPath, JSON.stringify(initial, null, 2));
  }
}

async function readDb() {
  await ensureDb();
  const db = JSON.parse(await fs.readFile(dbPath, "utf8"));
  db.content = { ...defaultContent, ...(db.content || {}) };
  db.products = listProducts();
  db.orders = (db.orders || []).map((order) => ({
    deliveryStatus: order.deliveryStatus || "not_required",
    trackingNumber: order.trackingNumber || "",
    deliveryNote: order.deliveryNote || "",
    ...order
  }));
  return db;
}

async function writeDb(db) {
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
}

function publicEbook(ebook) {
  return {
    title: ebook.title,
    subtitle: ebook.subtitle,
    description: ebook.description,
    price: ebook.price,
    coverUrl: ebook.coverUrl,
    hasFile: Boolean(ebook.fileName)
  };
}

function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "লগইন প্রয়োজন" });

  try {
    req.admin = jwt.verify(token, jwtSecret);
    next();
  } catch {
    res.status(401).json({ message: "সেশন শেষ হয়েছে, আবার লগইন করুন" });
  }
}

function createDownloadToken(orderId) {
  return jwt.sign({ orderId, purpose: "download" }, jwtSecret, {
    expiresIn: "7d"
  });
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/ebook", async (_req, res) => {
  const db = await readDb();
  res.json({ ebook: publicEbook(db.ebook), payment: db.payment, content: db.content });
});

app.post("/api/orders", async (req, res) => {
  const { name, phone, email, method, transactionId, amount, orderBump } = req.body;
  if (!name || !phone || !method || !transactionId) {
    return res.status(400).json({ message: "নাম, ফোন, পেমেন্ট মাধ্যম ও Transaction ID দিন" });
  }

  if (!["bkash", "nagad"].includes(method)) {
    return res.status(400).json({ message: "সঠিক পেমেন্ট মাধ্যম নির্বাচন করুন" });
  }

  const db = await readDb();
  const order = {
    id: randomUUID(),
    name,
    phone,
    email: email || "",
    method,
    transactionId,
    amount: Number(amount || db.ebook.price),
    orderBump: Boolean(orderBump),
    status: "pending",
    createdAt: new Date().toISOString(),
    downloadToken: ""
  };

  db.orders.unshift(order);
  await writeDb(db);
  res.status(201).json({ orderId: order.id, status: order.status });
});

app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (email !== adminEmail || password !== adminPassword) {
    return res.status(401).json({ message: "ইমেইল বা পাসওয়ার্ড সঠিক নয়" });
  }

  const token = jwt.sign({ email, role: "admin" }, jwtSecret, { expiresIn: "12h" });
  const db = await readDb();
  res.json({ token, ebook: db.ebook, payment: db.payment, content: db.content });
});

app.get("/api/admin/orders", requireAdmin, async (_req, res) => {
  const db = await readDb();
  res.json({ orders: db.orders });
});

app.get("/api/admin/products", requireAdmin, async (_req, res) => {
  res.json({ products: listProducts() });
});

app.post("/api/admin/products", requireAdmin, upload.fields([
  { name: "productImage", maxCount: 1 },
  { name: "productFile", maxCount: 1 }
]), async (req, res) => {
  const { title, type, price, originalPrice, description, stock, sku, shippingCharge, deliveryOptions, deliveryNote } = req.body;

  if (!title || !["ebook", "physical"].includes(type)) {
    return res.status(400).json({ message: "Product title এবং type প্রয়োজন" });
  }

  const product = {
    id: randomUUID(),
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
    imageUrl: req.files?.productImage?.[0] ? `/uploads/${req.files.productImage[0].filename}` : "",
    fileName: req.files?.productFile?.[0] ? req.files.productFile[0].filename : "",
    originalFileName: req.files?.productFile?.[0] ? req.files.productFile[0].originalname : "",
    status: "active",
    createdAt: new Date().toISOString()
  };

  insertProduct(product);
  res.status(201).json({ product });
});

app.patch("/api/admin/products/:id", requireAdmin, async (req, res) => {
  const product = listProducts().find((item) => item.id === req.params.id);
  if (!product) return res.status(404).json({ message: "Product পাওয়া যায়নি" });

  if (req.body.status && ["active", "draft", "archived"].includes(req.body.status)) {
    sql.prepare("UPDATE products SET status = ?, updatedAt = ? WHERE id = ?")
      .run(req.body.status, new Date().toISOString(), req.params.id);
  }

  res.json({ product: listProducts().find((item) => item.id === req.params.id) });
});

app.get("/api/admin/settings", requireAdmin, async (_req, res) => {
  const db = await readDb();
  res.json({ ebook: db.ebook, payment: db.payment, content: db.content });
});

app.put("/api/admin/settings", requireAdmin, upload.fields([
  { name: "ebookFile", maxCount: 1 },
  { name: "coverImage", maxCount: 1 },
  { name: "logoImage", maxCount: 1 },
  { name: "authorImage", maxCount: 1 },
  { name: "guaranteeImage", maxCount: 1 },
  { name: "testimonialImage0", maxCount: 1 },
  { name: "testimonialImage1", maxCount: 1 },
  { name: "testimonialImage2", maxCount: 1 },
  { name: "testimonialImage3", maxCount: 1 },
  { name: "testimonialImage4", maxCount: 1 },
  { name: "testimonialImage5", maxCount: 1 }
]), async (req, res) => {
  const db = await readDb();
  const { title, subtitle, description, price, bkashNumber, nagadNumber, instructions, contentJson } = req.body;

  db.ebook = {
    ...db.ebook,
    title: title || db.ebook.title,
    subtitle: subtitle || db.ebook.subtitle,
    description: description || db.ebook.description,
    price: Number(price || db.ebook.price)
  };

  if (req.files?.ebookFile?.[0]) {
    db.ebook.fileName = req.files.ebookFile[0].filename;
    db.ebook.originalFileName = req.files.ebookFile[0].originalname;
  }

  if (req.files?.coverImage?.[0]) {
    db.ebook.coverUrl = `/uploads/${req.files.coverImage[0].filename}`;
  }

  db.payment = {
    bkashNumber: bkashNumber || db.payment.bkashNumber,
    nagadNumber: nagadNumber || db.payment.nagadNumber,
    instructions: instructions || db.payment.instructions
  };

  if (contentJson) {
    try {
      db.content = { ...defaultContent, ...JSON.parse(contentJson) };
    } catch {
      return res.status(400).json({ message: "Content JSON সঠিক নয়" });
    }
  }

  if (req.files?.logoImage?.[0]) {
    db.content.logoUrl = `/uploads/${req.files.logoImage[0].filename}`;
  }

  if (req.files?.authorImage?.[0]) {
    db.content.authorPhotoUrl = `/uploads/${req.files.authorImage[0].filename}`;
  }

  if (req.files?.guaranteeImage?.[0]) {
    db.content.guaranteeBadgeUrl = `/uploads/${req.files.guaranteeImage[0].filename}`;
  }

  for (let index = 0; index < 6; index += 1) {
    const file = req.files?.[`testimonialImage${index}`]?.[0];
    if (file && db.content.testimonials?.[index]) {
      db.content.testimonials[index].imageUrl = `/uploads/${file.filename}`;
    }
  }

  await writeDb(db);
  res.json({ ebook: db.ebook, payment: db.payment, content: db.content });
});

app.patch("/api/admin/orders/:id", requireAdmin, async (req, res) => {
  const db = await readDb();
  const order = db.orders.find((item) => item.id === req.params.id);
  if (!order) return res.status(404).json({ message: "অর্ডার পাওয়া যায়নি" });

  const status = req.body.status || order.status;
  if (!["approved", "rejected", "pending"].includes(status)) {
    return res.status(400).json({ message: "সঠিক স্ট্যাটাস দিন" });
  }

  order.status = status;
  if (req.body.deliveryStatus) order.deliveryStatus = req.body.deliveryStatus;
  if (typeof req.body.trackingNumber === "string") order.trackingNumber = req.body.trackingNumber;
  if (typeof req.body.deliveryNote === "string") order.deliveryNote = req.body.deliveryNote;
  order.downloadToken = status === "approved" ? createDownloadToken(order.id) : "";
  order.updatedAt = new Date().toISOString();
  await writeDb(db);

  res.json({ order });
});

app.get("/api/download/:token", async (req, res) => {
  let payload;
  try {
    payload = jwt.verify(req.params.token, jwtSecret);
  } catch {
    return res.status(401).send("Download link expired");
  }

  const db = await readDb();
  const order = db.orders.find((item) => item.id === payload.orderId);
  if (!order || order.status !== "approved" || !db.ebook.fileName) {
    return res.status(403).send("Download not available");
  }

  res.download(path.join(uploadDir, db.ebook.fileName), db.ebook.originalFileName || db.ebook.fileName);
});

app.use("/uploads", express.static(uploadDir));

ensureDb().then(() => {
  app.listen(port, () => {
    console.log(`Ebook backend running on http://localhost:${port}`);
  });
});
