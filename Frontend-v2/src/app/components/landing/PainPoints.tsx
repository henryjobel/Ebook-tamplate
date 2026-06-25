import { Section } from "./primitives";
import { useContent } from "../../context/ContentContext";

export function PainPoints() {
  const { content } = useContent();
  const { v2 } = content;

  return (
    <Section className="bg-white">
      <h2 className="text-center text-navy" style={{ fontSize: "clamp(1.6rem,5vw,2.4rem)", fontWeight: 800 }}>
        {v2.painsTitle}
      </h2>
      <p className="mx-auto mt-3 max-w-md text-center text-muted-foreground">
        {v2.painsSubtitle}
      </p>

      <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
        {v2.pains.map((p) => (
          <div
            key={p.text}
            className="group flex items-start gap-4 rounded-2xl border border-border bg-secondary p-5 transition-all duration-200 hover:border-orange/40 hover:bg-orange/5"
          >
            <span className="text-3xl transition-transform duration-200 group-hover:scale-110">{p.emoji}</span>
            <p className="text-navy" style={{ lineHeight: 1.6 }}>{p.text}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
