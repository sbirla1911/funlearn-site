"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Avatar from "@/components/Avatar";
import LessonLauncher from "@/components/LessonLauncher";
import { SubjectTile } from "@/components/Art";
import { Sparkle, Hills, Sun } from "@/components/Illustrations";
import {
  communities,
  friends,
  savedContent,
  challenges,
  friendsLearning,
  outputKinds,
} from "@/lib/content";

const outputPillClass: Record<string, string> = {
  sky: "bg-sky-soft text-sky",
  grape: "bg-grape-soft text-grape",
  grass: "bg-grass-soft text-grass-dark",
};

/** Maps a saved-content illustration key to the matching lesson id. */
const lessonForIllustration: Record<string, string> = {
  football: "projectile",
  pancakes: "stoichiometry",
  plant: "photosynthesis",
  growth: "exponential",
};

export default function Dashboard() {
  return (
    <main className="relative min-h-screen overflow-x-hidden pb-40">
      <Header variant="app" />

      <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[240px_1fr]">
        {/* ── Sidebar ── */}
        <aside className="space-y-8">
          <div>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted">
              Your communities
            </h2>
            <ul className="space-y-2">
              {communities.map((c, i) => (
                <li key={c.id}>
                  <Link
                    href="/community"
                    className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition ${
                      i === 0
                        ? "border-sky/40 bg-sky-soft"
                        : "border-black/[0.06] bg-white hover:border-black/15"
                    }`}
                  >
                    <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-white text-lg shadow-sm">
                      {c.icon}
                    </span>
                    <span className="flex-1 text-sm font-semibold text-ink">{c.name}</span>
                    {c.isNew && (
                      <span className="rounded-full bg-sunny px-2 py-0.5 text-[11px] font-bold text-ink">
                        New
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted">Friends</h2>
            <ul className="space-y-2">
              {friends.map((f) => (
                <li
                  key={f.name}
                  className="flex items-center gap-3 rounded-2xl border border-black/[0.06] bg-white px-3 py-2.5"
                >
                  <Avatar initial={f.initial} color={f.color} className="h-9 w-9 text-sm" />
                  <span className="text-sm font-semibold text-ink">{f.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* ── Main ── */}
        <div>
          <div className="flex items-start gap-2">
            <h1 className="font-serif text-4xl font-black leading-tight text-ink sm:text-[40px]">
              Hey Maya, what are we untangling today?
            </h1>
            <Sparkle className="mt-1 w-8 flex-none" />
          </div>

          {/* create card */}
          <div className="mt-6 rounded-4xl border border-black/[0.06] bg-white p-6 shadow-card sm:p-7">
            <h2 className="font-serif text-2xl font-bold text-ink">Create something new</h2>
            <input
              type="text"
              defaultValue="Why does a free kick curve?"
              placeholder="What are you stuck on? Type a topic, e.g. why does a kick curve?"
              className="mt-4 w-full rounded-2xl border border-black/10 bg-paper px-4 py-3.5 text-ink placeholder:text-muted outline-none focus:border-grass"
            />

            <div className="mt-4 grid gap-5 sm:grid-cols-[1fr_auto]">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-muted">I&apos;m into:</span>
                  <span className="rounded-full bg-sunny/50 px-3 py-1 text-sm font-semibold text-ink">
                    Football
                  </span>
                  <span className="rounded-full bg-tangerine-soft px-3 py-1 text-sm font-semibold text-tangerine">
                    Cooking
                  </span>
                  <span className="rounded-full border border-dashed border-black/20 px-3 py-1 text-sm font-semibold text-muted">
                    + add
                  </span>
                </div>

                <LessonLauncher lessonId="projectile">
                  {(open) => (
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <button
                        onClick={open}
                        className="inline-flex items-center gap-2 rounded-full border-2 border-ink/15 bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-ink/30"
                      >
                        <span aria-hidden>📷</span> Snap the homework
                      </button>
                      <button
                        onClick={open}
                        className="rounded-full bg-grass px-6 py-2.5 text-sm font-semibold text-white shadow-[0_3px_0_#3A9A5A] transition hover:-translate-y-0.5 hover:bg-grass-dark"
                      >
                        Make my lesson
                      </button>
                    </div>
                  )}
                </LessonLauncher>
              </div>

              <div className="sm:border-l sm:border-black/[0.07] sm:pl-5">
                <p className="mb-2 text-sm text-muted">You&apos;ll get</p>
                <div className="flex flex-col gap-2">
                  {outputKinds.map((o) => (
                    <span
                      key={o.label}
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold ${outputPillClass[o.accent]}`}
                    >
                      <span aria-hidden>{o.icon}</span>
                      {o.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* three columns */}
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {/* saved */}
            <section className="rounded-4xl border border-black/[0.06] bg-white p-5 shadow-card">
              <h3 className="font-serif text-xl font-bold text-ink">Saved content</h3>
              <ul className="mt-4 space-y-3">
                {savedContent.map((s) => (
                  <li key={s.title}>
                    <LessonLauncher lessonId={lessonForIllustration[s.illustration]}>
                      {(open) => (
                        <button
                          onClick={open}
                          className="flex w-full items-center gap-3 rounded-xl p-1 text-left transition hover:bg-black/[0.03]"
                        >
                          <span className="relative flex h-12 w-16 flex-none items-center justify-center overflow-hidden rounded-xl border border-black/10">
                            <SubjectTile kind={s.illustration} className="h-full w-full" />
                            <span className="absolute flex h-6 w-6 items-center justify-center rounded-full bg-white/85 shadow">
                              <svg viewBox="0 0 24 24" className="h-3 w-3 translate-x-px text-ink" fill="currentColor" aria-hidden>
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </span>
                          </span>
                          <span>
                            <p className="text-sm font-semibold text-ink">{s.title}</p>
                            <p className="text-xs text-muted">
                              {s.kind} · {s.interest}
                            </p>
                          </span>
                        </button>
                      )}
                    </LessonLauncher>
                  </li>
                ))}
              </ul>
            </section>

            {/* challenges */}
            <section className="rounded-4xl border border-sunny/50 bg-sunny/20 p-5">
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl font-bold text-ink">This week&apos;s challenges</h3>
                <span aria-hidden>🏆</span>
              </div>
              <ul className="mt-4 space-y-3">
                {challenges.map((c) => (
                  <li
                    key={c.text}
                    className="flex items-start gap-3 rounded-2xl bg-white/70 px-3 py-3"
                  >
                    <span
                      className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full border-2 ${
                        c.done ? "border-grass bg-grass text-white" : "border-black/25"
                      }`}
                    >
                      {c.done && (
                        <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden>
                          <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span className="text-sm font-medium text-ink">{c.text}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* friends learning */}
            <section className="rounded-4xl border border-black/[0.06] bg-white p-5 shadow-card">
              <h3 className="font-serif text-xl font-bold text-ink">What your friends are learning</h3>
              <ul className="mt-4 space-y-4">
                {friendsLearning.map((f) => (
                  <li key={f.name} className="flex items-center gap-3">
                    <Avatar initial={f.initial} color={f.color} className="h-9 w-9 flex-none text-sm" />
                    <p className="flex-1 text-sm text-ink">
                      <span className="font-semibold">{f.name}:</span> {f.topic}{" "}
                      <span className="text-muted">through {f.via}</span>
                    </p>
                    <SubjectTile kind={f.illustration} className="h-8 w-10 flex-none overflow-hidden rounded-lg" />
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>

      {/* floating ask bubble */}
      <Link href="/community" className="fixed bottom-6 right-6 z-30 flex items-center gap-2">
        <span className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-ink shadow-soft transition hover:-translate-y-0.5">
          stuck? ask a question
        </span>
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sunny shadow-soft">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-ink" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinejoin="round" />
          </svg>
        </span>
      </Link>

      {/* decorative bottom */}
      <Sun className="pointer-events-none absolute bottom-16 left-8 hidden w-16 sm:block" />
      <Hills className="pointer-events-none absolute bottom-0 left-0 w-full" />
    </main>
  );
}
