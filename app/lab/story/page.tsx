"use client";

import { useMemo, useState } from "react";
import { solveProjectile } from "@/lib/video/engine/projectile";
import { buildProjectileStoryboard } from "@/lib/video/storyboards/projectile";
import StoryPlayer, { type PlayerScene } from "@/components/video/StoryPlayer";

/**
 * Phase B lab: the full projectile "video" playing end to end from a storyboard,
 * with placeholder art + the accurate diagram. Tweak the grade dial to see the
 * narration + equations flex. Not linked from the public site.
 */
export default function StoryLabPage() {
  const [grade, setGrade] = useState(9);
  const [v, setV] = useState(20);
  const [theta, setTheta] = useState(55);

  const solution = useMemo(() => solveProjectile({ v, theta }), [v, theta]);
  // Rebuild (and remount the player) whenever the storyboard inputs change.
  const scenes = useMemo<PlayerScene[]>(() => {
    const sb = buildProjectileStoryboard(solution, grade);
    return sb.scenes.map((s) =>
      s.type === "check"
        ? { type: "check", beat: s.beat, prompt: s.prompt, answer: s.answer, durationMs: 0 }
        : {
            type: s.type,
            beat: s.beat,
            caption: s.caption,
            narration: s.narration,
            reveal: s.reveal,
            equations: s.equations,
            durationMs: s.durationMs,
            artNote: s.art,
          },
    );
  }, [solution, grade]);
  const playerKey = `${v}-${theta}-${grade}`;

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <p className="text-xs font-bold uppercase tracking-widest text-tangerine">FUNlearn · internal lab</p>
      <h1 className="mt-1 font-serif text-4xl font-black text-ink">Projectile — full lesson</h1>
      <p className="mt-2 text-muted">
        The whole video playing from a storyboard: scene art (placeholder), the accurate diagram
        revealing step by step, and synced captions + voiceover text. Drag the grade dial to watch the
        narration and equations change.
      </p>

      <div className="mt-6 grid gap-5 rounded-4xl border border-black/5 bg-white p-5 shadow-card sm:grid-cols-3">
        <Control label="Grade" value={grade >= 9 ? `${grade} · older` : `${grade} · younger`}>
          <input type="range" min={5} max={11} value={grade} onChange={(e) => setGrade(+e.target.value)} className="w-full accent-grape" />
        </Control>
        <Control label="Launch speed" value={`${v} m/s`}>
          <input type="range" min={10} max={35} value={v} onChange={(e) => setV(+e.target.value)} className="w-full accent-tangerine" />
        </Control>
        <Control label="Launch angle" value={`${theta}°`}>
          <input type="range" min={20} max={75} value={theta} onChange={(e) => setTheta(+e.target.value)} className="w-full accent-tangerine" />
        </Control>
      </div>

      <div className="mt-8">
        <StoryPlayer key={playerKey} solution={solution} scenes={scenes} autoStart />
      </div>
    </main>
  );
}

function Control({ label, value, children }: { label: string; value: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-bold text-ink">{label}</span>
        <span className="text-xs font-semibold text-muted">{value}</span>
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}
