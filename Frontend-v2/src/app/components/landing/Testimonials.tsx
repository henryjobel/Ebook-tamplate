import { Play, Star } from "lucide-react";
import { Section } from "./primitives";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useContent } from "../../context/ContentContext";

export function Testimonials() {
  const { content } = useContent();
  const { v2 } = content;

  return (
    <Section className="bg-navy">
      <h2 className="text-center text-white" style={{ fontSize: "clamp(1.6rem,5vw,2.4rem)", fontWeight: 800 }}>
        {v2.testimonialsTitle}
      </h2>

      <div className="mt-3 flex items-center justify-center gap-2">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-orange text-orange" />
          ))}
        </div>
        <span className="font-[700] text-white">{v2.ratingSummary}</span>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {v2.videoTestimonials.map((v) => (
          <div key={v.name} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
            <div className="group relative aspect-video cursor-pointer bg-navy-soft">
              <ImageWithFallback src={v.imageUrl} alt={`${v.name} এর টেস্টিমোনিয়াল`} className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green text-[#062014] shadow-lg transition-transform group-hover:scale-110">
                  <Play className="ml-0.5 h-6 w-6 fill-current" />
                </span>
              </div>
            </div>
            <div className="p-5">
              <p className="text-white/85" style={{ lineHeight: 1.6 }}>"{v.quote}"</p>
              <p className="mt-3 font-[600] text-white">{v.name}</p>
              <p className="text-sm text-white/50">{v.location}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {v2.reviews.map((r) => (
          <div key={r.name} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green/15 font-[700] text-green-deep">
                {r.name.charAt(0)}
              </span>
              <div>
                <p className="font-[600] text-navy">{r.name}</p>
                <div className="flex">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-orange text-orange" />
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-3 text-navy/80" style={{ lineHeight: 1.6 }}>{r.text}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
