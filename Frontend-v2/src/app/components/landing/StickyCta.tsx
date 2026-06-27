import { ArrowRight } from "lucide-react";
import { useContent } from "../../context/ContentContext";

export function StickyCta() {
  const { content, ebook, products } = useContent();
  const stickyCta = content.v2.stickyCta || content.stickyCta;

  const primaryProduct = products.find(p => p.type === "ebook") || products[0] || null;
  const mainPrice = primaryProduct ? primaryProduct.price : ebook.price;
  const mainOriginalPrice = primaryProduct && primaryProduct.originalPrice > primaryProduct.price
    ? primaryProduct.originalPrice : ebook.originalPrice;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-navy/95 px-4 py-3 backdrop-blur-md md:hidden">
      <div className="flex items-center gap-3">
        <div className="leading-tight">
          {mainOriginalPrice > mainPrice && (
            <p className="text-xs text-white/50 line-through">{mainOriginalPrice} টাকা</p>
          )}
          <p className="text-green" style={{ fontSize: "1.35rem", fontWeight: 800, lineHeight: 1 }}>{mainPrice} টাকা</p>
        </div>
        <button
          onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
          className="flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-xl bg-green font-[700] text-[#062014] shadow-[0_8px_24px_-6px_rgba(0,208,132,0.7)] active:scale-[0.98]"
        >
          {stickyCta}
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
