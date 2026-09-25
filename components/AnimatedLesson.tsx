import type { CSSProperties } from "react";

/**
 * Self-contained animated "video" scenes for each concept. They animate once
 * their `.lesson-stage` ancestor gains `.is-playing` (driven by LessonPlayer),
 * using the keyframes in globals.css. Captions cross-fade like subtitles.
 */

const v = (name: string, value: string) => ({ [name]: value } as CSSProperties);
const delay = (s: number) => ({ animationDelay: `${s}s` } as CSSProperties);

function Captions({ lines }: { lines: string[] }) {
  const slot = 1.9;
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-3 h-12">
      {lines.map((l, i) => {
        const last = i === lines.length - 1;
        return (
          <div
            key={i}
            className={`lp-caption ${last ? "lp-caption-last" : ""}`}
            style={{ ...v("--cap-delay", `${i * slot}s`), ...v("--cap-dur", `${slot}s`) }}
          >
            <span className="rounded-full bg-ink/85 px-4 py-1.5 text-sm font-semibold text-white shadow">
              {l}
            </span>
          </div>
        );
      })}
    </div>
  );
}

const ARC = "M60 196 Q210 36 344 168";

function Projectile() {
  return (
    <>
      <svg viewBox="0 0 400 240" className="block w-full">
        <rect width="400" height="240" fill="#DCEEFB" />
        <circle cx="330" cy="46" r="18" fill="#FBD24E" className="anim anim-pulse" />
        <path d="M0 190 Q200 176 400 190 V240 H0Z" fill="#8FD6A0" />
        <path d="M0 204 Q200 192 400 204 V240 H0Z" fill="#69C384" />
        {/* goal */}
        <g stroke="#41515C" strokeWidth="3" fill="none">
          <path d="M300 118 v70 h56 v-70" />
          <g stroke="#B9C6D0" strokeWidth="1">
            <path d="M300 130 h56 M300 145 h56 M300 160 h56 M300 175 h56 M314 120 v68 M330 120 v68 M344 120 v68" />
          </g>
        </g>
        {/* dashed arc, drawn in */}
        <path
          d={ARC}
          fill="none"
          stroke="#2F6FB0"
          strokeWidth="3"
          strokeDasharray="500"
          strokeDashoffset="500"
          strokeLinecap="round"
          className="anim anim-draw"
          style={delay(0.2)}
        />
        {/* horizontal (constant) + gravity arrows */}
        <g className="anim anim-fade" style={delay(2.4)}>
          <path d="M150 96 h46" stroke="#3A9A5A" strokeWidth="3" strokeLinecap="round" />
          <path d="M196 96 l-8 -5 v10 Z" fill="#3A9A5A" />
          <text x="150" y="86" fontSize="13" fontFamily="Inter" fontWeight="700" fill="#2E7D46">
            speed →
          </text>
        </g>
        <g className="anim anim-fade" style={delay(3.0)}>
          <path d="M232 92 v34" stroke="#E4577E" strokeWidth="3" strokeLinecap="round" />
          <path d="M232 126 l-5 -8 h10 Z" fill="#E4577E" />
          <text x="240" y="116" fontSize="13" fontFamily="Inter" fontWeight="700" fill="#C23E62">
            gravity ↓
          </text>
        </g>
        {/* ball rides the arc */}
        <g
          className="anim anim-ball"
          style={{ ...v("offsetPath", `path('${ARC}')`), ...v("WebkitOffsetPath", `path('${ARC}')`) }}
        >
          <circle r="10" fill="#fff" stroke="#22303A" strokeWidth="2" />
          <path d="M0 -6 l5 4 -2 6 h-6 l-2 -6Z" fill="#22303A" />
        </g>
      </svg>
      <Captions
        lines={[
          "The ball leaves the boot…",
          "sideways speed stays constant →",
          "gravity keeps pulling it down ↓",
          "…and that arc is projectile motion.",
        ]}
      />
    </>
  );
}

