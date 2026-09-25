import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Avatar from "@/components/Avatar";
import LessonCard from "@/components/LessonCard";
import Reveal from "@/components/Reveal";
import { TeamArt } from "@/components/Art";
import { friends, examples } from "@/lib/content";

const members = [{ name: "Maya", initial: "M", color: "sunny" }, ...friends, { name: "Aria", initial: "A", color: "sky" }];
const feed = examples.filter((e) => ["projectile", "exponential", "photosynthesis"].includes(e.id));

export default function Community() {
  return (
    <main className="overflow-x-hidden">
      <Header variant="sub" />

      {/* banner */}
      <section className="bg-grass-tint">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-3xl shadow-card">⚽</span>
              <div>
                <h1 className="font-serif text-4xl font-black text-ink sm:text-5xl">Football + Physics</h1>
                <p className="text-muted">Learn the science behind the game</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <div className="flex -space-x-2">
                {members.slice(0, 5).map((m) => (
                  <Avatar key={m.name} initial={m.initial} color={m.color} className="h-9 w-9 border-2 border-grass-tint text-sm" />
                ))}
              </div>
              <span className="text-sm font-semibold text-muted">1,284 members</span>
              <button className="rounded-full bg-grass px-6 py-2.5 text-sm font-semibold text-white shadow-[0_3px_0_#3A9A5A] transition hover:-translate-y-0.5 hover:bg-grass-dark">
                Join community
              </button>
            </div>
          </div>
          <TeamArt className="mx-auto hidden w-full max-w-xs lg:block" />
        </div>
      </section>

      <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_260px]">
        {/* feed */}
        <div>
          <h2 className="font-serif text-2xl font-bold text-ink">Shared lessons</h2>
          <p className="mt-1 text-muted">Videos members made to explain a concept through football and more.</p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {feed.map((ex, i) => (
              <Reveal key={ex.id} delay={i * 80}>
                <LessonCard example={ex} />
              </Reveal>
            ))}
          </div>
        </div>

        {/* sidebar */}
        <aside className="space-y-6">
          <div className="rounded-4xl border border-black/[0.06] bg-white p-5 shadow-card">
            <h3 className="font-serif text-lg font-bold text-ink">About</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Every free kick, offside call and curved shot is physics in disguise. We
              swap lessons that explain the hard stuff through the game we love.
            </p>
          </div>
          <div className="rounded-4xl border border-black/[0.06] bg-white p-5 shadow-card">
            <h3 className="font-serif text-lg font-bold text-ink">Members</h3>
            <ul className="mt-3 space-y-2.5">
              {members.map((m) => (
                <li key={m.name} className="flex items-center gap-3">
                  <Avatar initial={m.initial} color={m.color} className="h-8 w-8 text-sm" />
                  <span className="text-sm font-semibold text-ink">{m.name}</span>
                </li>
              ))}
            </ul>
          </div>
          <Link
            href="/dashboard"
            className="block rounded-full border border-black/10 bg-white px-5 py-3 text-center text-sm font-semibold text-ink transition hover:border-black/25"
          >
            ← Back to your home
          </Link>
        </aside>
      </div>

      <Footer />
    </main>
  );
}
