import { Check } from "lucide-react";
import { Section, Pill } from "./primitives";
import { useContent } from "../../context/ContentContext";

export function Benefits() {
  const { content } = useContent();
  const { v2 } = content;

  return (
    <Section className="bg-navy">
      <div className="text-center">
        <Pill tone="green">{v2.benefitsLabel}</Pill>
        <h2 className="mt-4 text-white" style={{ fontSize: "clamp(1.6rem,5vw,2.4rem)", fontWeight: 800 }}>
          {v2.benefitsTitle}
        </h2>
      </div>

      <div className="mx-auto mt-10 grid max-w-4xl gap-4 md:grid-cols-2">
        {v2.benefits.map((b) => (
          <div
            key={b}
            className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-colors hover:border-green/40 hover:bg-green/[0.06]"
          >
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green/15">
              <Check className="h-4 w-4 text-green" strokeWidth={3} />
            </span>
            <p className="text-white/85" style={{ lineHeight: 1.6 }}>{b}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