function Stoichiometry() {
  const Cup = ({ x, cls, d = 0 }: { x: number; cls?: string; d?: number }) => (
    <g className={cls} style={delay(d)}>
      <path d={`M${x} 96 h26 l-3 34 h-20 Z`} fill="#F0BF77" stroke="#C98A3E" strokeWidth="2" />
      <rect x={x} y="92" width="26" height="8" rx="3" fill="#F7D89B" stroke="#C98A3E" strokeWidth="2" />
    </g>
  );
  const Egg = ({ x, cls, d = 0 }: { x: number; cls?: string; d?: number }) => (
    <ellipse cx={x} cy="118" rx="9" ry="12" fill="#FFF6E4" stroke="#E4C48A" strokeWidth="2" className={cls} style={delay(d)} />
  );
  return (
    <>
      <svg viewBox="0 0 400 240" className="block w-full">
        <rect width="400" height="240" fill="#FDF3E7" />
        <text x="24" y="52" fontSize="15" fontFamily="Inter" fontWeight="800" fill="#B4671E">
          Scale the recipe — keep the ratio
        </text>

        {/* base recipe */}
        <text x="30" y="150" fontSize="13" fontFamily="Inter" fontWeight="700" fill="#7a5a33">1 cup : 2 eggs</text>
        <Cup x={34} cls="anim anim-pop" d={0.2} />
        <Egg x={80} cls="anim anim-pop" d={0.4} />
        <Egg x={102} cls="anim anim-pop" d={0.5} />

        {/* ×2 badge */}
        <g className="anim anim-pop" style={delay(2.2)}>
          <circle cx="196" cy="112" r="20" fill="#F0994A" />
          <text x="196" y="118" fontSize="17" fontFamily="Inter" fontWeight="800" fill="#fff" textAnchor="middle">×2</text>
        </g>

        {/* doubled recipe */}
        <text x="250" y="150" fontSize="13" fontFamily="Inter" fontWeight="700" fill="#7a5a33">2 cups : 4 eggs</text>
        <Cup x={250} cls="anim anim-pop" d={2.8} />
        <Cup x={282} cls="anim anim-pop" d={2.9} />
        <Egg x={330} cls="anim anim-pop" d={3.0} />
        <Egg x={352} cls="anim anim-pop" d={3.1} />
        <Egg x={330} cls="anim anim-pop" d={3.2} />
        <Egg x={352} cls="anim anim-pop" d={3.3} />

        {/* balanced-equation callout */}
        <g className="anim anim-fade" style={delay(4.0)}>
          <rect x="96" y="188" width="208" height="30" rx="15" fill="#fff" stroke="#E9CDA6" strokeWidth="1.5" />
          <text x="200" y="208" fontSize="14" fontFamily="Inter" fontWeight="700" fill="#B4671E" textAnchor="middle">
            2H₂ + O₂ → 2H₂O
          </text>
        </g>
      </svg>
      <Captions
        lines={[
          "Start with a recipe: 1 cup, 2 eggs.",
          "Double the batch…",
          "…double every amount — ratio unchanged.",
          "Balanced equations do exactly this.",
        ]}
      />
    </>
  );
}

