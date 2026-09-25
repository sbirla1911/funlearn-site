import Link from "next/link";
import type { Example, Accent } from "@/lib/content";
import { SubjectArt } from "./Art";

const accentStyles: Record<
  Accent,
  { bg: string; badge: string; interest: string; box: string }
> = {
  sky: {
    bg: "bg-sky-soft",
    badge: "bg-sky text-white",
    interest: "text-sky",
    box: "bg-white/70",
  },
  tangerine: {
    bg: "bg-tangerine-soft",
    badge: "bg-tangerine text-white",
    interest: "text-tangerine",
    box: "bg-white/70",
  },
  grass: {
    bg: "bg-grass-tint",
    badge: "bg-grass text-white",
    interest: "text-grass-dark",
    box: "bg-white/70",
  },
  grape: {
    bg: "bg-grape-soft",
    badge: "bg-grape text-white",
    interest: "text-grape",
    box: "bg-white/70",
  },
};

export default function ExampleCard({ example }: { example: Example }) {
  const s = accentStyles[example.accent];
  return (
    <Link
      href="/get-started"
      className={`group block rounded-4xl border border-black/[0.05] ${s.bg} p-6 shadow-card transition-transform duration-300 hover:-translate-y-1 sm:p-7`}
    >
      <div className="flex items-center gap-2">
        <span className={`rounded-full px-3 py-1 text-xs font-bold tracking-wide ${s.badge}`}>
          {example.subject}
        </span>
        <span className="rounded-full border border-black/10 bg-white/80 px-3 py-1 text-xs font-semibold text-muted">
          {example.grade}
        </span>
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-serif text-2xl font-bold text-ink">{example.title}</h3>
          <p className="mt-0.5 text-sm text-muted">
            for a kid who loves{" "}
            <span className={`font-serif italic ${s.interest}`}>{example.interest}</span>
          </p>
        </div>
        <div className="w-28 flex-none sm:w-32">
          <SubjectArt kind={example.illustration} className="w-full" />
        </div>
      </div>

      <p className="mt-3 text-[15px] leading-relaxed text-ink/75">{example.body}</p>

      <div className={`mt-4 rounded-2xl ${s.box} px-4 py-3 text-sm leading-relaxed text-muted`}>
        <span className="font-semibold text-ink underline decoration-black/20 underline-offset-2">
          Textbook version:
        </span>{" "}
        {example.textbook}
      </div>
    </Link>
  );
}
