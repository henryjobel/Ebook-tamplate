import { ButtonHTMLAttributes, ReactNode } from "react";
import { useContent } from "../../context/ContentContext";

/** Big thumb-friendly CTA button (min 56px height) with green glow on hover. */
export function CtaButton({
  children,
  variant = "green",
  className = "",
  full = false,
  type = "button",
  ...props
}: {
  children: ReactNode;
  variant?: "green" | "orange";
  className?: string;
  full?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const base =
    "relative inline-flex items-center justify-center gap-2 min-h-[56px] px-7 rounded-2xl text-[1.0625rem] font-[700] tracking-tight transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green/40";
  const tones =
    variant === "green"
      ? "bg-green text-[#062014] shadow-[0_10px_30px_-8px_rgba(0,208,132,0.6)] hover:shadow-[0_14px_40px_-6px_rgba(0,208,132,0.85)] hover:-translate-y-0.5"
      : "bg-orange text-white shadow-[0_10px_30px_-8px_rgba(255,107,53,0.55)] hover:shadow-[0_14px_40px_-6px_rgba(255,107,53,0.8)] hover:-translate-y-0.5";
  return (
    <button type={type} className={`${base} ${tones} ${full ? "w-full" : ""} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Pill({
  children,
  tone = "green",
}: {
  children: ReactNode;
  tone?: "green" | "orange" | "muted";
}) {
  const tones: Record<string, string> = {
    green: "bg-green/15 text-green border-green/30",
    orange: "bg-orange/15 text-orange border-orange/30",
    muted: "bg-white/10 text-white/80 border-white/15",
  };
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-[600] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`px-5 py-12 md:px-8 md:py-20 ${className}`}>
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

/** 3D-tilted ebook cover mockup with a glowing aura behind it. */
export function BookCover({ className = "" }: { className?: string }) {
  const { ebook, products } = useContent();
  const primaryProduct = products.find(p => p.type === "ebook") || products[0] || null;
  const coverUrl = ebook.coverUrl || primaryProduct?.imageUrl || "";

  return (
    <div className={`relative ${className}`} style={{ perspective: "1400px" }}>
      {/* glow */}
      <div className="absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green/40 blur-[90px]" />
      <div className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange/25 blur-[70px]" />
      <div
        className="relative animate-[float_6s_ease-in-out_infinite]"
        style={{ transform: "rotateY(-16deg) rotateX(6deg) rotateZ(-2deg)" }}
      >
        {/* spine */}
        <div className="absolute -left-2 top-1 h-[calc(100%-8px)] w-3 rounded-l-md bg-green-deep/80 blur-[0.5px]" />
        <div className="relative aspect-[3/4.2] w-[230px] overflow-hidden rounded-r-md rounded-l-sm bg-navy-soft shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)] ring-1 ring-white/10 md:w-[300px]">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={ebook.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <>
              {/* cover art fallback */}
              <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_20%_0%,#10314f_0%,#0A1628_60%)]" />
              <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-green/30 blur-2xl" />
              <div className="absolute -left-12 bottom-8 h-40 w-40 rounded-full bg-orange/25 blur-2xl" />
              <div className="relative flex h-full flex-col p-6">
                <span className="inline-flex w-fit items-center gap-1 rounded-full bg-green/20 px-3 py-1 text-[11px] font-[600] text-green">
                  ২০২৬ এডিশন
                </span>
                <div className="mt-auto">
                  <p className="text-[11px] font-[600] uppercase tracking-[0.2em] text-orange">
                    E-BOOK
                  </p>
                  <h3 className="mt-2 text-white" style={{ fontSize: "1.7rem", lineHeight: 1.2, fontWeight: 800 }}>
                    AI দিয়ে<br />ফ্রিল্যান্সিং
                  </h3>
                  <p className="mt-2 text-sm text-white/70">
                    ঘরে বসে অনলাইনে আয়ের সম্পূর্ণ গাইড
                  </p>
                  <div className="mt-4 h-1 w-16 rounded-full bg-green" />
                  <p className="mt-4 text-xs text-white/50">রাকিব হাসান</p>
                </div>
              </div>
            </>
          )}
          {/* page edge */}
          <div className="absolute right-0 top-0 h-full w-1.5 bg-gradient-to-l from-white/30 to-transparent" />
        </div>
      </div>
    </div>
  );
}