function Photosynthesis() {
  return (
    <>
      <svg viewBox="0 0 400 240" className="block w-full">
        <rect width="400" height="240" fill="#EAF6EA" />
        {/* sun */}
        <g className="anim anim-pulse" style={{ transformOrigin: "330px 54px" }}>
          <g stroke="#F4B740" strokeWidth="4" strokeLinecap="round">
            <path d="M330 22 v10 M330 76 v10 M298 54 h10 M352 54 h10 M308 32 l7 7 M345 69 l7 7 M352 32 l-7 7 M315 69 l-7 7" />
          </g>
          <circle cx="330" cy="54" r="16" fill="#FBD24E" stroke="#E9B93A" strokeWidth="2" />
        </g>
        {/* soil */}
        <path d="M40 176 q160 -18 320 0 v40 H40 Z" fill="#8A5A3B" />
        {/* inputs flowing in */}
        <g className="anim anim-flow" style={{ ...delay(0.5), ...v("--fx", "40px"), ...v("--fy", "-30px") }}>
          <text x="250" y="72" fontSize="13" fontFamily="Inter" fontWeight="700" fill="#C99A2E">☀ light</text>
        </g>
        <g className="anim anim-flow" style={{ ...delay(1.0), ...v("--fx", "-40px"), ...v("--fy", "20px") }}>
          <text x="60" y="150" fontSize="13" fontFamily="Inter" fontWeight="700" fill="#3E86C4">💧 water</text>
        </g>
        <g className="anim anim-flow" style={{ ...delay(1.5), ...v("--fx", "-40px"), ...v("--fy", "-16px") }}>
          <text x="60" y="96" fontSize="13" fontFamily="Inter" fontWeight="700" fill="#7C8A99">CO₂ air</text>
        </g>
        {/* plant grows */}
        <g className="anim anim-grow" style={{ ...delay(2.0), transformOrigin: "200px 176px" }}>
          <path d="M200 176 v-52" stroke="#3A9A5A" strokeWidth="6" strokeLinecap="round" />
          <path d="M200 148 q-26 -6 -34 -26 q26 -2 34 20Z" fill="#6ECB87" stroke="#3A9A5A" strokeWidth="1.6" />
          <path d="M200 138 q26 -8 36 -30 q-28 0 -36 24Z" fill="#8AD79E" stroke="#3A9A5A" strokeWidth="1.6" />
          <circle cx="200" cy="122" r="7" fill="#8AD79E" stroke="#3A9A5A" strokeWidth="1.6" />
        </g>
        {/* XP bar fills */}
        <rect x="140" y="200" width="120" height="16" rx="8" fill="#DCE6EE" stroke="#C4D2DD" strokeWidth="1.5" />
        <rect
          x="143" y="203" width="114" height="10" rx="5" fill="#46B06A"
          className="anim anim-growx" style={{ ...delay(3.2), transformOrigin: "143px 0" }}
        />
        <text x="204" y="240" fontSize="12" fontFamily="Inter" fontWeight="700" fill="#3A7D52" textAnchor="middle" className="anim anim-fade" style={delay(3.4)}>
          stored energy = sugar
        </text>
      </svg>
      <Captions
        lines={[
          "A plant takes light, water and air…",
          "…and turns them into sugar.",
          "That sugar is its stored energy —",
          "like an XP bar filling up.",
        ]}
      />
    </>
  );
}

function Exponential() {
  const bars = [
    { x: 60, h: 24, label: "1" },
    { x: 118, h: 44, label: "2" },
    { x: 176, h: 78, label: "4" },
    { x: 234, h: 128, label: "8" },
    { x: 292, h: 180, label: "16" },
  ];
  return (
    <>
      <svg viewBox="0 0 400 240" className="block w-full">
        <rect width="400" height="240" fill="#EFEDFB" />
        <path d="M40 30 V204 H372" fill="none" stroke="#C9C3E8" strokeWidth="3" strokeLinecap="round" />
        {bars.map((b, i) => (
          <g key={i} className="anim anim-grow" style={{ ...delay(0.4 + i * 0.5), transformOrigin: `0 204px` }}>
            <rect x={b.x} y={204 - b.h} width="40" height={b.h} rx="5" fill="#8B7FE8" stroke="#6A5CC9" strokeWidth="1.5" />
            <text x={b.x + 20} y={198 - b.h} fontSize="12" fontFamily="Inter" fontWeight="800" fill="#6A5CC9" textAnchor="middle">
              {b.label}
            </text>
          </g>
        ))}
        {/* curve + star */}
        <path
          d="M80 182 Q210 176 312 34"
          fill="none" stroke="#F0994A" strokeWidth="4" strokeLinecap="round"
          strokeDasharray="360" strokeDashoffset="360"
          className="anim anim-draw" style={delay(2.6)}
        />
        <g className="anim anim-pop" style={delay(3.6)}>
          <path d="M320 18 l4.5 9.5 10.5 1.2 -7.7 7.3 2 10.4 -9.3 -5.1 -9.3 5.1 2 -10.4 -7.7 -7.3 10.5 -1.2Z"
            fill="#FBD24E" stroke="#E9B93A" strokeWidth="1.6" strokeLinejoin="round" />
        </g>
        <text x="150" y="60" fontSize="13" fontFamily="Inter" fontWeight="800" fill="#6A5CC9" className="anim anim-fade" style={delay(1.2)}>
          each level ×2
        </text>
      </svg>
      <Captions
        lines={[
          "Every level needs double the XP.",
          "Early levels fly by…",
          "…then the numbers explode.",
          "That's exponential growth.",
        ]}
      />
    </>
  );
}

export default function AnimatedLesson({ id }: { id: string }) {
  if (id === "stoichiometry") return <Stoichiometry />;
  if (id === "photosynthesis") return <Photosynthesis />;
  if (id === "exponential") return <Exponential />;
  return <Projectile />;
}
