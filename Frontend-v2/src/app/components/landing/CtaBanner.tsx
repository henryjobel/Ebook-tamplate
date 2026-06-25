import { ArrowRight } from "lucide-react";
import { CtaButton } from "./primitives";

/** Slim conversion banner to drop between content sections. */
export function CtaBanner({
  title,
  subtitle,
  variant = "navy",
  buttonText = "৯৯ টাকায় নিন",
}: {
  title: string;
  subtitle?: string;
  variant?: "navy" | "light";
  buttonText?: string;
}) {
  const isNavy = variant === "navy";
  return (
    <section className={isNavy ? "bg-navy-soft" : "bg-secondary"}>
      <div className="mx-auto w-full max-w-6xl px-5 py-10 md:px-8 md:py-12">
        <div
          className={`flex flex-col items-center gap-5 rounded-3xl border p-7 text-center md:flex-row md:justify-between md:p-8 md:text-left ${
            isNavy ? "border-green/25 bg-green/[0.06]" : "border-orange/25 bg-orange/[0.06]"
          }`}
        >
          <div>
            <h3 className={isNavy ? "text-white" : "text-navy"} style={{ fontSize: "1.4rem", fontWeight: 800, lineHeight: 1.25 }}>
              {title}
            </h3>
            {subtitle && (
              <p className={`mt-1.5 ${isNavy ? "text-white/65" : "text-muted-foreground"}`} style={{ lineHeight: 1.6 }}>
                {subtitle}
              </p>
            )}
          </div>
          <CtaButton
            variant={isNavy ? "green" : "orange"}
            className="shrink-0"
            onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
          >
            {buttonText}
            <ArrowRight className="h-5 w-5" />
          </CtaButton>
        </div>
      </div>
    </section>
  );
}
