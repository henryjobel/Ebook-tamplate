import { useState } from "react";
import { ChevronDown, Lock } from "lucide-react";
import { Section } from "./primitives";
import { BookCover } from "./primitives";
import { useContent } from "../../context/ContentContext";

const NUMERALS = ["০১", "০২", "০৩", "০৪", "০৫", "০৬", "০৭", "০৮"];

export function InsideBook() {
  const [open, setOpen] = useState(0);
  const { content } = useContent();
  const { v2 } = content;

  return (
    <Section className="bg-secondary">
      <h2 className="text-center text-navy" style={{ fontSize: "clamp(1.6rem,5vw,2.4rem)", fontWeight: 800 }}>
        {v2.insideTitle}
      </h2>
      <p className="mx-auto mt-3 max-w-md text-center text-muted-foreground">
        {v2.insideSubtitle}
      </p>

      <div className="mt-10 grid items-start gap-10 md:grid-cols-[1.4fr_1fr]">
        <div className="space-y-3">
          {v2.chapters.map((c, i) => {
            const isOpen = open === i;
            return (
              <div
                key={c.title}
                className="overflow-hidden rounded-2xl border border-border bg-white"
              >
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center gap-4 px-5 py-4 text-left"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-[700] text-green">
                    {NUMERALS[i] ?? i + 1}
                  </span>
                  <span className="flex-1 font-[600] text-navy">{c.title}</span>
                  {c.locked ? (
                    <Lock className="h-4 w-4 shrink-0 text-orange" />
                  ) : (
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  )}
                </button>
                <div
                  className="grid transition-all duration-300"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-4 pl-[4.75rem] text-muted-foreground" style={{ lineHeight: 1.6 }}>
                      {c.locked ? "🔒 আনলক করতে বইটি ডাউনলোড করুন।" : c.text}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="hidden justify-center md:flex">
          <BookCover className="scale-90" />
        </div>
      </div>
    </Section>
  );
}
