import { Sparkles, ArrowRight } from "lucide-react";
import { useContent } from "../../context/ContentContext";

export function Header() {
  const { content, ebook } = useContent();
  const v2 = content.v2;
  const brandName = v2.brandName || content.brandName;
  const logoUrl = v2.logoUrl || content.logoUrl;
  const stickyCta = v2.stickyCta || content.stickyCta;

  return (
    <div className="sticky top-0 z-40 border-b border-white/10 bg-navy/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-3 md:px-8">
        <a href="#" className="flex items-center gap-2.5">
          {logoUrl ? (
            <img src={logoUrl} alt={brandName} className="h-9 w-9 rounded-xl object-cover" />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green text-[#062014] shadow-[0_6px_18px_-6px_rgba(0,208,132,0.8)]">
              <Sparkles className="h-5 w-5" />
            </span>
          )}
          <span
            className="block text-white"
            style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.05rem" }}
          >
            {brandName}
          </span>
        </a>

        <a
          href="#pricing"
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-green px-4 font-[700] text-[#062014] shadow-[0_6px_18px_-6px_rgba(0,208,132,0.7)] transition-all hover:-translate-y-0.5 active:scale-[0.98]"
        >
          <span className="hidden sm:inline">{stickyCta}</span>
          <span className="sm:hidden">{ebook.price}৳</span>
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
