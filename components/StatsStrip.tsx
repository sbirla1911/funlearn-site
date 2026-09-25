import { streak, progress } from "@/lib/content";

/** Retention stats shown at the top of the dashboard: streak and level/XP. */
export default function StatsStrip() {
  const xpToNext = progress.xpPerLevel - progress.xpIntoLevel;
  const pct = Math.round((progress.xpIntoLevel / progress.xpPerLevel) * 100);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* Streak */}
      <div className="rounded-4xl border border-tangerine/20 bg-tangerine-soft/60 p-5 shadow-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg shadow-sm">🔥</span>
            <span className="text-sm font-bold uppercase tracking-wide text-tangerine">Streak</span>
          </div>
          <span className="text-xs font-semibold text-muted">Longest {streak.longest}</span>
        </div>
        <p className="mt-2 font-serif text-3xl font-black text-ink">
          {streak.current} <span className="text-lg font-bold text-muted">days</span>
        </p>
        <div className="mt-3 flex items-center justify-between">
          {streak.week.map((d, i) => (
            <span key={i} className="flex flex-col items-center gap-1">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold ${
                  d.done
                    ? "bg-tangerine text-white"
                    : "border border-dashed border-black/20 text-muted"
                } ${d.today ? "ring-2 ring-tangerine ring-offset-2 ring-offset-tangerine-soft animate-pulse" : ""}`}
              >
                {d.done ? "✓" : ""}
              </span>
              <span className="text-[10px] font-semibold text-muted">{d.label}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Level / XP */}
      <div className="rounded-4xl border border-grape/20 bg-grape-soft/60 p-5 shadow-card">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg shadow-sm">⚡</span>
          <span className="text-sm font-bold uppercase tracking-wide text-grape">Level {progress.level}</span>
        </div>
        <p className="mt-2 font-serif text-xl font-bold text-ink">{progress.title}</p>
        <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-white">
          <div className="h-full rounded-full bg-grape" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs font-semibold">
          <span className="text-grape">{xpToNext} XP to Level {progress.level + 1}</span>
          <span className="text-muted">{progress.totalXp.toLocaleString()} XP total</span>
        </div>
      </div>
    </div>
  );
}
