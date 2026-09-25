import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroPreview from "@/components/HeroPreview";
import ExampleCard from "@/components/ExampleCard";
import Reveal from "@/components/Reveal";
import { Books, Gamepad, Sparkle } from "@/components/Illustrations";
import { examples } from "@/lib/content";

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <Header variant="landing" />

      {/* ───────────── Hero ───────────── */}
      <section className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 py-10 sm:px-8 sm:py-16 lg:grid-cols-[1fr_1.05fr]">
        <div>
          <h1 className="font-serif text-5xl font-black leading-[1.02] tracking-tight text-ink sm:text-6xl">
            Stuck on the hard stuff? Learn it with the thing{" "}
            <span className="marker">you love.</span>
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
            Tell FUNlearn what you&apos;re into and what you&apos;re stuck on, or snap a
            photo of the homework. It makes a short video, an infographic and a game
            that teach it your way!
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/get-started"
              className="inline-flex items-center gap-2 rounded-full bg-grass px-7 py-3.5 text-base font-semibold text-white shadow-[0_4px_0_#3A9A5A] transition hover:-translate-y-0.5 hover:bg-grass-dark"
            >
              Get started
              <span aria-hidden>→</span>
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-full border-2 border-ink/15 bg-white px-6 py-3 text-base font-semibold text-ink transition hover:border-ink/30"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-white">
                <svg viewBox="0 0 24 24" className="h-3 w-3 translate-x-px" fill="currentColor" aria-hidden>
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              See how it works
            </a>
          </div>

          {/* audience cards */}
          <div className="mt-8 grid max-w-md grid-cols-2 gap-3">
            <div className="flex items-center gap-3 rounded-2xl border border-black/[0.06] bg-white p-3 shadow-card">
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-sky-soft text-xl">
                🧒
              </span>
              <p className="text-sm leading-tight">
                <span className="font-bold text-ink">Students:</span>
                <br />
                <span className="text-muted">pick what you love.</span>
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-black/[0.06] bg-white p-3 shadow-card">
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-blossom-soft text-xl">
                🧑
              </span>
              <p className="text-sm leading-tight">
                <span className="font-bold text-ink">Parents:</span>
                <br />
                <span className="text-muted">send the stuck problem.</span>
              </p>
            </div>
          </div>
        </div>

        <Reveal>
          <HeroPreview />
        </Reveal>
      </section>

      {/* ───────────── Examples ───────────── */}
      <section id="how-it-works" className="mx-auto w-full max-w-6xl scroll-mt-20 px-5 py-16 sm:px-8 sm:py-20">
        <Reveal>
          <p className="font-sans text-sm font-bold uppercase tracking-[0.18em] text-teal">
            The concept stays. The way in changes.
          </p>
          <h2 className="mt-3 max-w-3xl font-serif text-4xl font-bold leading-tight text-ink sm:text-[42px]">
            Math, physics, chemistry, biology. Here are four kids and four ways in.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {examples.map((ex, i) => (
            <Reveal key={ex.id} delay={i * 80}>
              <ExampleCard example={ex} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────── Learn, play, remember band ───────────── */}
      <section className="px-5 pb-16 sm:px-8">
        <Reveal>
          <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-4 overflow-hidden rounded-[32px] bg-grass-tint px-6 py-12 text-center">
            <Gamepad className="absolute left-4 top-1/2 hidden w-28 -translate-y-1/2 sm:block" />
            <Books className="absolute right-4 top-1/2 hidden w-28 -translate-y-1/2 sm:block" />
            <Sparkle className="absolute left-1/4 top-6 w-6" />
            <Sparkle className="absolute right-1/4 bottom-6 w-6" />

            <div className="flex items-center gap-2">
              {[
                { label: "learn", cls: "bg-sunny text-ink" },
                { label: "play", cls: "bg-grape text-white" },
                { label: "remember", cls: "bg-grass text-white" },
              ].map((p) => (
                <span key={p.label} className={`rounded-full px-4 py-1.5 text-sm font-bold ${p.cls}`}>
                  {p.label}
                </span>
              ))}
            </div>

            <h2 className="font-serif text-4xl font-bold text-ink sm:text-[40px]">
              Learn, play, remember. <span className="marker-green">The fun way.</span>
            </h2>
            <p className="max-w-md text-muted">
              Bring a topic, a hobby and a homework problem. We&apos;ll bring the rest.
            </p>
            <Link
              href="/community"
              className="mt-1 rounded-full bg-white px-7 py-3 text-base font-semibold text-ink shadow-card transition hover:-translate-y-0.5"
            >
              Join the community
            </Link>
          </div>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}
