import { useState } from "react";
import { Check, Gift, Loader2, Plus, X } from "lucide-react";
import { Section, Pill, CtaButton } from "./primitives";
import { useContent } from "../../context/ContentContext";
import { createOrder } from "../../lib/api";
import { toBn } from "../../lib/format";
import { trackInitiateCheckout, trackPurchase } from "../../lib/pixel";

const BN_ORDINAL = ["১", "২", "৩", "৪", "৫", "৬"];

export function Pricing() {
  const [selected, setSelected] = useState<string[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successOrderId, setSuccessOrderId] = useState("");
  const { content, ebook, payment, products } = useContent();
  const { v2 } = content;

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  // First product = main product being sold; rest = upsells
  const primaryProduct = products.find(p => p.type === "ebook") || products[0] || null;
  const upsellProducts = primaryProduct
    ? products.filter(p => p._id !== primaryProduct._id)
    : [];

  const mainPrice = primaryProduct ? primaryProduct.price : ebook.price;
  const mainOriginalPrice = primaryProduct && primaryProduct.originalPrice > primaryProduct.price
    ? primaryProduct.originalPrice
    : ebook.originalPrice;

  const productUpsells = upsellProducts.map((p) => ({
    id: p._id,
    title: p.title,
    desc: p.description || "",
    price: p.price,
    oldPrice: p.originalPrice || p.price,
    popular: false,
    imageUrl: p.imageUrl
  }));
  const allUpsells = [...v2.upsells, ...productUpsells];

  const upsellTotal = allUpsells.filter((u) => selected.includes(u.id)).reduce((a, u) => a + u.price, 0);
  const bonuses = v2.bonuses?.length ? v2.bonuses : content.bonuses;
  const total = mainPrice + upsellTotal;
  const savings = Math.max(0, mainOriginalPrice - mainPrice);
  const savingsPercent = mainOriginalPrice > 0 ? Math.round((savings / mainOriginalPrice) * 100) : 0;

  async function submitOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setSubmitting(true);
    setError("");
    setSuccessOrderId("");

    try {
      const order = await createOrder({
        name: String(formData.get("name") || "").trim(),
        phone: String(formData.get("phone") || "").trim(),
        email: String(formData.get("email") || "").trim(),
        method: String(formData.get("method") || "bkash") as "bkash" | "nagad",
        transactionId: String(formData.get("transactionId") || "").trim(),
        amount: total,
        orderBump: selected.length > 0
      });
      setSuccessOrderId(order.orderId);
      trackPurchase({
        orderId: order.orderId,
        value: total,
        currency: "BDT",
        productTitle: primaryProduct?.title || ebook.title,
        productId: primaryProduct?._id || "main-ebook",
        quantity: 1 + selected.length
      });
      form.reset();
    } catch (err: any) {
      setError(err.message || "Order submit failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Section className="bg-white" id="pricing">
      <div className="text-center">
        <Pill tone="orange">⏳ আজকের অফার</Pill>
        <h2 className="mt-4 text-navy" style={{ fontSize: "clamp(1.6rem,5vw,2.4rem)", fontWeight: 800 }}>
          সব কিছু পাচ্ছেন মাত্র এক প্যাকেজে
        </h2>
      </div>

      <div className="mx-auto mt-10 max-w-xl overflow-hidden rounded-3xl border-2 border-green/40 bg-white shadow-[0_30px_70px_-30px_rgba(0,208,132,0.45)]">
        <div className="bg-navy px-6 py-8 text-center">
          {primaryProduct && (
            <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-white/60">{primaryProduct.title}</p>
          )}
          {mainOriginalPrice > mainPrice && (
            <p className="text-white/50 line-through" style={{ fontSize: "1.25rem" }}>
              {toBn(mainOriginalPrice)} টাকা
            </p>
          )}
          <p className="mt-1 text-green" style={{ fontSize: "3.25rem", fontWeight: 800, lineHeight: 1 }}>
            মাত্র {toBn(mainPrice)} টাকা
          </p>
          {savings > 0 && (
            <span className="mt-3 inline-block rounded-full bg-orange/20 px-3 py-1 text-sm font-[600] text-orange">
              আপনি বাঁচাচ্ছেন {toBn(savings)} টাকা ({toBn(savingsPercent)}% ছাড়)
            </span>
          )}
        </div>

        <div className="p-6">
          <p className="font-[700] text-navy">সাথে ফ্রি বোনাস:</p>
          <div className="mt-3 space-y-3">
            {bonuses.map((b, i) => (
              <div key={b.title} className="flex items-center gap-3 rounded-xl border border-border bg-secondary px-4 py-3">
                <Gift className="h-5 w-5 shrink-0 text-orange" />
                <div className="flex-1">
                  <p className="font-[600] text-navy">বোনাস {BN_ORDINAL[i] ?? i + 1}: {b.title}</p>
                  <p className="text-sm text-muted-foreground">মূল্য {toBn(b.value)} টাকা</p>
                </div>
                <span className="shrink-0 rounded-full bg-green/15 px-2.5 py-1 text-xs font-[700] text-green-deep">
                  বিনামূল্যে
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border-2 border-dashed border-orange/40 bg-orange/[0.04] p-4">
            <p className="flex items-center gap-2 font-[700] text-navy">
              <Plus className="h-4 w-4 text-orange" />
              অর্ডারে যোগ করুন (স্পেশাল ছাড়ে):
            </p>
            <div className="mt-3 space-y-3">
              {allUpsells.map((u) => {
                const checked = selected.includes(u.id);
                return (
                  <label
                    key={u.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border bg-white p-3.5 transition-colors ${
                      checked ? "border-green ring-1 ring-green/40" : "border-border hover:border-orange/40"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                        checked ? "border-green bg-green text-[#062014]" : "border-muted-foreground/40"
                      }`}
                    >
                      {checked && <Check className="h-3.5 w-3.5" strokeWidth={4} />}
                    </span>
                    <input type="checkbox" checked={checked} onChange={() => toggle(u.id)} className="sr-only" />
                    <span className="flex-1">
                      <span className="flex items-center gap-2">
                        <span className="font-[600] text-navy">{u.title}</span>
                        {u.popular && (
                          <span className="rounded-full bg-orange px-2 py-0.5 text-[10px] font-[700] text-white">
                            জনপ্রিয়
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 block text-sm text-muted-foreground">{u.desc}</span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="block font-[700] text-green-deep">+{toBn(u.price)}৳</span>
                      <span className="block text-xs text-muted-foreground line-through">{toBn(u.oldPrice)}৳</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between rounded-xl bg-navy px-5 py-4">
            <span className="text-white/70">সর্বমোট</span>
            <span className="text-green" style={{ fontSize: "1.6rem", fontWeight: 800, lineHeight: 1 }}>
              {toBn(total)} টাকা
            </span>
          </div>

          <CtaButton full className="mt-4" onClick={() => { setCheckoutOpen(true); trackInitiateCheckout(total); }}>
            <Check className="h-5 w-5" strokeWidth={3} />
            এখনই অর্ডার করুন - {toBn(total)} টাকা
          </CtaButton>

          <div className="mt-4 flex items-center justify-center gap-2.5">
            {["bKash", "Nagad"].map((p) => (
              <span key={p} className="rounded-lg border border-border px-3 py-1.5 text-sm font-[600] text-muted-foreground">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      {checkoutOpen && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-navy/70 px-4 py-4 backdrop-blur-sm md:items-center">
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]">
            <div className="sticky top-0 flex items-center justify-between border-b border-border bg-white px-5 py-4">
              <div>
                <p className="text-sm font-[700] text-green-deep">Secure checkout</p>
                <h3 className="text-navy" style={{ fontSize: "1.35rem", fontWeight: 800 }}>
                  অর্ডার কনফার্ম করুন
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-navy"
                aria-label="Close checkout"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form className="space-y-4 p-5" onSubmit={submitOrder}>
              <div className="rounded-2xl bg-secondary p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-[700] text-navy">মোট পেমেন্ট</span>
                  <span className="text-green-deep" style={{ fontSize: "1.65rem", fontWeight: 800 }}>
                    {toBn(total)} টাকা
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  bKash/Nagad Send Money করে Transaction ID দিয়ে অর্ডার সাবমিট করুন।
                </p>
                <div className="mt-3 grid gap-2 text-sm md:grid-cols-2">
                  <div className="rounded-xl border border-border bg-white px-3 py-2">
                    <span className="block text-muted-foreground">bKash</span>
                    <strong className="text-navy">{payment.bkashNumber || "Admin settings থেকে নম্বর দিন"}</strong>
                  </div>
                  <div className="rounded-xl border border-border bg-white px-3 py-2">
                    <span className="block text-muted-foreground">Nagad</span>
                    <strong className="text-navy">{payment.nagadNumber || "Admin settings থেকে নম্বর দিন"}</strong>
                  </div>
                </div>
              </div>

              <CheckoutField label="আপনার নাম" name="name" required />
              <CheckoutField label="ফোন নাম্বার" name="phone" required />
              <CheckoutField label="ইমেইল (optional)" name="email" type="email" />

              <label className="block">
                <span className="mb-1.5 block text-sm font-[700] text-navy">পেমেন্ট মাধ্যম</span>
                <select name="method" className="h-12 w-full rounded-xl border border-border bg-white px-4 text-navy outline-none focus:border-green">
                  <option value="bkash">bKash</option>
                  <option value="nagad">Nagad</option>
                </select>
              </label>

              <CheckoutField label="Transaction ID" name="transactionId" required />

              {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-[700] text-red-700">{error}</p>}
              {successOrderId && (
                <div className="rounded-xl bg-green/10 px-4 py-3 text-sm text-green-deep">
                  <strong className="block">অর্ডার সাবমিট হয়েছে!</strong>
                  <span>Order ID: {successOrderId}</span>
                </div>
              )}

              <CtaButton full type="submit" disabled={submitting}>
                {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5" strokeWidth={3} />}
                {submitting ? "Submitting..." : "অর্ডার সাবমিট করুন"}
              </CtaButton>
            </form>
          </div>
        </div>
      )}
    </Section>
  );
}

function CheckoutField({
  label,
  name,
  type = "text",
  required = false
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-[700] text-navy">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="h-12 w-full rounded-xl border border-border bg-white px-4 text-navy outline-none focus:border-green"
      />
    </label>
  );
}
