"use client";

import { useEffect, useMemo, useState } from "react";
import { solveProjectile } from "@/lib/video/engine/projectile";
import StoryPlayer, { type PlayerScene } from "@/components/video/StoryPlayer";
import type { LessonManifest } from "@/lib/video/types";
import { lessonsIndexUrl, lessonManifestUrl, lessonAsset } from "@/lib/video/asset";

type IndexEntry = { cacheKey: string; concept: string; interest: string; grade: number; imageStatus: string };

const titleCase = (s: string) => s.replace(/(^|\s)\w/g, (m) => m.toUpperCase());

export default function WatchPage() {
  const [list, setList] = useState<IndexEntry[]>([]);
  const [key, setKey] = useState<string | null>(null);
  const [manifest, setManifest] = useState<LessonManifest | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "empty" | "error">("loading");

  // Load the lesson index once.
  useEffect(() => {
    fetch(lessonsIndexUrl())
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((entries: IndexEntry[]) => {
        setList(entries);
        const wanted = new URLSearchParams(window.location.search).get("lesson");
        const initial = entries.find((e) => e.cacheKey === wanted) ?? entries[0];
        if (initial) setKey(initial.cacheKey);
        else setStatus("empty");
      })
      .catch(() => setStatus("empty"));
  }, []);

  // Load the selected manifest.
  useEffect(() => {
    if (!key) return;
    setStatus("loading");
    setManifest(null);
    fetch(lessonManifestUrl(key))
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((m: LessonManifest) => {
        setManifest(m);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [key]);

  const solution = useMemo(() => (manifest ? solveProjectile(manifest.inputs) : null), [manifest]);

  const scenes = useMemo<PlayerScene[]>(() => {
    if (!manifest) return [];
    return manifest.scenes.map((s) =>
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
            audioUrl: s.audio ? lessonAsset(manifest.cacheKey, s.audio) : undefined,
            imageUrl: s.image ? lessonAsset(manifest.cacheKey, s.image) : undefined,
            artNote: s.art,
          },
    );
  }, [manifest]);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <p className="text-xs font-bold uppercase tracking-widest text-tangerine">FUNlearn · watch</p>
      <h1 className="mt-1 font-serif text-4xl font-black text-ink">Your lesson</h1>
      <p className="mt-2 text-muted">Pre-generated lessons — real narration + the accurate diagram. Pick one to watch.</p>

      {/* lesson picker */}
      {list.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {list.map((e) => (
            <button
              key={e.cacheKey}
              onClick={() => setKey(e.cacheKey)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                e.cacheKey === key ? "border-transparent bg-ink text-paper" : "border-black/10 bg-white text-ink hover:bg-black/5"
              }`}
            >
              {titleCase(e.interest)} · Grade {e.grade}
              <span className="ml-2 text-xs opacity-70">{e.imageStatus === "ready" ? "🖼🔊" : "🔊"}</span>
            </button>
          ))}
        </div>
      )}

      <div className="mt-8">
        {status === "loading" && <Placeholder>Loading lesson…</Placeholder>}
        {status === "empty" && <Placeholder>No generated lessons yet. Run the generator to create one.</Placeholder>}
        {status === "error" && <Placeholder>Couldn’t load that lesson.</Placeholder>}
        {status === "ready" && manifest && solution && (
          <>
            <StoryPlayer key={manifest.cacheKey} solution={solution} scenes={scenes} />
            <div className="mt-4 rounded-2xl border border-black/5 bg-white px-4 py-3 text-xs text-muted">
              <span className="font-semibold text-ink">{titleCase(manifest.interest)} · Grade {manifest.grade}</span> — voice{" "}
              <span className="font-mono">{manifest.voice}</span>. Stills:{" "}
              {manifest.imageStatus === "ready" ? (
                <span className="font-semibold text-grass">AI-generated ✓</span>
              ) : (
                <span className="font-semibold text-tangerine">placeholder (enable image billing for real art)</span>
              )}
              . Diagram values are computed — R = {manifest.derived.range} m, H = {manifest.derived.hMax} m.
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function Placeholder({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex aspect-video items-center justify-center rounded-4xl border border-dashed border-black/15 bg-white text-sm text-muted">
      {children}
    </div>
  );
}
