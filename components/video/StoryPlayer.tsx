"use client";

import { useEffect, useRef, useState } from "react";
import type { ProjectileSolution, DiagramReveal } from "@/lib/video/types";
import ProjectileDiagram from "@/components/video/ProjectileDiagram";

/**
 * Scene-driven lesson player. Plays a sequence of scenes with the accurate diagram
 * (revealed progressively), synced captions, optional real narration audio, and an
 * optional generated still behind the overlay. Drives both the storyboard lab and
 * the generated-lesson watch page.
 */

export type PlayerScene =
  | {
      /** Continuous opening clip: the ball actually flies across the AI scene. */
      type: "intro";
      beat: string;
      caption: string;
      narration: string;
      durationMs: number;
      bgUrl?: string;
      audioUrl?: string;
      ballKind?: "football" | "basketball";
    }
  | {
      type: "motion" | "teach";
      beat: string;
      caption: string;
      narration: string;
      reveal: DiagramReveal;
      equations?: string[];
      durationMs: number;
      audioUrl?: string;
      imageUrl?: string;
      /** Shown as a small note when there's no real still yet. */
      artNote?: string;
    }
  | { type: "check"; beat: string; prompt: string; answer: string; durationMs: number };

const ALL_REVEAL: DiagramReveal = { arc: true, launch: true, gravity: true, height: true, range: true };

