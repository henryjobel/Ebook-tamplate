import { Sparkles, Facebook, Youtube, Instagram, Send, Mail } from "lucide-react";
import { useContent } from "../../context/ContentContext";

const SOCIAL_ICONS: Record<string, typeof Facebook> = {
  Facebook: Facebook,
  YouTube: Youtube,
  Instagram: Instagram,
  Telegram: Send,
};

export function Footer() {
  const { content } = useContent();
  const { footer } = content.v2;
  const brandName = content.v2.brandName || content.brandName;
  const logoUrl = content.v2.logoUrl || content.logoUrl;

  return (
    <footer className="bg-navy">
      <div className="mx-auto w-full max-w-6xl px-5 py-12 md:px-8 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              {logoUrl ? (
                <img src={logoUrl} alt={brandName} className="h-9 w-9 rounded-xl object-cover" />
              ) : (
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green text-[#062014]">
                  <Sparkles className="h-5 w-5" />
                </span>
              )}
              <span className="text-white" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.05rem" }}>
                {brandName}
              </span>
            </div>
            <p className="mt-4 max-w-sm text-white/55" style={{ lineHeight: 1.7 }}>
              {footer.description}
            </p>
            {footer.email && (
              <a href={`mailto:${footer.email}`} className="mt-4 inline-flex items-center gap-2 text-sm text-white/65 transition-colors hover:text-green">
                <Mail className="h-4 w-4" />
                {footer.email}
              </a>
            )}
          </div>

          <div>
            <p className="font-[700] text-white">জরুরি লিংক</p>
            <ul className="mt-4 space-y-2.5">
              {footer.links.map((x) => (
                <li key={x.label}>
                  <a href={x.href} className="text-white/55 transition-colors hover:text-green">{x.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-[700] text-white">সোশ্যাল মিডিয়া</p>
            <div className="mt-4 flex gap-3">
              {footer.socials.map((s) => {
                const Icon = SOCIAL_ICONS[s.label] || Send;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/70 transition-all hover:-translate-y-0.5 hover:border-green/40 hover:text-green"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm text-white/40 md:flex-row">
          <p>{footer.copyright}</p>
          <p>{content.v2.heroGuaranteeBadge} সহ ✓</p>
        </div>
      </div>
    </footer>
  );
}
