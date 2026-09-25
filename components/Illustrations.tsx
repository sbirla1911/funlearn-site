/**
 * Small decorative inline-SVG pieces (sparkles, sun, hills, gamepad, books).
 * Scene/character artwork now comes from the unDraw set — see components/Art.tsx.
 */

type SvgProps = { className?: string };

export function Sparkle({ className }: SvgProps) {
  return (
    <svg viewBox="0 0 44 44" className={className} aria-hidden>
      <path d="M22 4 C23 15 25 17 36 22 C25 27 23 29 22 40 C21 29 19 27 8 22 C19 17 21 15 22 4 Z" fill="#FBD24E" />
      <circle cx="35" cy="9" r="2.4" fill="#FBD24E" />
    </svg>
  );
}

export function Gamepad({ className }: SvgProps) {
  return (
    <svg viewBox="0 0 130 96" className={className} aria-hidden>
      <path d="M30 34 h70 q22 0 26 26 q4 22 -14 24 q-12 1 -18 -12 h-58 q-6 13 -18 12 q-18 -2 -14 -24 q4 -26 26 -26 Z" fill="#8B7FE8" stroke="#6A5CC9" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M30 34 h70 q10 0 16 8 h-102 q6 -8 16 -8Z" fill="#A594F0" />
      <g stroke="#FFF" strokeWidth="5" strokeLinecap="round">
        <path d="M36 60 h16 M44 52 v16" />
      </g>
      <circle cx="90" cy="54" r="6" fill="#FBD24E" stroke="#E9B93A" strokeWidth="1.6" />
      <circle cx="102" cy="66" r="6" fill="#46B06A" stroke="#3A9A5A" strokeWidth="1.6" />
    </svg>
  );
}

export function Books({ className }: SvgProps) {
  return (
    <svg viewBox="0 0 130 96" className={className} aria-hidden>
      <g strokeWidth="2.5" strokeLinejoin="round">
        <rect x="24" y="62" width="80" height="16" rx="3" fill="#4E9BE6" stroke="#3D82C8" />
        <rect x="30" y="46" width="72" height="16" rx="3" fill="#F0994A" stroke="#D57F34" />
        <rect x="26" y="30" width="76" height="16" rx="3" fill="#46B06A" stroke="#3A9A5A" />
        <g stroke="#FFF" strokeWidth="2" opacity="0.7">
          <path d="M32 70 h64 M36 54 h60 M32 38 h64" />
        </g>
        <rect x="74" y="12" width="34" height="46" rx="3" fill="#EC8FB0" stroke="#D66E92" transform="rotate(10 91 35)" />
      </g>
    </svg>
  );
}

export function Sun({ className }: SvgProps) {
  return (
    <svg viewBox="0 0 84 84" className={className} aria-hidden>
      <circle cx="42" cy="42" r="26" fill="#FDEBA6" opacity="0.5" />
      <g stroke="#F4B740" strokeWidth="4.5" strokeLinecap="round">
        <path d="M42 6 v10 M42 68 v10 M6 42 h10 M68 42 h10 M17 17 l7 7 M60 60 l7 7 M67 17 l-7 7 M24 60 l-7 7" />
      </g>
      <circle cx="42" cy="42" r="17" fill="#FBD24E" stroke="#E9B93A" strokeWidth="2" />
    </svg>
  );
}

export function Hills({ className }: SvgProps) {
  return (
    <svg viewBox="0 0 1440 160" className={className} preserveAspectRatio="none" aria-hidden>
      <path d="M0 90 Q360 30 720 80 T1440 70 V160 H0Z" fill="#CBEBD3" />
      <path d="M0 120 Q360 80 720 116 T1440 108 V160 H0Z" fill="#B4E1BF" />
    </svg>
  );
}
