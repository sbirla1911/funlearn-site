"use client";

import { useState } from "react";

type Q = { q: string; options: string[]; answer: number; why: string };

const QUESTIONS: Q[] = [
  {
    q: "Ignoring air, what shape is the path of a kicked ball?",
    options: ["A straight line", "A parabola (an arc)", "A circle", "A zig-zag"],
    answer: 1,
    why: "Constant gravity acting on steady sideways motion traces a parabola.",
  },
  {
    q: "At the very top of its flight, the ball's upward speed is…",
    options: ["At its maximum", "Zero", "Equal to its sideways speed", "Pointing downward"],
    answer: 1,
    why: "Gravity has cancelled all the upward speed — for an instant it's zero, then it falls.",
  },
  {
    q: "What keeps pulling the ball back down the whole time?",
    options: ["The kick", "Air pushing it", "Gravity", "Friction"],
    answer: 2,
    why: "Gravity pulls down for the entire flight, both up and down.",
  },
  {
    q: "On flat ground, which launch angle sends the ball the FARTHEST?",
    options: ["30°", "45°", "60°", "90°"],
    answer: 1,
    why: "45° is the sweet spot between going far and going high.",
  },
  {
    q: "Kick the ball harder (more speed) at the same angle. The distance…",
    options: ["Decreases", "Stays the same", "Increases", "Becomes zero"],
    answer: 2,
    why: "More launch speed means more range — the ball travels farther.",
  },
];

export default function LessonQuiz() {
  const [picked, setPicked] = useState<(number | null)[]>(Array(QUESTIONS.length).fill(null));
  const answered = picked.filter((p) => p !== null).length;
  const score = picked.reduce<number>((n, p, i) => (p === QUESTIONS[i].answer ? n + 1 : n), 0);

  function choose(qi: number, oi: number) {
    if (picked[qi] !== null) return; // lock after first pick
    setPicked((prev) => prev.map((p, i) => (i === qi ? oi : p)));
  }

  return (
    <section className="rounded-4xl border border-black/[0.06] bg-white p-6 shadow-card">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-soft text-lg">❓</span>
          <div>
            <h2 className="font-serif text-2xl font-bold text-ink">Questions to answer</h2>
            <p className="text-sm text-muted">Five quick checks — tap an answer to see if it&apos;s right.</p>
          </div>
        </div>
        <span className="rounded-full bg-grass-soft px-3 py-1 text-sm font-bold text-grass-dark">
          {score}/{QUESTIONS.length}
        </span>
      </div>

      <ol className="mt-5 space-y-5">
        {QUESTIONS.map((item, qi) => {
          const pick = picked[qi];
          const done = pick !== null;
          return (
            <li key={qi} className="rounded-3xl border border-black/5 bg-paper p-4">
              <p className="font-semibold text-ink">
                <span className="mr-1.5 text-muted">{qi + 1}.</span>
                {item.q}
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {item.options.map((opt, oi) => {
                  const isAnswer = oi === item.answer;
                  const isPick = oi === pick;
                  let cls = "border-black/10 bg-white text-ink hover:border-black/25";
                  if (done && isAnswer) cls = "border-grass bg-grass-soft text-grass-dark";
                  else if (done && isPick && !isAnswer) cls = "border-blossom bg-blossom-soft text-ink";
                  else if (done) cls = "border-black/10 bg-white text-muted";
                  return (
                    <button
                      key={oi}
                      onClick={() => choose(qi, oi)}
                      disabled={done}
                      className={`flex items-center gap-2 rounded-2xl border px-3 py-2.5 text-left text-sm font-medium transition ${cls}`}
                    >
                      <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full border text-[11px] font-bold">
                        {done && isAnswer ? "✓" : done && isPick ? "✕" : String.fromCharCode(65 + oi)}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {done && (
                <p className="mt-3 rounded-2xl bg-sunny/15 px-3 py-2 text-sm text-ink/85">
                  <span className="font-semibold">{pick === item.answer ? "Nice! " : "Not quite. "}</span>
                  {item.why}
                </p>
              )}
            </li>
          );
        })}
      </ol>

      {answered === QUESTIONS.length && (
        <p className="mt-5 rounded-2xl bg-grass-soft/70 px-4 py-3 text-center text-sm font-bold text-grass-dark">
          You scored {score}/{QUESTIONS.length}! {score === QUESTIONS.length ? "Perfect 🎉" : "Give the lesson another watch to ace it."}
        </p>
      )}
    </section>
  );
}
