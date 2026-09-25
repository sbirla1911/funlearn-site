/**
 * Professional artwork, powered by the offline unDraw set
 * (react-undraw-illustrations, MIT), recoloured to the FUNlearn palette via
 * each illustration's `primaryColor` prop.
 *
 * `SubjectArt` renders the scene for a concept; `SubjectTile` is a compact
 * emoji tile for small thumbnails. Page illustrations are re-exported below.
 */
import UndrawGoal from "react-undraw-illustrations/lib/components/UndrawGoal/UndrawGoal";
import UndrawChef from "react-undraw-illustrations/lib/components/UndrawChef/UndrawChef";
import UndrawGardening from "react-undraw-illustrations/lib/components/UndrawGardening/UndrawGardening";
import UndrawSocialGrowth from "react-undraw-illustrations/lib/components/UndrawSocialGrowth/UndrawSocialGrowth";
import UndrawCommunity from "react-undraw-illustrations/lib/components/UndrawCommunity/UndrawCommunity";
import UndrawTeamSpirit from "react-undraw-illustrations/lib/components/UndrawTeamSpirit/UndrawTeamSpirit";
import UndrawStudying from "react-undraw-illustrations/lib/components/UndrawStudying/UndrawStudying";
import UndrawWelcome from "react-undraw-illustrations/lib/components/UndrawWelcome/UndrawWelcome";
import UndrawProfilePic from "react-undraw-illustrations/lib/components/UndrawProfilePic/UndrawProfilePic";
import UndrawScience from "react-undraw-illustrations/lib/components/UndrawScience/UndrawScience";

const BRAND = {
  grass: "#46B06A",
  bioGreen: "#3A9A5A",
  tangerine: "#F0994A",
  grape: "#8B7FE8",
  sky: "#4E9BE6",
};

type SubjectKind = "football" | "pancakes" | "plant" | "growth";

const subjectArt: Record<
  SubjectKind,
  { Comp: typeof UndrawGoal; color: string }
> = {
  football: { Comp: UndrawGoal, color: BRAND.grass },
  pancakes: { Comp: UndrawChef, color: BRAND.tangerine },
  plant: { Comp: UndrawGardening, color: BRAND.bioGreen },
  growth: { Comp: UndrawSocialGrowth, color: BRAND.grape },
};

/** Full themed scene illustration for a concept. */
export function SubjectArt({
  kind,
  className = "",
}: {
  kind: SubjectKind;
  className?: string;
}) {
  const { Comp, color } = subjectArt[kind];
  return (
    <div className={className}>
      <Comp primaryColor={color} height="auto" />
    </div>
  );
}

const tileMap: Record<SubjectKind, { emoji: string; bg: string }> = {
  football: { emoji: "⚽", bg: "bg-sky-soft" },
  pancakes: { emoji: "🥞", bg: "bg-tangerine-soft" },
  plant: { emoji: "🌱", bg: "bg-grass-soft" },
  growth: { emoji: "📈", bg: "bg-grape-soft" },
};

/** Compact tile for tiny thumbnails (saved content, friend rows). */
export function SubjectTile({
  kind,
  className = "",
}: {
  kind: SubjectKind;
  className?: string;
}) {
  const t = tileMap[kind];
  return (
    <span
      className={`flex items-center justify-center ${t.bg} ${className}`}
      aria-hidden
    >
      <span className="text-lg">{t.emoji}</span>
    </span>
  );
}

/* Page illustrations (themed to the palette). */
export function CommunityArt({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <UndrawCommunity primaryColor={BRAND.grass} height="auto" />
    </div>
  );
}
export function TeamArt({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <UndrawTeamSpirit primaryColor={BRAND.grape} height="auto" />
    </div>
  );
}
export function StudyingArt({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <UndrawStudying primaryColor={BRAND.sky} height="auto" />
    </div>
  );
}
export function WelcomeArt({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <UndrawWelcome primaryColor={BRAND.grass} height="auto" />
    </div>
  );
}
export function ProfileArt({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <UndrawProfilePic primaryColor={BRAND.tangerine} height="auto" />
    </div>
  );
}
export function ScienceArt({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <UndrawScience primaryColor={BRAND.sky} height="auto" />
    </div>
  );
}
