"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Avatar from "@/components/Avatar";
import LessonLauncher from "@/components/LessonLauncher";
import StatsStrip from "@/components/StatsStrip";
import { SubjectTile } from "@/components/Art";
import { Sparkle, Hills, Sun } from "@/components/Illustrations";
import { LESSONS, watchHref, resolveLesson } from "@/lib/video/catalog";
import {
  communities,
  friends,
  savedContent,
  challenges,
  friendsLearning,
  outputKinds,
  leaderboard,
} from "@/lib/content";

const outputPillClass: Record<string, string> = {
  sky: "bg-sky-soft text-sky",
  grape: "bg-grape-soft text-grape",
  grass: "bg-grass-soft text-grass-dark",
};

const accentCard: Record<string, string> = {
  sky: "border-sky/30 bg-sky-soft/50",
  grape: "border-grape/30 bg-grape-soft/50",
  grass: "border-grass/30 bg-grass-soft/60",
  tangerine: "border-tangerine/30 bg-tangerine-soft/60",
};

/** Saved items that map to a real generated lesson open the player directly. */
const realLessonForIllustration: Record<string, string | undefined> = {
  football: "projectile__football__g9",
};
/** Fallback for saved items without a real lesson yet (mock animated player). */
const mockLessonForIllustration: Record<string, string> = {
  pancakes: "stoichiometry",
  plant: "photosynthesis",
  growth: "exponential",
};

export default function Dashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<"home" | "lessons">("home");
  const [query, setQuery] = useState("I want to learn projectile motion — I'm in grade 9 and love football");

  const createLesson = () => router.push(watchHref(resolveLesson(query).cacheKey));

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
                <li key={f.name}>
                  <Link
                    href="/community"
                    className="flex items-center gap-3 rounded-2xl border border-black/[0.06] bg-white px-3 py-2.5 transition hover:border-black/15"
                  >
                    <Avatar initial={f.initial} color={f.color} className="h-9 w-9 text-sm" />
                    <span className="text-sm font-semibold text-ink">{f.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* weekly leaderboard */}
          <div className="rounded-4xl border border-black/[0.06] bg-white p-4 shadow-card">
            <div className="mb-3 flex items-center gap-2">
              <span aria-hidden>🏆</span>
              <h2 className="text-sm font-bold uppercase tracking-wide text-muted">This week&apos;s leaders</h2>
            </div>
            <ol className="space-y-1.5">
              {leaderboard.map((p, i) => (
                <li key={p.name}>
                  <Link
                    href="/community"
                    className={`flex items-center gap-2.5 rounded-2xl px-2.5 py-2 transition hover:bg-black/[0.03] ${
                      p.you ? "bg-grape-soft" : ""
                    }`}
                  >
                    <span className={`w-4 text-center text-sm font-bold ${i === 0 ? "text-sunny" : "text-muted"}`}>
                      {i + 1}
                    </span>
                    <Avatar initial={p.initial} color={p.color} className="h-7 w-7 text-xs" />
                    <span className="flex-1 text-sm font-semibold text-ink">
                      {p.name}
                      {p.you && <span className="ml-1 text-xs font-bold text-grape">you</span>}
                    </span>
                    <span className="text-xs font-bold tabular-nums text-muted">{p.xp}</span>
                  </Link>
                </li>
              ))}
            </ol>
            <p className="mt-2.5 rounded-2xl bg-sunny/20 px-3 py-2 text-xs font-semibold text-[#9a7a12]">
              120 XP behind Sam — close the gap!
            </p>
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

          {/* tabs */}
          <div className="mt-6 inline-flex rounded-full border border-black/10 bg-white p-1 shadow-sm">
            {(["home", "lessons"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-full px-5 py-2 text-sm font-bold capitalize transition ${
                  tab === t ? "bg-ink text-paper" : "text-muted hover:text-ink"
                }`}
              >
                {t === "home" ? "Home" : "My lessons"}
              </button>
            ))}
          </div>

          {tab === "home" && (
            <>
              <div className="mt-6">
                <StatsStrip />
              </div>

              <CreateCard query={query} setQuery={setQuery} onCreate={createLesson} />

              {/* three columns */}
              <div className="mt-6 grid gap-5 md:grid-cols-3">
                {/* saved */}
                <section className="rounded-4xl border border-black/[0.06] bg-white p-5 shadow-card">
                  <h3 className="font-serif text-xl font-bold text-ink">Saved content</h3>
                  <ul className="mt-4 space-y-3">
                    {savedContent.map((s) => {
                      const realKey = realLessonForIllustration[s.illustration];
                      const row = (
                        <span className="flex w-full items-center gap-3 rounded-xl p-1 text-left transition hover:bg-black/[0.03]">
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
                        </span>
                      );
                      return (
                        <li key={s.title}>
                          {realKey ? (
                            <Link href={watchHref(realKey)} className="block">
                              {row}
                            </Link>
                          ) : (
                            <LessonLauncher lessonId={mockLessonForIllustration[s.illustration]}>
                              {(open) => (
                                <button onClick={open} className="block w-full">
                                  {row}
                                </button>
                              )}
                            </LessonLauncher>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </section>

                {/* challenges */}
                <section className="rounded-4xl border border-sunny/50 bg-sunny/20 p-5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-xl font-bold text-ink">This week&apos;s challenges</h3>
                      <span aria-hidden>🏆</span>
                    </div>
                    <span className="rounded-full bg-white/70 px-2.5 py-0.5 text-xs font-bold text-ink">
                      {challenges.filter((c) => c.done).length}/{challenges.length}
                    </span>
                  </div>
                  <ul className="mt-4 space-y-3">
                    {challenges.map((c) => (
                      <li key={c.text}>
                        <Link
                          href={watchHref("projectile__football__g9")}
                          className="flex items-start gap-3 rounded-2xl bg-white/70 px-3 py-3 transition hover:bg-white"
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
                          <span className={`flex-1 text-sm font-medium ${c.done ? "text-muted line-through" : "text-ink"}`}>
                            {c.text}
                          </span>
                          <span className={`flex-none rounded-full px-2 py-0.5 text-[11px] font-bold ${
                            c.done ? "bg-grass/15 text-grass-dark" : "bg-sunny/50 text-[#9a7a12]"
                          }`}>
                            +{c.xp} XP
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex items-center gap-2 rounded-2xl bg-tangerine-soft px-3 py-2.5 text-xs font-semibold text-tangerine">
                    <span aria-hidden>🔥</span>
                    Solve 1 more today to keep your 5-day streak going!
                  </div>
                </section>

                {/* friends learning */}
                <section className="rounded-4xl border border-black/[0.06] bg-white p-5 shadow-card">
                  <h3 className="font-serif text-xl font-bold text-ink">What your friends are learning</h3>
                  <ul className="mt-4 space-y-4">
                    {friendsLearning.map((f) => (
                      <li key={f.name}>
                        <Link href="/community" className="flex items-center gap-3 rounded-xl p-1 transition hover:bg-black/[0.03]">
                          <Avatar initial={f.initial} color={f.color} className="h-9 w-9 flex-none text-sm" />
                          <p className="flex-1 text-sm text-ink">
                            <span className="font-semibold">{f.name}:</span> {f.topic}{" "}
                            <span className="text-muted">through {f.via}</span>
                          </p>
                          <SubjectTile kind={f.illustration} className="h-8 w-10 flex-none overflow-hidden rounded-lg" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </>
          )}

          {tab === "lessons" && (
            <>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {LESSONS.map((l) => (
                  <Link
                    key={l.cacheKey}
                    href={watchHref(l.cacheKey)}
                    className={`group rounded-4xl border p-5 shadow-card transition hover:-translate-y-0.5 ${accentCard[l.accent]}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-2xl shadow-sm">{l.emoji}</span>
                      <span className="rounded-full bg-white/80 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-ink">
                        {l.subject} · Gr {l.grade}
                      </span>
                    </div>
                    <h3 className="mt-3 font-serif text-xl font-bold text-ink">{l.title}</h3>
                    <p className="text-sm text-muted">through {l.interest}</p>
                    <p className="mt-2 text-sm text-ink/80">{l.blurb}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-ink">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-paper">
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 translate-x-px" fill="currentColor" aria-hidden>
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </span>
                      Watch lesson
                    </span>
                  </Link>
                ))}
              </div>

              <CreateCard query={query} setQuery={setQuery} onCreate={createLesson} />
            </>
          )}
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

