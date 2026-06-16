import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import AdminDashboard from "./admin/AdminDashboard.jsx";
import "./styles.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const DEFAULT_CONTENT = {
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

function money(amount) {
  return new Intl.NumberFormat("bn-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0
  }).format(amount || 0);
}

function App() {
  const [route, setRoute] = useState(window.location.hash || "#/");

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || "#/");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  if (route.startsWith("#/admin/cms")) return <Admin />;
  return route.startsWith("#/admin") ? <AdminDashboard apiUrl={API_URL} money={money} /> : <Landing />;
}

function useCountdown(hours = 8) {
  const [endTime] = useState(() => Date.now() + hours * 60 * 60 * 1000);
  const [remaining, setRemaining] = useState(endTime - Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRemaining(Math.max(0, endTime - Date.now()));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [endTime]);

  const totalSeconds = Math.floor(remaining / 1000);
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const s = String(totalSeconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function Landing() {
  const [data, setData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    method: "bkash",
    transactionId: "",
    orderBump: false
  });
  const [message, setMessage] = useState("");
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(false);
  const countdown = useCountdown(7);

  useEffect(() => {
    fetch(`${API_URL}/api/ebook`)
      .then((res) => {
        if (!res.ok) throw new Error("API response failed");
        return res.json();
      })
      .then(setData)
      .catch(() => setLoadError("Backend চালু নেই অথবা http://localhost:5000/api/ebook পাওয়া যাচ্ছে না।"));
  }, []);

  const price = data?.ebook.price || 499;
  const originalPrice = price + 700;
  const bumpPrice = 99;
  const totalPrice = price + (form.orderBump ? bumpPrice : 0);
  const paymentNumber = useMemo(() => {
    if (!data) return "";
    return form.method === "bkash" ? data.payment.bkashNumber : data.payment.nagadNumber;
  }, [data, form.method]);

  async function submitOrder(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch(`${API_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        amount: totalPrice
      })
    });
    const result = await res.json();
    setLoading(false);

    if (!res.ok) {
      setMessage(result.message || "অর্ডার সাবমিট হয়নি");
      return;
    }

    setMessage(`অর্ডার জমা হয়েছে। অর্ডার আইডি: ${result.orderId}`);
    setForm({ name: "", phone: "", email: "", method: "bkash", transactionId: "", orderBump: false });
  }

  if (!data) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#fff7ed] px-6 text-center text-slate-700">
        <div className="max-w-lg rounded-3xl border border-orange-200 bg-white p-8 shadow-xl">
          {!loadError && <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-orange-900/15 border-t-orange-600" />}
          <p className="text-xl font-black">{loadError ? "Backend চালু করতে হবে" : "ল্যান্ডিং পেজ লোড হচ্ছে..."}</p>
          {loadError && (
            <>
              <p className="mt-3 leading-7 text-slate-600">{loadError}</p>
              <div className="mt-5 rounded-2xl bg-slate-100 p-4 text-left text-sm font-bold text-slate-700">
                <p>PowerShell command:</p>
                <code className="mt-2 block break-words">cd "E:\Tamplate\Ebook Tamplate\Backend"</code>
                <code className="mt-1 block">npm run dev</code>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  const content = { ...DEFAULT_CONTENT, ...(data.content || {}) };
  const logoSrc = content.logoUrl ? `${API_URL}${content.logoUrl}` : "";

  const cta = (label = `${content.stickyCta} - ${money(price)} মাত্র`) => (
    <button className="btn-primary" onClick={() => setModalOpen(true)}>
      {label}
    </button>
  );

  const whoFor = Array.isArray(content.whoFor) ? content.whoFor : DEFAULT_CONTENT.whoFor;
  const pains = Array.isArray(content.pains) ? content.pains : DEFAULT_CONTENT.pains;
  const beforeAfter = (Array.isArray(content.beforeAfter) ? content.beforeAfter : DEFAULT_CONTENT.beforeAfter)
    .map((item) => Array.isArray(item) ? { before: item[0], after: item[1] } : item);
  const inside = (Array.isArray(content.inside) ? content.inside : DEFAULT_CONTENT.inside)
    .map((item) => Array.isArray(item) ? { title: item[0], text: item[1] } : item);
  const testimonials = (Array.isArray(content.testimonials) ? content.testimonials : DEFAULT_CONTENT.testimonials)
    .map((item) => Array.isArray(item) ? { name: item[0], city: item[1], text: item[2] } : item);
  const bonuses = (Array.isArray(content.bonuses) ? content.bonuses : DEFAULT_CONTENT.bonuses)
    .map((item) => Array.isArray(item) ? { title: item[0], text: item[1], value: item[2] } : item);
  const faqs = Array.isArray(content.faqs) ? content.faqs : DEFAULT_CONTENT.faqs;
  const totalValue = originalPrice + bonuses.reduce((sum, item) => sum + Number(item.value || 0), 0);
  const productImage = data.ebook.coverUrl ? `${API_URL}${data.ebook.coverUrl}` : "";

  function openCheckout() {
    setCartOpen(false);
    setModalOpen(true);
  }

  return (
    <main className="min-h-screen bg-[#fff7ed] text-[#18130f]">
      <div className="fixed inset-x-0 top-0 z-50 border-b border-orange-950/10 bg-[#18130f] text-white shadow-lg">
        <div className="mx-auto flex min-h-14 max-w-7xl flex-col items-center justify-between gap-3 px-4 py-3 text-center sm:flex-row sm:text-left">
          <p className="text-sm font-black">{content.trustLine}</p>
          <p className="rounded-full bg-white/10 px-4 py-2 text-sm font-black">শেষ হচ্ছে - {countdown}</p>
          <button className="rounded-md bg-[#f97316] px-5 py-2 text-sm font-black text-white shadow-lg" onClick={() => setModalOpen(true)}>
            {content.stickyCta} - {money(price)}
          </button>
        </div>
      </div>

      <header className="pt-24 sm:pt-16">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <a className="flex items-center gap-3 font-black" href="#/">
            {logoSrc ? <img className="h-11 w-11 rounded-md object-cover" src={logoSrc} alt={content.brandName} /> : <span className="grid h-11 w-11 place-items-center rounded-md bg-[#18130f] text-xl text-white">ই</span>}
            <span>{content.brandName}</span>
          </a>
          <div className="hidden items-center gap-7 text-sm font-bold text-slate-700 md:flex">
            <a href="#product">প্রোডাক্ট</a>
            <a href="#for">কার জন্য</a>
            <a href="#inside">ভেতরে কী আছে</a>
            <a href="#reviews">রিভিউ</a>
            <a href="#checkout">প্রাইস</a>
          </div>
          <button className="relative rounded-md border border-orange-200 bg-white px-4 py-2 text-sm font-black text-orange-700 shadow-sm" onClick={() => setCartOpen(true)}>
            Cart
            <span className="ml-2 inline-grid h-5 w-5 place-items-center rounded-full bg-orange-600 text-xs text-white">1</span>
          </button>
        </nav>
      </header>

      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 pb-16 pt-7 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:pb-24">
        <div>
          <p className="section-kicker">{content.heroKicker}</p>
          <h1 className="mt-4 max-w-4xl text-5xl font-black leading-[1.02] sm:text-6xl lg:text-7xl">
            {content.heroHeadline}
          </h1>
          <p className="mt-6 max-w-2xl text-xl font-bold leading-9 text-slate-700">
            {content.heroSubheadline || data.ebook.subtitle}
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            {cta(`${content.heroCta} - মাত্র ${money(price)}`)}
            <button className="rounded-md border border-orange-300 bg-white px-6 py-3 font-black text-orange-700 shadow-sm" onClick={() => setCartOpen(true)}>
              কার্টে যোগ করুন
            </button>
            <div>
              <p className="text-sm font-bold text-slate-500">এই অফার শেষ হচ্ছে</p>
              <p className="text-3xl font-black text-orange-600">{countdown}</p>
            </div>
          </div>
          <p className="mt-6 text-sm font-black text-slate-700">{content.trustLine}</p>
        </div>

        <div className="relative mx-auto w-full max-w-[530px]">
          <div className="rounded-[2rem] border border-white bg-white/80 p-5 shadow-[0_40px_120px_rgba(67,39,18,0.18)]">
            <div className="grid gap-5 sm:grid-cols-[0.78fr_1fr]">
              <div className="book-cover min-h-[420px]">
                {data.ebook.coverUrl ? (
                  <img src={`${API_URL}${data.ebook.coverUrl}`} alt={data.ebook.title} />
                ) : (
                  <div className="flex h-full flex-col justify-between bg-[#18130f] p-8 text-white">
                    <span className="text-sm font-black text-orange-300">বাংলা eBook</span>
                    <div>
                      <strong className="block text-5xl font-black leading-none">Roadmap</strong>
                      <span className="mt-4 block text-sm font-semibold text-orange-100">Action Guide + Checklist</span>
                    </div>
                    <small className="font-bold text-white/60">Secure digital download</small>
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-between rounded-2xl bg-orange-50 p-6">
                <div>
                  <p className="text-sm font-black text-orange-600">আজকের দাম</p>
                  <p className="mt-2 text-4xl font-black text-[#18130f]">{money(price)}</p>
                  <p className="mt-2 text-sm font-bold text-slate-500 line-through">রেগুলার: {money(originalPrice)}</p>
                </div>
                <div className="mt-8 space-y-3 text-sm font-bold text-slate-700">
                  <p>✓ Secure download link</p>
                  <p>✓ Bonus checklist included</p>
                  <p>✓ ১৪ দিনের guarantee</p>
                </div>
                <button className="btn-primary mt-8 w-full" onClick={() => setCartOpen(true)}>
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProductCommerceSection
        productImage={productImage}
        title={data.ebook.title}
        description={data.ebook.description}
        price={price}
        originalPrice={originalPrice}
        onCart={() => setCartOpen(true)}
        onBuy={openCheckout}
      />

      <SalesSection id="for" kicker="Who is this for?" title={content.whoForTitle}>
        <div className="grid gap-3 md:grid-cols-2">
          {whoFor.map((item) => <CheckCard key={item}>{item}</CheckCard>)}
        </div>
        <p className="mt-8 rounded-2xl bg-orange-100 p-6 text-xl font-black text-orange-950">তাহলে এই বইটা তোমার জন্যই লেখা।</p>
      </SalesSection>

      <CtaStrip text={`আর দেরি না - এখনই নাও → ${money(price)} মাত্র`} action={cta()} />

      <SalesSection kicker="Problem Agitation" title={content.painsTitle}>
        <div className="grid gap-4">
          {pains.map((item) => <PainRow key={item}>{item}</PainRow>)}
        </div>
        <p className="mt-8 text-xl font-bold leading-9 text-slate-700">তুমি একা না, হাজার হাজার মানুষ এই একই জায়গায় আটকে আছে। পার্থক্য হলো, clear roadmap থাকলে এগোনো অনেক সহজ।</p>
      </SalesSection>

      <SalesSection kicker="Before vs After" title={content.beforeAfterTitle}>
        <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:grid-cols-2">
          <div className="border-b border-slate-200 p-6 md:border-b-0 md:border-r">
            <h3 className="text-2xl font-black text-red-700">❌ আগে</h3>
            <div className="mt-5 space-y-4">
              {beforeAfter.map((item) => <p className="rounded-xl bg-red-50 p-4 font-bold text-red-900" key={item.before}>{item.before}</p>)}
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-2xl font-black text-emerald-800">✅ পরে</h3>
            <div className="mt-5 space-y-4">
              {beforeAfter.map((item) => <p className="rounded-xl bg-emerald-50 p-4 font-bold text-emerald-900" key={item.after}>{item.after}</p>)}
            </div>
          </div>
        </div>
        <p className="mt-8 text-center text-2xl font-black">এই transformation টাই এই বইয়ের মূল উদ্দেশ্য।</p>
      </SalesSection>

      <CtaStrip text={`এই transformation চাইলে এখনই শুরু করো → ${money(price)}`} action={cta("শুরু করতে চাই")} dark />

      <SalesSection id="inside" kicker="What's Inside" title={content.insideTitle}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {inside.map(({ title, text }) => (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm" key={title}>
              <p className="text-sm font-black text-orange-600">{title}</p>
              <p className="mt-3 text-lg font-bold leading-7 text-slate-700">{text}</p>
            </div>
          ))}
        </div>
      </SalesSection>

      <SalesSection kicker="Author Credibility" title="কেন আমাকে বিশ্বাস করবে?">
        <div className="grid gap-8 rounded-3xl bg-[#18130f] p-6 text-white md:grid-cols-[260px_1fr] md:p-8">
          {content.authorPhotoUrl ? (
            <img className="aspect-square rounded-3xl object-cover" src={`${API_URL}${content.authorPhotoUrl}`} alt={content.authorName} />
          ) : (
            <div className="grid aspect-square place-items-center rounded-3xl bg-white/10 text-center text-6xl font-black">A</div>
          )}
          <div>
            <p className="text-sm font-black text-orange-300">Author</p>
            <h3 className="mt-2 text-3xl font-black">{content.authorName}</h3>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-white/75">{content.authorBio}</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {(content.authorBadges || []).map((badge) => (
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 text-sm font-black" key={badge}>{badge}</div>
              ))}
            </div>
          </div>
        </div>
      </SalesSection>

      <CtaStrip text="এই expert-এর কাছ থেকে শিখতে চাই → এখনই নাও" action={cta("এখনই নাও")} />

      <SalesSection id="reviews" kicker="Social Proof" title={content.ratingTitle}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map(({ name, city, text, imageUrl }) => (
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm" key={name}>
              <div className="flex items-center gap-3">
                {imageUrl ? (
                  <img className="h-12 w-12 rounded-full object-cover" src={`${API_URL}${imageUrl}`} alt={name} />
                ) : (
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-orange-100 font-black text-orange-700">{name[0]}</div>
                )}
                <div>
                  <p className="font-black">{name}</p>
                  <p className="text-xs font-bold text-slate-500">{city}</p>
                </div>
              </div>
              <p className="mt-4 text-sm font-black text-orange-500">⭐⭐⭐⭐⭐</p>
              <p className="mt-3 leading-7 text-slate-700">{text}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 grid min-h-64 place-items-center rounded-3xl bg-[#18130f] p-8 text-center text-white">
          <div>
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-white text-3xl text-[#18130f]">▶</div>
            <p className="mt-5 text-xl font-black">{content.videoReviewUrl ? "Video review" : "Video review placeholder"}</p>
            <p className="mt-2 text-white/60">YouTube embed এখানে বসানো যাবে।</p>
          </div>
        </div>
      </SalesSection>

      <SalesSection kicker="Chapter Deep Dive" title="ভেতরে ঠিক কী আছে?">
        <div className="space-y-4">
          {inside.map(({ title, text }, index) => (
            <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[120px_1fr]" key={title}>
              <p className="text-3xl font-black text-orange-600">Chapter {index + 1}</p>
              <div>
                <h3 className="text-2xl font-black">{title}</h3>
                <p className="mt-2 leading-7 text-slate-600">{text} - এই chapter শেষে তুমি নির্দিষ্ট outcome নিয়ে বের হতে পারবে।</p>
              </div>
            </div>
          ))}
        </div>
      </SalesSection>

      <CtaStrip text="এই সব শিখতে চাই → এখনই ডাউনলোড করি" action={cta("ডাউনলোড করতে চাই")} dark />

      <SalesSection kicker="Bonus Stack" title="আজকেই কিনলে এই Bonus গুলো পাবে একদম FREE">
        <div className="grid gap-4 lg:grid-cols-3">
          {bonuses.map(({ title, text, value }) => (
            <div className="rounded-3xl border border-orange-200 bg-orange-50 p-6" key={title}>
              <p className="text-sm font-black text-orange-600">Bonus</p>
              <h3 className="mt-2 text-2xl font-black">{title}</h3>
              <p className="mt-3 leading-7 text-slate-700">{text}</p>
              <p className="mt-5 text-xl font-black text-orange-700">Value {money(value)}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {[["Main eBook", originalPrice], ["Bonus 1", bonuses[0]?.value || 0], ["Bonus 2", bonuses[1]?.value || 0], ["Bonus 3", bonuses[2]?.value || 0], ["Total Value", totalValue], ["আজকের দাম", price]].map(([label, value]) => (
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 last:border-b-0" key={label}>
              <span className="font-bold">{label}</span>
              <span className={`font-black ${label === "আজকের দাম" ? "text-2xl text-orange-600" : ""}`}>{money(value)}</span>
            </div>
          ))}
        </div>
      </SalesSection>

      <SalesSection kicker="Guarantee" title={content.guaranteeTitle}>
        <div className="grid gap-8 rounded-3xl border border-emerald-200 bg-emerald-50 p-8 md:grid-cols-[180px_1fr]">
          {content.guaranteeBadgeUrl ? (
            <img className="aspect-square rounded-full object-cover" src={`${API_URL}${content.guaranteeBadgeUrl}`} alt={content.guaranteeTitle} />
          ) : (
            <div className="grid aspect-square place-items-center rounded-full bg-emerald-700 text-center text-4xl font-black text-white">14<br />DAY</div>
          )}
          <div>
            <p className="text-2xl font-black">{content.guaranteeText}</p>
            <p className="mt-4 text-lg font-bold leading-8 text-emerald-950/75">Risk সম্পূর্ণ তোমার উপর না, আমার উপর। তুমি শুধু guide follow করে দেখো এটা তোমার কাজে লাগে কিনা।</p>
          </div>
        </div>
      </SalesSection>

      <CtaStrip text={`Risk নেই - আজই চেষ্টা করো → ${money(price)} মাত্র`} action={cta("Risk-free শুরু করি")} />

      <section id="checkout" className="bg-[#18130f] px-5 py-16 text-white sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="section-kicker text-orange-300">Secure Checkout</p>
            <h2 className="mt-3 text-4xl font-black leading-tight">Order complete করতে আর মাত্র - {countdown} বাকি</h2>
            <p className="mt-5 text-xl font-bold text-white/70">
              <span className="line-through">{money(originalPrice)}</span> → আজকের দাম: <span className="text-orange-300">{money(price)}</span>
            </p>
            <button className="mt-8 rounded-md bg-orange-500 px-7 py-4 font-black text-white shadow-xl" onClick={() => setModalOpen(true)}>
              Checkout করুন →
            </button>
          </div>
          <div className="rounded-3xl bg-white p-6 text-[#18130f]">
            <OrderForm
              data={data}
              form={form}
              setForm={setForm}
              submitOrder={submitOrder}
              loading={loading}
              message={message}
              paymentNumber={paymentNumber}
              price={price}
              bumpPrice={bumpPrice}
              totalPrice={totalPrice}
            />
          </div>
        </div>
      </section>

      <SalesSection id="faq" kicker="FAQ" title={content.faqTitle}>
        <div className="grid gap-4">
          {faqs.map(({ q, a }) => <Faq key={q} title={q}>{a}</Faq>)}
        </div>
      </SalesSection>

      <CtaStrip text={`সব প্রশ্নের উত্তর পেয়েছো? এখনই নাও → ${money(price)}`} action={cta("এখনই নিতে চাই")} dark />

      <section className="px-5 py-20 text-center sm:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="mx-auto inline-flex rounded-full bg-orange-100 px-5 py-2 text-sm font-black text-orange-700">শেষ সুযোগ - {countdown}</p>
          <h2 className="mt-6 text-5xl font-black leading-tight">{content.finalHeadline}</h2>
          <p className="mt-5 text-xl font-bold text-slate-700">{content.finalText}</p>
          <div className="mt-9">{cta("আমি রেডি, এখনই নিতে চাই →")}</div>
        </div>
      </section>

      <footer className="border-t border-black/5 bg-white px-5 py-10 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xl font-black">{content.brandName}</p>
            <p className="mt-2 text-sm font-semibold text-slate-500">{content.footerText}</p>
          </div>
          <div className="flex gap-4 text-sm font-bold text-slate-600">
            <a href="#for">কার জন্য</a>
            <a href="#checkout">Checkout</a>
          </div>
        </div>
      </footer>

      {modalOpen && (
        <CheckoutModal
          data={data}
          form={form}
          loading={loading}
          message={message}
          paymentNumber={paymentNumber}
          setForm={setForm}
          submitOrder={submitOrder}
          onClose={() => setModalOpen(false)}
          price={price}
          bumpPrice={bumpPrice}
          totalPrice={totalPrice}
        />
      )}

      {cartOpen && (
        <CartDrawer
          title={data.ebook.title}
          productImage={productImage}
          price={price}
          originalPrice={originalPrice}
          form={form}
          setForm={setForm}
          bumpPrice={bumpPrice}
          totalPrice={totalPrice}
          onClose={() => setCartOpen(false)}
          onCheckout={openCheckout}
        />
      )}
    </main>
  );
}

function SalesSection({ id, kicker, title, children }) {
  return (
    <section id={id} className="px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-9 max-w-3xl">
          <p className="section-kicker">{kicker}</p>
          <h2 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">{title}</h2>
        </div>
        {children}
      </div>
    </section>
  );
}

function ProductCommerceSection({ productImage, title, description, price, originalPrice, onCart, onBuy }) {
  return (
    <section id="product" className="border-y border-orange-950/10 bg-white px-5 py-16 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="rounded-3xl border border-slate-200 bg-[#fff7ed] p-5">
          <div className="overflow-hidden rounded-2xl bg-[#18130f]">
            {productImage ? (
              <img className="h-full min-h-[420px] w-full object-cover" src={productImage} alt={title} />
            ) : (
              <div className="grid min-h-[420px] place-items-center p-10 text-center text-white">
                <div>
                  <p className="text-sm font-black text-orange-300">Digital eBook</p>
                  <h2 className="mt-3 text-5xl font-black">Premium Guide</h2>
                  <p className="mt-4 text-white/60">Cover image admin panel থেকে upload করা যাবে</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <p className="section-kicker">Product Details</p>
          <h2 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">{title}</h2>
          <p className="mt-5 text-lg font-semibold leading-8 text-slate-600">{description}</p>

          <div className="mt-7 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-black text-slate-500">Offer Price</p>
                <div className="mt-2 flex items-end gap-3">
                  <span className="text-4xl font-black text-orange-600">{money(price)}</span>
                  <span className="pb-1 text-lg font-bold text-slate-400 line-through">{money(originalPrice)}</span>
                </div>
              </div>
              <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">In stock: Digital delivery</span>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {["PDF / EPUB ready", "Secure download", "bKash / Nagad"].map((item) => (
                <div className="rounded-2xl bg-slate-50 p-4 text-sm font-black text-slate-700" key={item}>{item}</div>
              ))}
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <button className="btn-primary h-14" onClick={onBuy}>Buy now</button>
              <button className="h-14 rounded-md border border-orange-300 bg-orange-50 px-5 font-black text-orange-700" onClick={onCart}>
                Add to cart
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <TrustMini title="Payment" text="Manual verified order" />
            <TrustMini title="Delivery" text="Download link after approval" />
            <TrustMini title="Support" text="Email / WhatsApp help" />
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustMini({ title, text }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="font-black">{title}</p>
      <p className="mt-1 text-sm font-semibold text-slate-500">{text}</p>
    </div>
  );
}

function CartDrawer({ title, productImage, price, originalPrice, form, setForm, bumpPrice, totalPrice, onClose, onCheckout }) {
  return (
    <div className="fixed inset-0 z-[65] bg-slate-950/55" onMouseDown={onClose}>
      <aside className="ml-auto flex h-full w-full max-w-md flex-col bg-white shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <div>
            <p className="text-sm font-black text-orange-600">Shopping Cart</p>
            <h2 className="text-2xl font-black">Your order</h2>
          </div>
          <button className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-xl font-bold" onClick={onClose}>×</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-[#18130f]">
              {productImage ? <img className="h-full w-full object-cover" src={productImage} alt={title} /> : null}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-black leading-6">{title}</h3>
              <p className="mt-1 text-sm font-bold text-slate-500">Digital eBook</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xl font-black text-orange-600">{money(price)}</span>
                <span className="text-sm font-bold text-slate-400 line-through">{money(originalPrice)}</span>
              </div>
            </div>
          </div>

          <label className="mt-4 flex gap-3 rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm font-bold text-orange-950">
            <input
              className="mt-1 h-5 w-5 rounded border-slate-300 p-0"
              type="checkbox"
              checked={form.orderBump}
              onChange={(event) => setForm({ ...form, orderBump: event.target.checked })}
            />
            <span>Resource Pack add করুন - {money(bumpPrice)} extra</span>
          </label>
        </div>

        <div className="border-t border-slate-200 p-5">
          <div className="space-y-2 text-sm font-bold text-slate-600">
            <div className="flex justify-between"><span>Subtotal</span><span>{money(price)}</span></div>
            {form.orderBump && <div className="flex justify-between"><span>Resource Pack</span><span>{money(bumpPrice)}</span></div>}
            <div className="flex justify-between border-t border-slate-200 pt-3 text-xl font-black text-[#18130f]"><span>Total</span><span>{money(totalPrice)}</span></div>
          </div>
          <button className="btn-primary mt-5 h-14 w-full" onClick={onCheckout}>Proceed to checkout</button>
          <button className="mt-3 h-12 w-full rounded-md border border-slate-200 font-black text-slate-600" onClick={onClose}>Continue shopping</button>
        </div>
      </aside>
    </div>
  );
}

function CtaStrip({ text, action, dark = false }) {
  return (
    <section className={`${dark ? "bg-[#18130f] text-white" : "bg-orange-500 text-white"} px-5 py-8 sm:px-8`}>
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 text-center md:flex-row md:text-left">
        <p className="text-2xl font-black">{text}</p>
        <div className="shrink-0">{action}</div>
      </div>
    </section>
  );
}

function CheckCard({ children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 text-lg font-bold leading-8 shadow-sm">
      <span className="mr-2 text-emerald-600">✅</span>{children}
    </div>
  );
}

function PainRow({ children }) {
  return (
    <div className="rounded-2xl border border-red-100 bg-white p-5 text-lg font-bold leading-8 text-slate-800 shadow-sm">
      <span className="mr-2 text-red-600">●</span>{children}
    </div>
  );
}

function Faq({ title, children }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-black">{title}</h3>
      <p className="mt-3 leading-7 text-slate-600">{children}</p>
    </article>
  );
}

function CheckoutModal(props) {
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/65 p-4 backdrop-blur-sm" onMouseDown={props.onClose}>
      <div className="modal-panel max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8" onMouseDown={(event) => event.stopPropagation()}>
        <div className="mb-6 flex items-start justify-between gap-5">
          <div>
            <p className="section-kicker">Checkout</p>
            <h2 className="mt-2 text-3xl font-black">অর্ডার সম্পন্ন করুন</h2>
            <p className="mt-2 leading-7 text-slate-600">
              {props.paymentNumber} নম্বরে {props.form.method === "bkash" ? "bKash" : "Nagad"} Send Money করে Transaction ID দিন।
            </p>
          </div>
          <button className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-slate-200 text-xl font-bold text-slate-500 hover:bg-slate-50" onClick={props.onClose} aria-label="বন্ধ করুন">
            ×
          </button>
        </div>
        <OrderForm {...props} />
      </div>
    </div>
  );
}

function OrderForm({ data, form, setForm, submitOrder, loading, message, paymentNumber, price, bumpPrice, totalPrice }) {
  return (
    <form onSubmit={submitOrder} className="grid gap-4">
      <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
        <p className="font-black">Order Summary</p>
        <div className="mt-3 space-y-2 text-sm font-bold text-slate-700">
          <div className="flex justify-between"><span>Main eBook</span><span>{money(price)}</span></div>
          {form.orderBump && <div className="flex justify-between"><span>Resource Pack</span><span>{money(bumpPrice)}</span></div>}
          <div className="flex justify-between border-t border-orange-200 pt-2 text-lg font-black text-[#18130f]"><span>Total</span><span>{money(totalPrice)}</span></div>
        </div>
      </div>
      <label className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-700">
        <input
          className="mt-1 h-5 w-5 rounded border-slate-300 p-0"
          type="checkbox"
          checked={form.orderBump}
          onChange={(e) => setForm({ ...form, orderBump: e.target.checked })}
        />
        <span>হ্যাঁ! আমি সাথে "Resource Pack" ও নিতে চাই - মাত্র {money(bumpPrice)} extra</span>
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <input required placeholder="নাম" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input required placeholder="মোবাইল নম্বর" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      </div>
      <input required placeholder="ইমেইল (digital delivery-র জন্য)" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <div className="grid grid-cols-2 gap-3">
        <button type="button" className={`pay-tab ${form.method === "bkash" ? "pay-tab-active" : ""}`} onClick={() => setForm({ ...form, method: "bkash" })}>
          bKash দিয়ে পে করো
        </button>
        <button type="button" className={`pay-tab ${form.method === "nagad" ? "pay-tab-active" : ""}`} onClick={() => setForm({ ...form, method: "nagad" })}>
          Nagad দিয়ে পে করো
        </button>
      </div>
      <div className="rounded-2xl bg-slate-100 p-4 text-sm font-bold text-slate-700">
        {paymentNumber} নম্বরে Send Money করুন। তারপর Transaction ID দিন।
      </div>
      <input required placeholder="Transaction ID" value={form.transactionId} onChange={(e) => setForm({ ...form, transactionId: e.target.value })} />
      <button className="btn-primary h-14 w-full" disabled={loading}>
        {loading ? "পাঠানো হচ্ছে..." : "এখনই Payment করুন →"}
      </button>
      {message && <p className="rounded-2xl bg-slate-100 p-4 text-sm font-bold text-slate-700">{message}</p>}
    </form>
  );
}

function Admin() {
  const [token, setToken] = useState(localStorage.getItem("adminToken") || "");
  const [login, setLogin] = useState({ email: "admin@example.com", password: "admin123" });
  const [settings, setSettings] = useState(null);
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (token) loadAdmin();
  }, [token]);

  async function authed(path, options = {}) {
    return fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`
      }
    });
  }

  async function loadAdmin() {
    const [settingsRes, ordersRes] = await Promise.all([
      authed("/api/admin/settings"),
      authed("/api/admin/orders")
    ]);
    if (!settingsRes.ok || !ordersRes.ok) {
      localStorage.removeItem("adminToken");
      setToken("");
      return;
    }
    const nextSettings = await settingsRes.json();
    setSettings(nextSettings);
    setContent({ ...DEFAULT_CONTENT, ...(nextSettings.content || {}) });
    setOrders((await ordersRes.json()).orders);
  }

  async function doLogin(event) {
    event.preventDefault();
    setMessage("");
    const res = await fetch(`${API_URL}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(login)
    });
    const result = await res.json();
    if (!res.ok) return setMessage(result.message || "লগইন হয়নি");
    localStorage.setItem("adminToken", result.token);
    setToken(result.token);
  }

  async function saveSettings(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set("contentJson", JSON.stringify(content));
    const res = await authed("/api/admin/settings", {
      method: "PUT",
      body: formData
    });
    const result = await res.json();
    if (!res.ok) return setMessage(result.message || "সেভ হয়নি");
    setSettings(result);
    setContent({ ...DEFAULT_CONTENT, ...(result.content || {}) });
    setMessage("সেটিংস সেভ হয়েছে");
  }

  async function updateOrder(id, status) {
    const res = await authed(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    if (res.ok) loadAdmin();
  }

  function updateContent(key, value) {
    setContent((current) => ({ ...current, [key]: value }));
  }

  if (!token) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#fff7ed] px-5">
        <form className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-xl" onSubmit={doLogin}>
          <p className="section-kicker">Admin</p>
          <h1 className="mt-2 text-3xl font-black">Dashboard Login</h1>
          <div className="mt-7 grid gap-4">
            <input placeholder="ইমেইল" value={login.email} onChange={(e) => setLogin({ ...login, email: e.target.value })} />
            <input type="password" placeholder="পাসওয়ার্ড" value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} />
            <button className="btn-primary h-12 w-full">লগইন</button>
          </div>
          {message && <p className="mt-4 rounded-md bg-red-50 p-3 text-sm font-bold text-red-700">{message}</p>}
        </form>
      </main>
    );
  }

  if (!settings) {
    return <div className="grid min-h-screen place-items-center bg-[#fff7ed] px-6 text-center font-semibold text-slate-700">Admin লোড হচ্ছে...</div>;
  }

  return (
    <main className="min-h-screen bg-[#fff7ed] px-5 py-8 sm:px-8">
      <header className="mx-auto mb-7 flex max-w-7xl flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="section-kicker">Dashboard</p>
          <h1 className="mt-2 text-4xl font-black">ইবুক ম্যানেজমেন্ট</h1>
        </div>
        <div className="flex items-center gap-3">
          <a className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm" href="#/">Landing Page</a>
          <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-bold text-white" onClick={() => { localStorage.removeItem("adminToken"); setToken(""); }}>Logout</button>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <form className="grid gap-5" onSubmit={saveSettings}>
          <CmsPanel title="Product & Payment">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="ইবুক শিরোনাম"><input name="title" defaultValue={settings.ebook.title} /></Field>
              <Field label="দাম"><input name="price" type="number" defaultValue={settings.ebook.price} /></Field>
            </div>
            <Field label="সাবটাইটেল"><input name="subtitle" defaultValue={settings.ebook.subtitle} /></Field>
            <Field label="বিবরণ"><textarea name="description" defaultValue={settings.ebook.description} /></Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="bKash নম্বর"><input name="bkashNumber" defaultValue={settings.payment.bkashNumber} /></Field>
              <Field label="Nagad নম্বর"><input name="nagadNumber" defaultValue={settings.payment.nagadNumber} /></Field>
            </div>
            <Field label="পেমেন্ট নির্দেশনা"><textarea name="instructions" defaultValue={settings.payment.instructions} /></Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="ইবুক কভার আপলোড"><input name="coverImage" type="file" accept="image/*" /></Field>
              <Field label="ইবুক ফাইল আপলোড"><input name="ebookFile" type="file" accept=".pdf,.epub,.zip" /></Field>
            </div>
          </CmsPanel>

          <CmsPanel title="Global / Header">
            <div className="grid gap-4 md:grid-cols-2">
              <CmsText label="Brand name" value={content.brandName} onChange={(value) => updateContent("brandName", value)} />
              <Field label="Logo upload"><input name="logoImage" type="file" accept="image/*" /></Field>
            </div>
            <CmsText label="Trust line" value={content.trustLine} onChange={(value) => updateContent("trustLine", value)} />
            <CmsText label="Sticky CTA text" value={content.stickyCta} onChange={(value) => updateContent("stickyCta", value)} />
            <CmsText label="Footer text" value={content.footerText} onChange={(value) => updateContent("footerText", value)} />
          </CmsPanel>

          <CmsPanel title="Hero Section">
            <CmsText label="Hero kicker" value={content.heroKicker} onChange={(value) => updateContent("heroKicker", value)} />
            <CmsText label="Hero headline" value={content.heroHeadline} onChange={(value) => updateContent("heroHeadline", value)} />
            <CmsText label="Hero subheadline" textarea value={content.heroSubheadline} onChange={(value) => updateContent("heroSubheadline", value)} />
            <CmsText label="Hero CTA text" value={content.heroCta} onChange={(value) => updateContent("heroCta", value)} />
          </CmsPanel>

          <CmsPanel title="Who Is This For">
            <CmsText label="Section title" value={content.whoForTitle} onChange={(value) => updateContent("whoForTitle", value)} />
            <TextListEditor items={content.whoFor || []} onChange={(items) => updateContent("whoFor", items)} placeholder="Bullet text" />
          </CmsPanel>

          <CmsPanel title="Problem Agitation">
            <CmsText label="Section title" value={content.painsTitle} onChange={(value) => updateContent("painsTitle", value)} />
            <TextListEditor items={content.pains || []} onChange={(items) => updateContent("pains", items)} placeholder="Pain point" />
          </CmsPanel>

          <CmsPanel title="Before vs After">
            <CmsText label="Section title" value={content.beforeAfterTitle} onChange={(value) => updateContent("beforeAfterTitle", value)} />
            <ObjectListEditor
              items={content.beforeAfter || []}
              fields={[["before", "Before text"], ["after", "After text"]]}
              onChange={(items) => updateContent("beforeAfter", items)}
            />
          </CmsPanel>

          <CmsPanel title="What's Inside / Chapters">
            <CmsText label="Section title" value={content.insideTitle} onChange={(value) => updateContent("insideTitle", value)} />
            <ObjectListEditor
              items={content.inside || []}
              fields={[["title", "Chapter title"], ["text", "Description"]]}
              onChange={(items) => updateContent("inside", items)}
            />
          </CmsPanel>

          <CmsPanel title="Author Section">
            <div className="grid gap-4 md:grid-cols-2">
              <CmsText label="Author name" value={content.authorName} onChange={(value) => updateContent("authorName", value)} />
              <Field label="Author photo upload"><input name="authorImage" type="file" accept="image/*" /></Field>
            </div>
            <CmsText label="Author bio" textarea value={content.authorBio} onChange={(value) => updateContent("authorBio", value)} />
            <TextListEditor items={content.authorBadges || []} onChange={(items) => updateContent("authorBadges", items)} placeholder="Trust badge text" />
          </CmsPanel>

          <CmsPanel title="Social Proof">
            <CmsText label="Rating title" value={content.ratingTitle} onChange={(value) => updateContent("ratingTitle", value)} />
            <CmsText label="Video review URL" value={content.videoReviewUrl || ""} onChange={(value) => updateContent("videoReviewUrl", value)} />
            <TestimonialEditor items={content.testimonials || []} onChange={(items) => updateContent("testimonials", items)} />
          </CmsPanel>

          <CmsPanel title="Bonus Stack">
            <ObjectListEditor
              items={content.bonuses || []}
              fields={[["title", "Bonus title"], ["text", "Description"], ["value", "Value"]]}
              onChange={(items) => updateContent("bonuses", items)}
            />
          </CmsPanel>

          <CmsPanel title="Guarantee">
            <div className="grid gap-4 md:grid-cols-2">
              <CmsText label="Guarantee title" value={content.guaranteeTitle} onChange={(value) => updateContent("guaranteeTitle", value)} />
              <Field label="Guarantee badge upload"><input name="guaranteeImage" type="file" accept="image/*" /></Field>
            </div>
            <CmsText label="Guarantee text" textarea value={content.guaranteeText} onChange={(value) => updateContent("guaranteeText", value)} />
          </CmsPanel>

          <CmsPanel title="FAQ">
            <CmsText label="FAQ title" value={content.faqTitle} onChange={(value) => updateContent("faqTitle", value)} />
            <ObjectListEditor
              items={content.faqs || []}
              fields={[["q", "Question"], ["a", "Answer"]]}
              onChange={(items) => updateContent("faqs", items)}
            />
          </CmsPanel>

          <CmsPanel title="Final CTA">
            <CmsText label="Final headline" value={content.finalHeadline} onChange={(value) => updateContent("finalHeadline", value)} />
            <CmsText label="Final text" textarea value={content.finalText} onChange={(value) => updateContent("finalText", value)} />
          </CmsPanel>

          <button className="btn-primary sticky bottom-4 z-10 h-14 w-full text-base">সব পরিবর্তন সেভ করুন</button>
          {message && <p className="rounded-md bg-emerald-50 p-3 text-sm font-bold text-emerald-800">{message}</p>}
        </form>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-black">অর্ডার</h2>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-black text-slate-600">{orders.length} টি</span>
          </div>
          <div className="grid gap-3">
            {orders.length === 0 && <p className="rounded-md bg-slate-50 p-5 text-center font-semibold text-slate-500">এখনও কোনো অর্ডার নেই</p>}
            {orders.map((order) => (
              <article className="rounded-2xl border border-slate-200 bg-[#fbfaf6] p-4" key={order.id}>
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <h3 className="font-black">{order.name}</h3>
                    <p className="mt-1 text-sm font-semibold text-slate-600">{order.phone} | {order.method} | {order.transactionId}</p>
                    <p className="mt-1 text-sm font-black text-orange-700">{money(order.amount)} {order.orderBump ? "| Resource Pack" : ""}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-400">{new Date(order.createdAt).toLocaleString("bn-BD")}</p>
                  </div>
                  <span className={`status-pill ${order.status}`}>{order.status}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button className="rounded-md bg-[#18130f] px-4 py-2 text-sm font-bold text-white" onClick={() => updateOrder(order.id, "approved")}>Approve</button>
                  <button className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-700" onClick={() => updateOrder(order.id, "rejected")}>Reject</button>
                  {order.downloadToken && (
                    <a className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800" href={`${API_URL}/api/download/${order.downloadToken}`} target="_blank" rel="noreferrer">Download Link</a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function CmsPanel({ title, children }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-2xl font-black">{title}</h2>
      <div className="mt-5 grid gap-4">{children}</div>
    </section>
  );
}

function CmsText({ label, value, onChange, textarea = false }) {
  return (
    <Field label={label}>
      {textarea ? (
        <textarea value={value || ""} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input value={value || ""} onChange={(event) => onChange(event.target.value)} />
      )}
    </Field>
  );
}

function TextListEditor({ items, onChange, placeholder }) {
  const updateItem = (index, value) => {
    onChange(items.map((item, itemIndex) => itemIndex === index ? value : item));
  };

  const removeItem = (index) => {
    onChange(items.filter((_item, itemIndex) => itemIndex !== index));
  };

  return (
    <div className="grid gap-3">
      {items.map((item, index) => (
        <div className="grid gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 md:grid-cols-[1fr_auto]" key={`${placeholder}-${index}`}>
          <input placeholder={placeholder} value={item || ""} onChange={(event) => updateItem(index, event.target.value)} />
          <button className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-black text-red-700" type="button" onClick={() => removeItem(index)}>
            Delete
          </button>
        </div>
      ))}
      <button className="rounded-md border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-black text-orange-800" type="button" onClick={() => onChange([...items, ""])}>
        Add item
      </button>
    </div>
  );
}

function ObjectListEditor({ items, fields, onChange }) {
  const updateItem = (index, key, value) => {
    onChange(items.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item));
  };

  const removeItem = (index) => {
    onChange(items.filter((_item, itemIndex) => itemIndex !== index));
  };

  return (
    <div className="grid gap-3">
      {items.map((item, index) => (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3" key={`object-${index}`}>
          <div className="grid gap-3 md:grid-cols-2">
            {fields.map(([key, label]) => (
              <Field label={label} key={key}>
                <input value={item?.[key] || ""} onChange={(event) => updateItem(index, key, event.target.value)} />
              </Field>
            ))}
          </div>
          <button className="mt-3 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-black text-red-700" type="button" onClick={() => removeItem(index)}>
            Delete row
          </button>
        </div>
      ))}
      <button
        className="rounded-md border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-black text-orange-800"
        type="button"
        onClick={() => onChange([...items, Object.fromEntries(fields.map(([key]) => [key, ""]))])}
      >
        Add row
      </button>
    </div>
  );
}

function TestimonialEditor({ items, onChange }) {
  const updateItem = (index, key, value) => {
    onChange(items.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item));
  };

  const removeItem = (index) => {
    onChange(items.filter((_item, itemIndex) => itemIndex !== index));
  };

  return (
    <div className="grid gap-3">
      {items.map((item, index) => (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3" key={`testimonial-${index}`}>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Name"><input value={item.name || ""} onChange={(event) => updateItem(index, "name", event.target.value)} /></Field>
            <Field label="City"><input value={item.city || ""} onChange={(event) => updateItem(index, "city", event.target.value)} /></Field>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-[1fr_220px]">
            <Field label="Review"><textarea value={item.text || ""} onChange={(event) => updateItem(index, "text", event.target.value)} /></Field>
            {index < 6 && <Field label="Photo upload"><input name={`testimonialImage${index}`} type="file" accept="image/*" /></Field>}
          </div>
          <button className="mt-3 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-black text-red-700" type="button" onClick={() => removeItem(index)}>
            Delete testimonial
          </button>
        </div>
      ))}
      <button className="rounded-md border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-black text-orange-800" type="button" onClick={() => onChange([...items, { name: "", city: "", text: "", imageUrl: "" }])}>
        Add testimonial
      </button>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-700">
      {label}
      {children}
    </label>
  );
}

createRoot(document.getElementById("root")).render(<App />);
