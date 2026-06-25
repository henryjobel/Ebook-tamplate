import { Star, ShieldCheck, ArrowRight } from "lucide-react";
import { BookCover, CtaButton, Pill } from "./primitives";
import { useContent } from "../../context/ContentContext";

export function Hero() {
  const { content } = useContent();
  const { v2 } = content;
  const heroHeadline = v2.heroHeadline || content.heroHeadline;
  const heroSubheadline = v2.heroSubheadline || content.heroSubheadline;
  const trustLine = v2.trustLine || content.trustLine;
  const heroCta = v2.heroCta || content.heroCta;

  return (
    <header className="relative overflow-hidden bg-navy">
      {/* ambient glows */}
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-green/20 blur-[110px]" />
      <div className="pointer-events-none absolute -right-10 bottom-0 h-72 w-72 rounded-full bg-orange/15 blur-[120px]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_30%)]" />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-5 pb-16 pt-12 md:grid-cols-2 md:gap-8 md:px-8 md:pb-24 md:pt-20">
        <div className="order-2 text-center md:order-1 md:text-left">
          <Pill tone="orange">{v2.heroPill}</Pill>

          <h1
            className="mt-5 text-white"
            style={{ fontSize: "clamp(2rem, 7vw, 3.4rem)", lineHeight: 1.15, fontWeight: 800 }}
          >
            {heroHeadline}
          </h1>

          <p className="mx-auto mt-4 max-w-md text-white/65 md:mx-0" style={{ fontSize: "1.125rem", lineHeight: 1.6 }}>
            {heroSubheadline}
          </p>

          <div className="mt-5 flex items-center justify-center gap-2 md:justify-start">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-orange text-orange" />
              ))}
            </div>
            <span className="text-sm font-[600] text-white/80">{trustLine}</span>
          </div>

          <div className="mt-7 flex flex-col items-center gap-3 md:items-start">
            <CtaButton onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}>
              {heroCta}
              <ArrowRight className="h-5 w-5" />
            </CtaButton>
            <span className="inline-flex items-center gap-1.5 text-sm text-white/55">
              <ShieldCheck className="h-4 w-4 text-green" />
              {v2.heroGuaranteeBadge}
            </span>
          </div>
        </div>

        <div className="order-1 flex justify-center md:order-2">
          <BookCover />
        </div>
      </div>
    </header>
  );
}