/** The "create my lesson" card — wired to open the matching real video. */
function CreateCard({ query, setQuery, onCreate }: { query: string; setQuery: (v: string) => void; onCreate: () => void }) {
  return (
    <div className="mt-6 rounded-4xl border border-black/[0.06] bg-white p-6 shadow-card sm:p-7">
      <h2 className="font-serif text-2xl font-bold text-ink">Create my lesson</h2>
      <p className="mt-1 text-sm text-muted">Tell us the topic, your grade and what you love — we&apos;ll make the video.</p>
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        rows={2}
        placeholder="e.g. I want to learn projectile motion, I'm in grade 9 and I love football"
        className="mt-4 w-full resize-none rounded-2xl border border-black/10 bg-paper px-4 py-3.5 text-ink placeholder:text-muted outline-none focus:border-grass"
      />

      <div className="mt-4 grid gap-5 sm:grid-cols-[1fr_auto]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted">I&apos;m into:</span>
            <button onClick={() => setQuery(query.replace(/basketball/gi, "").trim() + " football")} className="rounded-full bg-sunny/50 px-3 py-1 text-sm font-semibold text-ink transition hover:bg-sunny/70">
              Football
            </button>
            <button onClick={() => setQuery(query + " basketball")} className="rounded-full bg-grape-soft px-3 py-1 text-sm font-semibold text-grape transition hover:bg-grape/20">
              Basketball
            </button>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={onCreate}
              className="inline-flex items-center gap-2 rounded-full border-2 border-ink/15 bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-ink/30"
            >
              <span aria-hidden>📷</span> Snap the homework
            </button>
            <button
              onClick={onCreate}
              className="rounded-full bg-grass px-6 py-2.5 text-sm font-semibold text-white shadow-[0_3px_0_#3A9A5A] transition hover:-translate-y-0.5 hover:bg-grass-dark"
            >
              Make my lesson →
            </button>
          </div>
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
  );
}
