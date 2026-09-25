"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { Sparkle } from "@/components/Illustrations";
import AnimatedLesson from "@/components/AnimatedLesson";
import LessonLauncher from "@/components/LessonLauncher";
import { interestOptions, learnOptions, suggestedCommunities } from "@/lib/content";

function useToggleSet(initial: string[]) {
  const [set, setSet] = useState<Set<string>>(new Set(initial));
  const toggle = (v: string) =>
    setSet((prev) => {
      const next = new Set(prev);
      next.has(v) ? next.delete(v) : next.add(v);
      return next;
    });
  return [set, toggle] as const;
}

export default function GetStarted() {
  const [role, setRole] = useState<"Student" | "Parent">("Student");
  const [interests, toggleInterest] = useToggleSet(["Football", "Cooking"]);
  const [topics, toggleTopic] = useToggleSet(["Projectile motion"]);
  const [joined, toggleJoined] = useToggleSet([]);

  return (
    <main className="overflow-x-hidden">
      <Header variant="minimal" />

      <div className="mx-auto w-full max-w-2xl px-5 py-10 sm:px-8">
        <div className="flex items-start gap-2">
          <h1 className="font-serif text-4xl font-black text-ink sm:text-5xl">
            Make your profile
          </h1>
          <Sparkle className="mt-1 w-7 flex-none" />
        </div>
        <p className="mt-2 text-lg text-muted">
          The more we know, the better the lessons fit. It takes a minute.
        </p>

        {/* form card */}
        <div className="mt-7 rounded-4xl border border-black/[0.06] bg-white p-6 shadow-card sm:p-8">
          {/* role toggle */}
          <p className="mb-2 text-lg font-bold text-ink">I&apos;m a</p>
          <div className="inline-flex rounded-full border border-black/10 bg-paper p-1">
            {(["Student", "Parent"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`rounded-full px-6 py-2 text-sm font-semibold transition ${
                  role === r ? "bg-sky text-white shadow-sm" : "text-muted hover:text-ink"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* text fields */}
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field label="First name" placeholder="Maya" />
            <Field label="Email" placeholder="you@example.com" type="email" />
            <Field label="Age" placeholder="14" type="number" />
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Grade</label>
              <select
                defaultValue="Grade 8"
                className="w-full rounded-xl border border-black/10 bg-paper px-4 py-2.5 text-ink outline-none focus:border-sky"
              >
                {["Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"].map(
                  (g) => (
                    <option key={g}>{g}</option>
                  )
                )}
              </select>
            </div>
          </div>

          {/* interests */}
          <div className="mt-7">
            <p className="text-lg font-bold text-ink">
              What are you into? <span className="font-hand text-xl font-semibold text-tangerine">pick a few</span>
            </p>
            <ChipRow
              options={interestOptions}
              selected={interests}
              onToggle={toggleInterest}
              activeClass="border-sunny bg-sunny/40 text-ink"
            />
          </div>

          {/* topics */}
          <div className="mt-7">
            <p className="text-lg font-bold text-ink">
              What do you want to learn?{" "}
              <span className="font-hand text-xl font-semibold text-muted">
                or add a photo of the homework later
              </span>
            </p>
            <ChipRow
              options={learnOptions}
              selected={topics}
              onToggle={toggleTopic}
              activeClass="border-sky bg-sky-soft text-sky"
            />
          </div>

          {/* communities */}
          <div className="mt-7">
            <p className="text-lg font-bold text-ink">Communities you might like</p>
            <div className="mt-3 space-y-3">
              {suggestedCommunities.map((c) => {
                const isJoined = joined.has(c.id);
                return (
                  <div
                    key={c.id}
                    className="flex items-center gap-3 rounded-2xl border border-black/[0.07] bg-paper px-4 py-3"
                  >
                    <span
                      className={`flex h-10 w-10 flex-none items-center justify-center rounded-full text-xl ${
                        c.accent === "grass" ? "bg-grass-soft" : "bg-tangerine-soft"
                      }`}
                    >
                      {c.icon}
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold text-ink">{c.name}</p>
                      <p className="text-sm text-muted">{c.blurb}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleJoined(c.id)}
                      className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                        isJoined
                          ? "bg-grass text-white"
                          : "bg-sunny text-ink shadow-[0_3px_0_#E9B93A] hover:-translate-y-0.5"
                      }`}
                    >
                      {isJoined ? "Joined ✓" : "Join"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* peek at first lesson */}
        <div className="mt-8 rounded-4xl bg-tangerine-soft p-6 sm:p-8">
          <p className="text-center font-hand text-2xl font-bold text-ink">
            here&apos;s a peek at your first lesson
          </p>
          <LessonLauncher lessonId="projectile">
            {(open) => (
              <>
                <button
                  onClick={open}
                  aria-label="Play the Projectile motion lesson"
                  className="group mt-4 block w-full overflow-hidden rounded-3xl border-2 border-ink/10 bg-white text-left shadow-card"
                >
                  <div className="relative">
                    <div className="lesson-stage">
                      <AnimatedLesson id="projectile" />
                    </div>
                    <span className="absolute inset-0 flex items-center justify-center bg-ink/5 transition group-hover:bg-ink/[0.12]">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg transition group-hover:scale-105">
                        <svg viewBox="0 0 24 24" className="h-6 w-6 translate-x-0.5 text-ink" fill="currentColor" aria-hidden>
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </span>
                    </span>
                  </div>
                </button>
                <div className="mt-4">
                  <p className="font-serif text-xl font-bold text-ink">Projectile motion</p>
                  <p className="text-sm text-muted">
                    for a kid who loves <span className="font-serif italic text-sky">football</span>
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button onClick={open} type="button"><OutputPill icon="▶" label="Short video" cls="bg-sky-soft text-sky" /></button>
                  <button onClick={open} type="button"><OutputPill icon="📊" label="Infographic" cls="bg-grape-soft text-grape" /></button>
                  <button onClick={open} type="button"><OutputPill icon="🎮" label="Mini game" cls="bg-grass-soft text-grass-dark" /></button>
                </div>
              </>
            )}
          </LessonLauncher>

          <Link
            href="/dashboard"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-grass px-7 py-3.5 text-base font-semibold text-white shadow-[0_4px_0_#3A9A5A] transition hover:-translate-y-0.5 hover:bg-grass-dark"
          >
            Start learning
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-ink">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-xl border border-black/10 bg-paper px-4 py-2.5 text-ink placeholder:text-muted/60 outline-none focus:border-sky"
      />
    </div>
  );
}

function ChipRow({
  options,
  selected,
  onToggle,
  activeClass,
}: {
  options: string[];
  selected: Set<string>;
  onToggle: (v: string) => void;
  activeClass: string;
}) {
  return (
    <div className="mt-3 flex flex-wrap gap-2.5">
      {options.map((o) => {
        const active = selected.has(o);
        return (
          <button
            key={o}
            type="button"
            onClick={() => onToggle(o)}
            aria-pressed={active}
            className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition ${
              active ? activeClass : "border-black/10 bg-white text-ink/70 hover:border-black/25"
            }`}
          >
            {active && <span aria-hidden>✓</span>}
            {o}
          </button>
        );
      })}
    </div>
  );
}

function OutputPill({ icon, label, cls }: { icon: string; label: string; cls: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold ${cls}`}>
      <span aria-hidden>{icon}</span>
      {label}
    </span>
  );
}
