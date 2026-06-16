import React, { useEffect, useState } from "react";

const fallbackContent = {
  brandName: "",
  logoUrl: "",
  faviconUrl: "",
  seoImageUrl: "",
  heroBannerUrl: "",
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  seoCanonical: "",
  trustLine: "",
  stickyCta: "",
  footerText: "",
  heroKicker: "",
  heroHeadline: "",
  heroSubheadline: "",
  heroCta: "",
  whoForTitle: "",
  whoFor: [],
  painsTitle: "",
  pains: [],
  beforeAfterTitle: "",
  beforeAfter: [],
  insideTitle: "",
  inside: [],
  authorName: "",
  authorBio: "",
  authorBadges: [],
  ratingTitle: "",
  testimonials: [],
  bonuses: [],
  guaranteeTitle: "",
  guaranteeText: "",
  faqTitle: "",
  faqs: [],
  finalHeadline: "",
  finalText: "",
  customSections: []
};

const cmsNav = [
  ["global", "Global"],
  ["hero", "Hero"],
  ["sections", "Sections"],
  ["proof", "Proof"],
  ["offer", "Offer"],
  ["builder", "Builder"]
];

export default function AdminCms({ apiUrl }) {
  const [token, setToken] = useState(localStorage.getItem("adminToken") || "");
  const [login, setLogin] = useState({ email: "admin@example.com", password: "admin123" });
  const [tab, setTab] = useState("global");
  const [settings, setSettings] = useState(null);
  const [content, setContent] = useState(fallbackContent);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (token) loadSettings();
  }, [token]);

  async function authed(path, options = {}) {
    return fetch(`${apiUrl}${path}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`
      }
    });
  }

  async function loadSettings() {
    const res = await authed("/api/admin/settings");
    if (!res.ok) {
      localStorage.removeItem("adminToken");
      setToken("");
      return;
    }
    const result = await res.json();
    setSettings(result);
    setContent({ ...fallbackContent, ...(result.content || {}) });
  }

  async function doLogin(event) {
    event.preventDefault();
    setMessage("");
    const res = await fetch(`${apiUrl}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(login)
    });
    const result = await res.json();
    if (!res.ok) return setMessage(result.message || "Login failed");
    localStorage.setItem("adminToken", result.token);
    setToken(result.token);
  }

  async function save(event) {
    event.preventDefault();
    setMessage("");
    const formData = new FormData(event.currentTarget);
    formData.set("title", settings?.ebook?.title || "Ebook");
    formData.set("subtitle", settings?.ebook?.subtitle || "");
    formData.set("description", settings?.ebook?.description || "");
    formData.set("price", settings?.ebook?.price || 0);
    formData.set("bkashNumber", settings?.payment?.bkashNumber || "");
    formData.set("nagadNumber", settings?.payment?.nagadNumber || "");
    formData.set("instructions", settings?.payment?.instructions || "");
    formData.set("contentJson", JSON.stringify(content));

    const res = await authed("/api/admin/settings", {
      method: "PUT",
      body: formData
    });
    const result = await res.json();
    if (!res.ok) return setMessage(result.message || "CMS save failed");
    setSettings(result);
    setContent({ ...fallbackContent, ...(result.content || {}) });
    setMessage("CMS saved successfully");
  }

  function update(key, value) {
    setContent((current) => ({ ...current, [key]: value }));
  }

  if (!token) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f0f0f1] px-5">
        <form className="w-full max-w-md rounded-md border border-slate-200 bg-white p-8 shadow-xl" onSubmit={doLogin}>
          <p className="text-xs font-black uppercase text-[#2271b1]">CMS Login</p>
          <h1 className="mt-2 text-3xl font-black">Landing CMS</h1>
          <div className="mt-7 grid gap-4">
            <input placeholder="Email" value={login.email} onChange={(event) => setLogin({ ...login, email: event.target.value })} />
            <input type="password" placeholder="Password" value={login.password} onChange={(event) => setLogin({ ...login, password: event.target.value })} />
            <button className="btn-primary h-12">Login</button>
          </div>
          {message && <p className="mt-4 rounded-md bg-red-50 p-3 text-sm font-bold text-red-700">{message}</p>}
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f0f0f1] text-[#1d2327]">
      <aside className="fixed inset-y-0 left-0 hidden w-72 bg-[#1d2327] text-white xl:block">
        <div className="border-b border-white/10 p-5">
          <p className="text-xs font-black uppercase text-[#72aee6]">Content manager</p>
          <h1 className="mt-1 text-2xl font-black">Landing CMS</h1>
        </div>
        <nav className="mt-4 grid gap-1 px-3">
          {cmsNav.map(([id, label]) => (
            <button
              className={`rounded-md px-4 py-3 text-left text-sm font-black ${tab === id ? "bg-[#2271b1] text-white" : "text-slate-300 hover:bg-[#2c3338] hover:text-white"}`}
              key={id}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-4 left-3 right-3 grid gap-2">
          <a className="rounded-md border border-white/10 px-4 py-3 text-sm font-black text-[#72aee6]" href="#/admin">Back to Dashboard</a>
          <a className="rounded-md border border-white/10 px-4 py-3 text-sm font-black text-slate-200" href="#/">Preview Landing</a>
        </div>
      </aside>

      <section className="xl:pl-72">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <p className="text-xs font-black uppercase text-[#2271b1]">Landing page editor</p>
              <h2 className="text-3xl font-black">{cmsLabel(tab)}</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <a className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700" href="#/admin">Dashboard</a>
              <a className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700" href="#/">Preview</a>
            </div>
          </div>
          <div className="mt-4 flex gap-2 overflow-auto xl:hidden">
            {cmsNav.map(([id, label]) => (
              <button className={`rounded-full px-4 py-2 text-sm font-black ${tab === id ? "bg-[#2271b1] text-white" : "bg-slate-100 text-slate-600"}`} key={id} onClick={() => setTab(id)}>
                {label}
              </button>
            ))}
          </div>
        </header>

        <form className="grid gap-6 p-5 lg:p-7" onSubmit={save}>
          {tab === "global" && (
            <CmsGrid>
              <Card title="Branding">
                <CmsText label="Brand name" value={content.brandName} onChange={(value) => update("brandName", value)} />
                <CmsText label="Trust line" value={content.trustLine} onChange={(value) => update("trustLine", value)} />
                <CmsText label="Sticky CTA" value={content.stickyCta} onChange={(value) => update("stickyCta", value)} />
                <CmsText label="Footer text" value={content.footerText} onChange={(value) => update("footerText", value)} />
              </Card>
              <Card title="Images">
                <Upload label="Logo upload" name="logoImage" />
                <Upload label="Favicon upload" name="faviconImage" />
                <Upload label="Hero banner upload" name="heroBannerImage" />
                <Upload label="SEO / social share image" name="seoImage" />
              </Card>
              <Card title="SEO Settings">
                <CmsText label="SEO title" value={content.seoTitle} onChange={(value) => update("seoTitle", value)} />
                <CmsText label="Meta description" textarea value={content.seoDescription} onChange={(value) => update("seoDescription", value)} />
                <CmsText label="Meta keywords" value={content.seoKeywords} onChange={(value) => update("seoKeywords", value)} />
                <CmsText label="Canonical URL" value={content.seoCanonical} onChange={(value) => update("seoCanonical", value)} />
              </Card>
            </CmsGrid>
          )}

          {tab === "hero" && (
            <Card title="Hero Content">
              <CmsText label="Kicker" value={content.heroKicker} onChange={(value) => update("heroKicker", value)} />
              <CmsText label="Headline" value={content.heroHeadline} onChange={(value) => update("heroHeadline", value)} />
              <CmsText label="Subheadline" textarea value={content.heroSubheadline} onChange={(value) => update("heroSubheadline", value)} />
              <CmsText label="CTA text" value={content.heroCta} onChange={(value) => update("heroCta", value)} />
            </Card>
          )}

          {tab === "sections" && (
            <CmsGrid>
              <Card title="Who Is This For">
                <CmsText label="Title" value={content.whoForTitle} onChange={(value) => update("whoForTitle", value)} />
                <TextList items={content.whoFor || []} onChange={(items) => update("whoFor", items)} />
              </Card>
              <Card title="Problem Section">
                <CmsText label="Title" value={content.painsTitle} onChange={(value) => update("painsTitle", value)} />
                <TextList items={content.pains || []} onChange={(items) => update("pains", items)} />
              </Card>
              <Card title="Before / After">
                <CmsText label="Title" value={content.beforeAfterTitle} onChange={(value) => update("beforeAfterTitle", value)} />
                <ObjectList items={content.beforeAfter || []} fields={[["before", "Before"], ["after", "After"]]} onChange={(items) => update("beforeAfter", items)} />
              </Card>
              <Card title="Inside / Chapters">
                <CmsText label="Title" value={content.insideTitle} onChange={(value) => update("insideTitle", value)} />
                <ObjectList items={content.inside || []} fields={[["title", "Chapter"], ["text", "Description"]]} onChange={(items) => update("inside", items)} />
              </Card>
            </CmsGrid>
          )}

          {tab === "proof" && (
            <CmsGrid>
              <Card title="Author">
                <Upload label="Author photo" name="authorImage" />
                <CmsText label="Author name" value={content.authorName} onChange={(value) => update("authorName", value)} />
                <CmsText label="Bio" textarea value={content.authorBio} onChange={(value) => update("authorBio", value)} />
                <TextList items={content.authorBadges || []} onChange={(items) => update("authorBadges", items)} />
              </Card>
              <Card title="Testimonials">
                <CmsText label="Rating title" value={content.ratingTitle} onChange={(value) => update("ratingTitle", value)} />
                <CmsText label="Video review URL" value={content.videoReviewUrl || ""} onChange={(value) => update("videoReviewUrl", value)} />
                <ObjectList items={content.testimonials || []} fields={[["name", "Name"], ["city", "City"], ["text", "Review"]]} onChange={(items) => update("testimonials", items)} />
              </Card>
            </CmsGrid>
          )}

          {tab === "offer" && (
            <CmsGrid>
              <Card title="Bonus Stack">
                <ObjectList items={content.bonuses || []} fields={[["title", "Title"], ["text", "Description"], ["value", "Value"]]} onChange={(items) => update("bonuses", items)} />
              </Card>
              <Card title="Guarantee">
                <Upload label="Guarantee badge" name="guaranteeImage" />
                <CmsText label="Title" value={content.guaranteeTitle} onChange={(value) => update("guaranteeTitle", value)} />
                <CmsText label="Text" textarea value={content.guaranteeText} onChange={(value) => update("guaranteeText", value)} />
              </Card>
              <Card title="FAQ">
                <CmsText label="Title" value={content.faqTitle} onChange={(value) => update("faqTitle", value)} />
                <ObjectList items={content.faqs || []} fields={[["q", "Question"], ["a", "Answer"]]} onChange={(items) => update("faqs", items)} />
              </Card>
              <Card title="Final CTA">
                <CmsText label="Headline" value={content.finalHeadline} onChange={(value) => update("finalHeadline", value)} />
                <CmsText label="Text" textarea value={content.finalText} onChange={(value) => update("finalText", value)} />
              </Card>
            </CmsGrid>
          )}

          {tab === "builder" && (
            <Card title="Custom Section Builder" subtitle="Add hero banner, text block, FAQ, or CTA strip sections for selling content.">
              <CustomSections items={content.customSections || []} onChange={(items) => update("customSections", items)} />
            </Card>
          )}

          <div className="sticky bottom-4 z-20 flex flex-col gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-xl md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-black">Ready to publish?</p>
              <p className="text-sm font-bold text-slate-500">Save korle landing page instantly update hobe.</p>
            </div>
            <button className="btn-primary h-12 min-w-44">Save CMS</button>
          </div>
          {message && <p className="rounded-md bg-emerald-50 p-3 text-sm font-bold text-emerald-800">{message}</p>}
        </form>
      </section>
    </main>
  );
}

function cmsLabel(tab) {
  return {
    global: "Global Settings",
    hero: "Hero Section",
    sections: "Page Sections",
    proof: "Author & Proof",
    offer: "Offer & FAQ",
    builder: "Section Builder"
  }[tab] || "CMS";
}

function CmsGrid({ children }) {
  return <div className="grid gap-6 2xl:grid-cols-2">{children}</div>;
}

function Card({ title, subtitle, children }) {
  return (
    <section className="rounded-md border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-5">
        <h3 className="text-xl font-black">{title}</h3>
        {subtitle && <p className="mt-1 text-sm font-bold text-slate-500">{subtitle}</p>}
      </div>
      <div className="grid gap-4 p-5">{children}</div>
    </section>
  );
}

function CmsText({ label, value, onChange, textarea = false }) {
  return (
    <label className="field-label">
      {label}
      {textarea ? <textarea value={value || ""} onChange={(event) => onChange(event.target.value)} /> : <input value={value || ""} onChange={(event) => onChange(event.target.value)} />}
    </label>
  );
}

function Upload({ label, name }) {
  return (
    <label className="field-label rounded-md border border-dashed border-slate-300 bg-slate-50 p-4">
      {label}
      <input name={name} type="file" accept="image/*" />
      <span className="text-xs font-bold text-slate-500">Saved in Backend/uploads</span>
    </label>
  );
}

function TextList({ items, onChange }) {
  return (
    <div className="grid gap-3">
      {items.map((item, index) => (
        <div className="grid gap-2 md:grid-cols-[1fr_auto]" key={index}>
          <input value={item || ""} onChange={(event) => onChange(items.map((value, itemIndex) => itemIndex === index ? event.target.value : value))} />
          <button className="table-action" type="button" onClick={() => onChange(items.filter((_value, itemIndex) => itemIndex !== index))}>Delete</button>
        </div>
      ))}
      <button className="table-action w-fit" type="button" onClick={() => onChange([...items, ""])}>Add item</button>
    </div>
  );
}

function ObjectList({ items, fields, onChange }) {
  return (
    <div className="grid gap-3">
      {items.map((item, index) => (
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3" key={index}>
          <div className="grid gap-3 md:grid-cols-2">
            {fields.map(([key, label]) => (
              <label className="field-label" key={key}>
                {label}
                <input value={item?.[key] || ""} onChange={(event) => onChange(items.map((value, itemIndex) => itemIndex === index ? { ...value, [key]: event.target.value } : value))} />
              </label>
            ))}
          </div>
          <button className="table-action mt-3" type="button" onClick={() => onChange(items.filter((_value, itemIndex) => itemIndex !== index))}>Delete row</button>
        </div>
      ))}
      <button className="table-action w-fit" type="button" onClick={() => onChange([...items, Object.fromEntries(fields.map(([key]) => [key, ""]))])}>Add row</button>
    </div>
  );
}

function CustomSections({ items, onChange }) {
  return (
    <div className="grid gap-4">
      {items.map((item, index) => (
        <div className="rounded-md border border-slate-200 bg-slate-50 p-4" key={index}>
          <div className="grid gap-3 lg:grid-cols-3">
            <label className="field-label">Section type
              <select value={item.type || "text"} onChange={(event) => onChange(items.map((value, itemIndex) => itemIndex === index ? { ...value, type: event.target.value } : value))}>
                <option value="hero-banner">Hero banner</option>
                <option value="text">Text block</option>
                <option value="faq">FAQ</option>
                <option value="cta">CTA strip</option>
              </select>
            </label>
            <CmsMiniInput label="Kicker" value={item.kicker} onChange={(value) => onChange(items.map((row, itemIndex) => itemIndex === index ? { ...row, kicker: value } : row))} />
            {index < 6 && <Upload label="Section image" name={`customSectionImage${index}`} />}
          </div>
          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            <CmsMiniInput label="Title" value={item.title} onChange={(value) => onChange(items.map((row, itemIndex) => itemIndex === index ? { ...row, title: value } : row))} />
            <CmsMiniInput label="Button / Question" value={item.buttonText || item.question || ""} onChange={(value) => onChange(items.map((row, itemIndex) => itemIndex === index ? { ...row, buttonText: value, question: value } : row))} />
          </div>
          <label className="field-label mt-3">Text / Answer
            <textarea value={item.text || item.answer || ""} onChange={(event) => onChange(items.map((row, itemIndex) => itemIndex === index ? { ...row, text: event.target.value, answer: event.target.value } : row))} />
          </label>
          <button className="table-action mt-3" type="button" onClick={() => onChange(items.filter((_row, itemIndex) => itemIndex !== index))}>Delete section</button>
        </div>
      ))}
      <button className="btn-primary w-fit" type="button" onClick={() => onChange([...items, { type: "text", kicker: "", title: "", text: "", imageUrl: "" }])}>Add new section</button>
    </div>
  );
}

function CmsMiniInput({ label, value, onChange }) {
  return (
    <label className="field-label">
      {label}
      <input value={value || ""} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