export default function StoryPlayer({
  solution,
  scenes,
  autoStart = false,
}: {
  solution: ProjectileSolution;
  scenes: PlayerScene[];
  autoStart?: boolean;
}) {
  const hasAudio = scenes.some((s) => s.type !== "check" && Boolean(s.audioUrl));
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(autoStart && !hasAudio);
  const [showAnswer, setShowAnswer] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const scene = scenes[index];
  const isLast = index === scenes.length - 1;

  // Load the audio source when the scene changes.
  useEffect(() => {
    const a = audioRef.current;
    if (a && scene.type !== "check" && scene.audioUrl) {
      a.src = scene.audioUrl;
      a.currentTime = 0;
    }
  }, [index, scene]);

  // Drive playback + advance.
  useEffect(() => {
    if (!playing) {
      audioRef.current?.pause();
      return;
    }
    if (scene.type === "check") return;
    const advance = () => setIndex((i) => Math.min(i + 1, scenes.length - 1));
    const a = audioRef.current;
    if (a && scene.audioUrl) a.play().catch(() => {});
    // Teach/motion beats advance when their narration ends; the intro clip runs on
    // its own timer so the ball finishes its flight regardless of narration length.
    if (scene.audioUrl && a && scene.type !== "intro") {
      a.addEventListener("ended", advance, { once: true });
      return () => a.removeEventListener("ended", advance);
    }
    const id = setTimeout(advance, scene.durationMs);
    return () => clearTimeout(id);
  }, [index, playing, scene, scenes.length]);

  function replay() {
    setShowAnswer(false);
    setIndex(0);
    setPlaying(true);
  }

  const isIntro = scene.type === "intro";
  const isMotion = scene.type === "motion";
  const reveal = scene.type === "check" ? ALL_REVEAL : scene.type === "teach" || scene.type === "motion" ? scene.reveal : {};
  const artUrl = scene.type === "motion" || scene.type === "teach" ? scene.imageUrl : undefined;
  // Intro + motion beats show the AI scene full-bleed; teach/check beats show the
  // precise diagram (with the beat's art as a small corner thumbnail).
  const bgArt = isMotion ? artUrl : isIntro ? scene.bgUrl : undefined;
  const thumbArt = scene.type === "teach" ? artUrl : undefined;
  const showDiagram = !bgArt; // diagram is the backdrop only when there's no scene image
  const diagramReveal = showDiagram ? reveal : {};

  return (
    <div>
      <audio ref={audioRef} preload="auto" />

      {/* stage */}
      <div className="relative overflow-hidden rounded-4xl border border-black/5 bg-paper shadow-card">
        {/* diagram defines the stage size; it's the sizer even when hidden under art */}
        <ProjectileDiagram solution={solution} reveal={diagramReveal} backdrop={showDiagram} />

        {/* full-bleed AI art on intro + motion beats — with a slow camera (Ken Burns) move */}
        {bgArt && (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={index} src={bgArt} alt="" className="kenburns absolute inset-0 h-full w-full object-cover" />
        )}

        {/* intro clip: the ball actually flies across the scene (continuous motion) */}
        {isIntro && playing && (
          <svg
            key={`fly-${index}`}
            viewBox="0 0 760 440"
            preserveAspectRatio="xMidYMid slice"
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden
          >
            <path id={`flight-${index}`} d="M205 348 Q450 55 615 270" fill="none" stroke="none" />
            {/* faint arc trail */}
            <path d="M205 348 Q450 55 615 270" fill="none" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="3" strokeDasharray="2 10" strokeLinecap="round" />
            <g>
              {scene.ballKind === "basketball" ? (
                <>
                  <circle r="13" fill="#E8822E" stroke="#1F2A37" strokeWidth="2" />
                  <line x1="0" y1="-13" x2="0" y2="13" stroke="#1F2A37" strokeWidth="1.5" />
                  <line x1="-13" y1="0" x2="13" y2="0" stroke="#1F2A37" strokeWidth="1.5" />
                  <path d="M-9 -9 Q0 0 -9 9" fill="none" stroke="#1F2A37" strokeWidth="1.5" />
                  <path d="M9 -9 Q0 0 9 9" fill="none" stroke="#1F2A37" strokeWidth="1.5" />
                </>
              ) : (
                <>
                  <circle r="13" fill="#ffffff" stroke="#1F2A37" strokeWidth="2.5" />
                  <circle r="3.4" cx="0" cy="0" fill="#1F2A37" />
                  <circle r="2.4" cx="7" cy="-6" fill="#1F2A37" />
                  <circle r="2.4" cx="-7" cy="6" fill="#1F2A37" />
                  <circle r="2.4" cx="7" cy="6" fill="#1F2A37" />
                </>
              )}
              <animateMotion dur="4.2s" fill="freeze" calcMode="spline" keyPoints="0;1" keyTimes="0;1" keySplines="0.3 0 0.75 1">
                <mpath href={`#flight-${index}`} />
              </animateMotion>
            </g>
          </svg>
        )}

        {/* scene-art thumbnail on teach beats (the still for this moment) */}
        {thumbArt && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumbArt} alt="" className="absolute right-3 top-5 hidden h-16 w-28 rounded-xl object-cover shadow-lift ring-2 ring-white/90 sm:block" />
        )}

        {/* art-prompt note (only when there's no real still yet) */}
        {(scene.type === "motion" || scene.type === "teach") && !artUrl && scene.artNote && (
          <div className="absolute left-4 top-4 max-w-[60%] rounded-2xl bg-white/85 px-3 py-2 text-[11px] font-medium text-muted shadow-sm backdrop-blur">
            🎨 <span className="font-semibold text-ink">scene art →</span> {scene.artNote}
          </div>
        )}

        {/* intro + motion beats: caption over the scene at the bottom */}
        {(isMotion || isIntro) && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 via-ink/45 to-transparent px-6 pb-6 pt-14 text-center">
            <p className="font-serif text-xl font-bold text-paper drop-shadow sm:text-2xl">{scene.caption}</p>
            <p className="mx-auto mt-1 max-w-2xl text-sm text-paper/85">🔊 {scene.narration}</p>
          </div>
        )}

        {/* teach beats: caption panel at the top so it never covers the diagram */}
        {scene.type === "teach" && (
          <div className="absolute inset-x-0 top-6 flex flex-col items-center px-6 text-center">
            <div className="max-w-md rounded-2xl bg-ink/75 px-4 py-2 backdrop-blur">
              <p className="font-serif text-base font-bold text-paper sm:text-lg">{scene.caption}</p>
              <p className="mt-0.5 text-xs text-paper/85">🔊 {scene.narration}</p>
            </div>
            {scene.equations && (
              <div className="mt-2 inline-flex flex-wrap justify-center gap-x-5 gap-y-1 rounded-2xl bg-white/90 px-4 py-2 font-mono text-xs text-ink shadow-card">
                {scene.equations.map((eq) => (
                  <span key={eq}>{eq}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* check scene */}
        {scene.type === "check" && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/55 px-6">
            <div className="max-w-lg rounded-4xl bg-paper p-6 text-center shadow-lift">
              <p className="text-xs font-bold uppercase tracking-widest text-tangerine">Did it land?</p>
              <p className="mt-2 font-serif text-xl font-bold text-ink">{scene.prompt}</p>
              {showAnswer ? (
                <p className="mt-4 rounded-2xl bg-grass-soft px-4 py-3 text-sm font-medium text-ink">{scene.answer}</p>
              ) : (
                <button onClick={() => setShowAnswer(true)} className="mt-4 rounded-full bg-grass px-5 py-2.5 text-sm font-bold text-white shadow-card transition hover:bg-grass-dark">
                  Show the answer
                </button>
              )}
            </div>
          </div>
        )}

        {/* center play button when paused at a non-check scene */}
        {!playing && scene.type !== "check" && (
          <button
            onClick={() => setPlaying(true)}
            aria-label="Play"
            className="absolute inset-0 flex items-center justify-center bg-ink/10 transition hover:bg-ink/20"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-2xl text-ink shadow-lift">▶</span>
          </button>
        )}

        {/* segmented progress */}
        <div className="absolute inset-x-0 top-0 flex gap-1 p-2">
          {scenes.map((s, i) => (
            <div key={s.beat} className="h-1 flex-1 overflow-hidden rounded-full bg-white/40">
              <div className={`h-full rounded-full bg-white transition-all duration-300 ${i <= index ? "w-full" : "w-0"}`} />
            </div>
          ))}
        </div>
      </div>

      {/* controls */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => setPlaying((p) => !p)} className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper shadow-card transition hover:bg-ink/90">
            {playing && scene.type !== "check" ? "❚❚ Pause" : "▶ Play"}
          </button>
          <button onClick={replay} className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:bg-black/5">
            ↻ Replay
          </button>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted">
          <button onClick={() => { setIndex((i) => Math.max(0, i - 1)); setShowAnswer(false); }} disabled={index === 0} className="disabled:opacity-30">
            ‹ Prev
          </button>
          <span className="font-semibold text-ink">
            Scene {index + 1} / {scenes.length}
          </span>
          <button onClick={() => { setIndex((i) => Math.min(scenes.length - 1, i + 1)); setShowAnswer(false); }} disabled={isLast} className="disabled:opacity-30">
            Next ›
          </button>
        </div>
      </div>
      <p className="mt-2 text-center text-xs text-muted">Beat: <span className="font-mono">{scene.beat}</span></p>
    </div>
  );
}
