import { useState } from "react";
import { ChevronDown, ShieldCheck } from "lucide-react";
import { Section } from "./primitives";
import { useContent } from "../../context/ContentContext";

export function Faq() {
  const [open, setOpen] = useState(0);
  const { content } = useContent();
  const { v2 } = content;

  return (
    <Section className="bg-secondary">
      <div className="grid items-start gap-10 md:grid-cols-[1.4fr_1fr]">
        <div>
          <h2 className="text-navy" style={{ fontSize: "clamp(1.6rem,5vw,2.4rem)", fontWeight: 800 }}>
            {v2.faqTitle}
          </h2>
          <div className="mt-6 space-y-3">
            {v2.faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={f.q} className="overflow-hidden rounded-2xl border border-border bg-white">
                  <button onClick={() => setOpen(isOpen ? -1 : i)} className="flex w-full items-center gap-3 px-5 py-4 text-left">
                    <span className="flex-1 font-[600] text-navy">{f.q}</span>
                    <ChevronDown className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  <div className="grid transition-all duration-300" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
                    <div className="overflow-hidden">
                      <p className="px-5 pb-4 text-muted-foreground" style={{ lineHeight: 1.6 }}>{f.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border-2 border-green/40 bg-white p-7 text-center shadow-[0_20px_50px_-25px_rgba(0,208,132,0.4)] md:sticky md:top-8">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green/15">
            <ShieldCheck className="h-8 w-8 text-green-deep" />
          </span>
          <h3 className="mt-4 text-navy" style={{ fontSize: "1.3rem", fontWeight: 800 }}>
            {v2.guaranteeTitle}
          </h3>
          <p className="mt-2 text-muted-foreground" style={{ lineHeight: 1.6 }}>
            {v2.guaranteeText}
          </p>
        </div>
      </div>
    </Section>
  );
}
