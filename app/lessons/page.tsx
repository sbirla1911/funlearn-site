import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LessonCard from "@/components/LessonCard";
import Reveal from "@/components/Reveal";
import { StudyingArt } from "@/components/Art";
import { Sparkle } from "@/components/Illustrations";
import { examples } from "@/lib/content";

export default function Lessons() {
  return (
    <main className="overflow-x-hidden">
      <Header variant="sub" />

      <section className="mx-auto grid w-full max-w-6xl items-center gap-8 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-grape-soft px-4 py-1.5 text-sm font-bold text-grape">
              <span aria-hidden>▶</span> Watch a few
            </span>
            <Sparkle className="w-6" />
          </div>
          <h1 className="mt-4 font-serif text-5xl font-black leading-[1.05] text-ink sm:text-6xl">
            Lessons that actually <span className="marker">click.</span>
          </h1>
          <p className="mt-4 max-w-md text-lg text-muted">
            A few example videos — the same concept, taught through what a kid already
            loves. Press play on any of them.
          </p>
          <Link
            href="/get-started"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-grass px-7 py-3.5 text-base font-semibold text-white shadow-[0_4px_0_#3A9A5A] transition hover:-translate-y-0.5 hover:bg-grass-dark"
          >
            Make your own <span aria-hidden>→</span>
          </Link>
        </div>
        <StudyingArt className="mx-auto w-full max-w-sm" />
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-20 sm:px-8">
        <div className="grid gap-6 sm:grid-cols-2">
          {examples.map((ex, i) => (
            <Reveal key={ex.id} delay={i * 80}>
              <LessonCard example={ex} />
            </Reveal>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
