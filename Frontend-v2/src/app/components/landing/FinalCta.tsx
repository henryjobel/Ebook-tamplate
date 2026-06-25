import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { CtaButton } from "./primitives";
import { useContent } from "../../context/ContentContext";
import { toBn } from "../../lib/format";

export function FinalCta() {
  const { content } = useContent();
  const { v2 } = content;
  const [left, setLeft] = useState(v2.countdownSeconds);

  useEffect(() => {
    setLeft(v2.countdownSeconds);
  }, [v2.countdownSeconds]);

  useEffect(() => {
    const t = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const h = Math.floor(left / 3600);
  const m = Math.floor((left % 3600) / 60);
  const s = left % 60;
  const units = [
    { v: h, l: "ঘণ্টা" },
    { v: m, l: "মিনিট" },
    { v: s, l: "সেকেন্ড" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-navy via-navy to-green-deep px-5 py-16 text-center md:py-24">
      <div className="pointer-events-none absolute -left-10 top-10 h-60 w-60 rounded-full bg-green/30 blur-[100px]" />
      <div className="relative mx-auto max-w-2xl">
        <h2 className="text-white" style={{ fontSize: "clamp(1.9rem,6vw,3rem)", fontWeight: 800, lineHeight: 1.15 }}>
          {v2.finalHeadline}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-white/70" style={{ fontSize: "1.125rem", lineHeight: 1.6 }}>
          {v2.finalSubtext}
        </p>

        <div className="mt-7 flex items-center justify-center gap-3">
          {units.map((u) => (
            <div key={u.l} className="min-w-[72px] rounded-2xl border border-white/15 bg-white/10 px-3 py-3 backdrop-blur">
              <p className="text-white tabular-nums" style={{ fontSize: "1.8rem", fontWeight: 800, lineHeight: 1 }}>
                {toBn(u.v, 2)}
              </p>
              <p className="mt-1 text-xs text-white/60">{u.l}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-orange">⏳ অফার শেষ হওয়ার আগেই নিয়ে নিন</p>

        <div className="mt-7 flex justify-center">
          <CtaButton className="text-lg" onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}>
            {v2.finalCtaButtonText}
            <ArrowRight className="h-5 w-5" />
          </CtaButton>
        </div>
      </div>
    </section>
  );
}
