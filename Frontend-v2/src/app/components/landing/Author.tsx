import { Section } from "./primitives";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useContent } from "../../context/ContentContext";

export function Author() {
  const { content } = useContent();
  const { author } = content.v2;

  return (
    <Section className="bg-white">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-green/30 blur-xl" />
          <ImageWithFallback
            src={author.photoUrl}
            alt={`লেখক ${author.name}-এর ছবি`}
            className="relative h-32 w-32 rounded-full object-cover ring-4 ring-green/30"
          />
        </div>

        <h2 className="mt-5 text-navy" style={{ fontSize: "1.6rem", fontWeight: 800 }}>
          {author.name}
        </h2>
        <p className="mt-1 font-[600] text-green-deep">{author.role}</p>

        <p className="mt-4 max-w-lg text-muted-foreground" style={{ lineHeight: 1.7 }}>
          {author.bio}
        </p>

        <div className="mt-7 grid w-full grid-cols-3 gap-3">
          {author.stats.map((b) => (
            <div key={b.label} className="rounded-2xl border border-border bg-secondary px-3 py-4">
              <p className="text-navy" style={{ fontSize: "1.4rem", fontWeight: 800 }}>{b.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{b.label}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
