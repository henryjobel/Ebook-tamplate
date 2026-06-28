export const API_URL = (import.meta as any).env?.VITE_API_URL || "http://localhost:5000";

export interface Ebook {
  title: string;
  subtitle: string;
  description: string;
  price: number;
  originalPrice: number;
  coverUrl: string;
  hasFile: boolean;
}

export interface Payment {
  bkashNumber: string;
  nagadNumber: string;
  instructions: string;
}

export interface Bonus {
  title: string;
  text?: string;
  value: number;
}

export interface V2Content {
  brandName: string;
  logoUrl: string;
  trustLine: string;
  stickyCta: string;
  heroPill: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroCta: string;
  heroGuaranteeBadge: string;
  painsTitle: string;
  painsSubtitle: string;
  pains: { emoji: string; text: string }[];
  benefitsLabel: string;
  benefitsTitle: string;
  benefits: string[];
  ctaBanners: { title: string; subtitle?: string; variant: "navy" | "light"; buttonText: string }[];
  author: {
    photoUrl: string;
    name: string;
    role: string;
    bio: string;
    stats: { value: string; label: string }[];
  };
  insideTitle: string;
  insideSubtitle: string;
  chapters: { title: string; text: string; locked?: boolean }[];
  testimonialsTitle: string;
  ratingSummary: string;
  videoTestimonials: { name: string; location: string; quote: string; imageUrl: string }[];
  reviews: { name: string; text: string; rating: number }[];
  faqTitle: string;
  faqs: { q: string; a: string }[];
  guaranteeTitle: string;
  guaranteeText: string;
  finalHeadline: string;
  finalSubtext: string;
  finalCtaButtonText: string;
  countdownSeconds: number;
  footer: {
    description: string;
    email: string;
    links: { label: string; href: string }[];
    socials: { label: string; href: string }[];
    copyright: string;
  };
  bonuses: Bonus[];
  upsells: { id: string; title: string; desc: string; price: number; oldPrice: number; popular?: boolean; videoUrl?: string; youtubeUrl?: string }[];
}

export interface Content {
  brandName: string;
  logoUrl: string;
  trustLine: string;
  stickyCta: string;
  heroKicker: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroCta: string;
  bonuses: Bonus[];
  v2: V2Content;
}

export const DEFAULT_CONTENT: Content = {
  brandName: "Learn AI With Sadhin",
  logoUrl: "",
  trustLine: "৩,২০০+ জন ইতিমধ্যে পড়েছেন",
  stickyCta: "এখনই নিন",
  heroKicker: "🔥 ২০২৬ সালের সবচেয়ে দরকারি গাইড",
  heroHeadline: "AI শিখে ঘরে বসেই শুরু করুন ফ্রিল্যান্সিং",
  heroSubheadline: "শুধু স্মার্টফোন আর ইন্টারনেট থাকলেই হবে — অভিজ্ঞতা লাগবে না।",
  heroCta: "এখনই ডাউনলোড করুন — মাত্র ৯৯ টাকা",
  bonuses: [
    { title: "AI Prompt Cheat Sheet", value: 199 },
    { title: "Client Email Templates (বাংলা)", value: 149 },
    { title: "৩০-Day Action Plan PDF", value: 99 }
  ],
  v2: {
    brandName: "Learn AI With Sadhin",
    logoUrl: "",
    trustLine: "৩,২০০+ জন ইতিমধ্যে পড়েছেন",
    stickyCta: "এখনই নিন",
    heroHeadline: "AI শিখে ঘরে বসেই শুরু করুন ফ্রিল্যান্সিং",
    heroSubheadline: "শুধু স্মার্টফোন আর ইন্টারনেট থাকলেই হবে - অভিজ্ঞতা লাগবে না।",
    heroCta: "এখনই ডাউনলোড করুন - মাত্র ৯৯ টাকা",
    heroPill: "🔥 ২০২৬ সালের সবচেয়ে দরকারি গাইড",
    heroGuaranteeBadge: "৭ দিনের মানি-ব্যাক গ্যারান্টি",
    painsTitle: "তুমি কি এই সমস্যায় আছো?",
    painsSubtitle: "যদি একটাও মিলে যায়, তাহলে এই বইটা ঠিক তোমার জন্য।",
    pains: [
      { emoji: "😤", text: "ফ্রিল্যান্সিং শুরু করতে চাও কিন্তু কোথা থেকে শুরু করবে বুঝতেছো না" },
      { emoji: "💸", text: "YouTube দেখেই সময় যায়, আয় হয় না" },
      { emoji: "😟", text: "AI সম্পর্কে শুনেছো কিন্তু কীভাবে কাজে লাগাবে জানো না" },
      { emoji: "⏰", text: "সময় নষ্ট না করে সরাসরি result চাও" }
    ],
    benefitsLabel: "যা যা পাচ্ছো",
    benefitsTitle: "এই বই পড়লে তুমি যা পাবে",
    benefits: [
      "AI tools দিয়ে প্রফেশনাল কাজ করার A-Z গাইড",
      "Fiverr, Upwork ছাড়াও ক্লায়েন্ট পাওয়ার ৭টি উপায়",
      "ChatGPT, Midjourney, Canva AI ব্যবহারের real examples",
      "৩০ দিনে প্রথম আয়ের step-by-step রোডম্যাপ",
      "বাংলায় প্রোপোজাল ও ক্লায়েন্ট ম্যানেজমেন্ট টেমপ্লেট",
      "২০২৬ সালের সবচেয়ে চাহিদা আছে এমন AI স্কিলসের তালিকা"
    ],
    ctaBanners: [
      { title: "আজই শুরু করো — কাল হয়তো দেরি হয়ে যাবে", subtitle: "৫০০ টাকার গাইড আজ মাত্র ৯৯ টাকায়।", variant: "navy", buttonText: "৯৯ টাকায় নিন" },
      { title: "৩,২০০+ জনের সাথে তুমিও শুরু করো", subtitle: "পুরো বই + ৩টি ফ্রি বোনাস, এক প্যাকেজে।", variant: "light", buttonText: "৯৯ টাকায় নিন" }
    ],
    author: {
      photoUrl: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=320&h=320&fit=crop&auto=format",
      name: "রাকিব হাসান",
      role: "AI ফ্রিল্যান্সিং কোচ ও ডিজিটাল মার্কেটার",
      bio: "৬ বছর ধরে আন্তর্জাতিক ক্লায়েন্টদের সাথে কাজ করছি। শূন্য থেকে শুরু করে আজ একটি সফল ফ্রিল্যান্স ক্যারিয়ার গড়েছি AI টুলস ব্যবহার করে। এই বইয়ে আমার সব অভিজ্ঞতা সহজ বাংলায় তুলে ধরেছি যাতে তুমিও শুরু করতে পারো।",
      stats: [
        { value: "৫ লাখ+", label: "মোট আয়" },
        { value: "২০০০+", label: "শিক্ষার্থী" },
        { value: "৪.৯★", label: "রেটিং" }
      ]
    },
    insideTitle: "বইয়ের ভেতরে কী আছে?",
    insideSubtitle: "৫টি অধ্যায়, প্রতিটিতে হাতে-কলমে শেখার মত কন্টেন্ট।",
    chapters: [
      { title: "ফ্রিল্যান্সিং ও AI: কেন এখনই শুরু করবে", text: "২০২৬ সালের মার্কেট, সুযোগ আর বাস্তবতা — সহজ ভাষায়।", locked: false },
      { title: "প্রয়োজনীয় AI টুলস ও সেটআপ", text: "ChatGPT, Midjourney, Canva AI — কোনটা কীসের জন্য।", locked: false },
      { title: "তোমার প্রথম স্কিল বেছে নাও", text: "চাহিদা আছে এমন স্কিল আর শেখার সবচেয়ে দ্রুত পথ।", locked: false },
      { title: "ক্লায়েন্ট খোঁজা ও প্রোপোজাল", text: "Fiverr, Upwork ও বাইরের ৭টি উৎস থেকে কাজ আনা।", locked: true },
      { title: "৩০ দিনে প্রথম আয়ের রোডম্যাপ", text: "দিন-ভিত্তিক অ্যাকশন প্ল্যান — ফলো করলেই রেজাল্ট।", locked: true }
    ],
    testimonialsTitle: "তারাও শুরু করেছিল তোমার মতো",
    ratingSummary: "৪.৯/৫ (৩২০+ রিভিউ)",
    videoTestimonials: [
      { name: "সাকিব আহমেদ", location: "রাজশাহী", quote: "প্রথম মাসেই ১২,০০০ টাকা আয় করেছি AI দিয়ে কনটেন্ট লিখে।", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=640&h=360&fit=crop&auto=format" },
      { name: "তানিয়া ইসলাম", location: "চট্টগ্রাম", quote: "ঘরে বসে Canva AI শিখে এখন রেগুলার ক্লায়েন্ট পাচ্ছি।", imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=640&h=360&fit=crop&auto=format" },
      { name: "মেহেদী হাসান", location: "ঢাকা", quote: "ভিডিও দেখে দেখে যা পারিনি, এই বই পড়ে তা পেরেছি।", imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=640&h=360&fit=crop&auto=format" }
    ],
    reviews: [
      { name: "Nusrat Jahan", text: "ভাই সত্যি বলতে ৯৯ টাকায় এত কিছু আশা করিনি! টেমপ্লেটগুলো সোনার দাম। 🙏", rating: 5 },
      { name: "Arif Hossain", text: "AI prompt cheat sheet টা পুরা গেম চেঞ্জার। প্রথম ক্লায়েন্ট পেয়ে গেছি 🔥", rating: 5 },
      { name: "Sumaiya Akter", text: "বাংলায় হওয়ায় বুঝতে কোনো সমস্যা হয়নি। স্টুডেন্ট হিসেবে পারফেক্ট।", rating: 5 },
      { name: "Rifat Khan", text: "৩০ দিনের প্ল্যান ফলো করছি, এই সপ্তাহেই প্রথম পেমেন্ট পেলাম 🥳", rating: 5 }
    ],
    faqTitle: "সাধারণ প্রশ্ন",
    faqs: [
      { q: "বইটা কি একদম নতুনদের জন্য?", a: "হ্যাঁ। কোনো পূর্ব অভিজ্ঞতা ছাড়াই শুরু করতে পারবে — সব কিছু শুরু থেকে ধাপে ধাপে বুঝিয়ে দেওয়া আছে।" },
      { q: "শুধু স্মার্টফোন দিয়ে কি কাজ করা যাবে?", a: "অবশ্যই। বইয়ের বেশিরভাগ AI টুল মোবাইল থেকেই ব্যবহার করা যায়।" },
      { q: "পেমেন্ট কীভাবে করব?", a: "bKash, Nagad অথবা কার্ড দিয়ে সহজেই পেমেন্ট করতে পারবেন। পেমেন্টের সাথে সাথেই ডাউনলোড লিংক পেয়ে যাবেন।" },
      { q: "বইটা কি বাংলায়?", a: "হ্যাঁ, পুরো বইটি সহজ বাংলায় লেখা — কোথাও বুঝতে সমস্যা হবে না।" },
      { q: "টাকা ফেরত পাওয়ার নিয়ম কী?", a: "৭ দিনের ভেতরে ভালো না লাগলে কোনো প্রশ্ন ছাড়াই সম্পূর্ণ টাকা ফেরত।" }
    ],
    guaranteeTitle: "৭ দিনের ১০০% মানি-ব্যাক গ্যারান্টি",
    guaranteeText: "কোনো প্রশ্ন ছাড়াই টাকা ফেরত। ঝুঁকি পুরোটাই আমাদের, লাভ পুরোটাই তোমার।",
    finalHeadline: "আর দেরি নয় — আজই শুরু করুন",
    finalSubtext: "হাজার হাজার তরুণ ইতিমধ্যে শুরু করে দিয়েছে। তুমি কেন পিছিয়ে থাকবে?",
    finalCtaButtonText: "এখনই নিন — ৯৯ টাকা",
    countdownSeconds: 6 * 3600 + 23 * 60 + 11,
    footer: {
      description: "বাংলাদেশের তরুণদের AI দিয়ে ফ্রিল্যান্সিং শিখিয়ে অনলাইনে আয়ের পথ দেখানোই আমাদের লক্ষ্য।",
      email: "hello@learnaiwithsadhin.com",
      links: [
        { label: "প্রাইভেসি পলিসি (Privacy Policy)", href: "#" },
        { label: "রিফান্ড পলিসি (Refund Policy)", href: "#" },
        { label: "টার্মস ও কন্ডিশন", href: "#" },
        { label: "যোগাযোগ", href: "#" }
      ],
      socials: [
        { label: "Facebook", href: "#" },
        { label: "YouTube", href: "#" },
        { label: "Instagram", href: "#" },
        { label: "Telegram", href: "#" }
      ],
      copyright: "© ২০২৬ Learn AI With Sadhin — সর্বস্বত্ব সংরক্ষিত।"
    },
    bonuses: [
      { title: "AI Prompt Cheat Sheet", value: 199 },
      { title: "Client Email Templates (বাংলা)", value: 149 },
      { title: "৩০-Day Action Plan PDF", value: 99 }
    ],
    upsells: [
      { id: "video", title: "AI ফ্রিল্যান্সিং ভিডিও কোর্স", desc: "৩ ঘণ্টার স্টেপ-বাই-স্টেপ ভিডিও টিউটোরিয়াল", price: 149, oldPrice: 599, popular: true },
      { id: "prompts", title: "৫০০+ Premium AI Prompt প্যাক", desc: "ফ্রিল্যান্সিংয়ের জন্য রেডি-টু-ইউজ প্রম্পট লাইব্রেরি", price: 99, oldPrice: 299, popular: false },
      { id: "group", title: "প্রাইভেট সাপোর্ট গ্রুপ (লাইফটাইম)", desc: "এক্সক্লুসিভ কমিউনিটি + সরাসরি প্রশ্নের উত্তর", price: 199, oldPrice: 999, popular: false }
    ]
  }
};

export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  type: "ebook" | "physical";
  imageUrl?: string;
  videoUrl?: string;
  youtubeUrl?: string;
  isUpsell?: boolean;
  status: string;
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/api/products`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || [];
  } catch {
    return [];
  }
}

export const DEFAULT_EBOOK: Ebook = {
  title: "AI দিয়ে ফ্রিল্যান্সিং",
  subtitle: "ঘরে বসে অনলাইনে আয়ের সম্পূর্ণ গাইড",
  description: "",
  price: 99,
  originalPrice: 499,
  coverUrl: "",
  hasFile: false
};

export const DEFAULT_PAYMENT: Payment = {
  bkashNumber: "",
  nagadNumber: "",
  instructions: ""
};

export interface EbookResponse {
  ebook: Ebook;
  payment: Payment;
  content: Content;
}

export interface CreateOrderInput {
  name: string;
  phone: string;
  email?: string;
  method: "bkash" | "nagad";
  transactionId: string;
  amount: number;
  orderBump?: boolean;
}

export async function fetchEbookContent(): Promise<EbookResponse> {
  const res = await fetch(`${API_URL}/api/ebook`);
  if (!res.ok) throw new Error("Failed to load content");
  const data = await res.json();
  return {
    ebook: { ...DEFAULT_EBOOK, ...(data.ebook || {}) },
    payment: { ...DEFAULT_PAYMENT, ...(data.payment || {}) },
    content: {
      ...DEFAULT_CONTENT,
      ...(data.content || {}),
      v2: { ...DEFAULT_CONTENT.v2, ...(data.content?.v2 || {}) }
    }
  };
}

export async function createOrder(payload: CreateOrderInput): Promise<{ orderId: string; status: string }> {
  const res = await fetch(`${API_URL}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Order submit failed");
  return data;
}
