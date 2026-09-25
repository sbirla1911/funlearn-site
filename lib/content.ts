/**
 * Shared, hand-authored content for the FUNlearn concept showcase.
 * No backend / no real AI — this is illustrative data that pre-loads the pages
 * so friends can see the idea end-to-end.
 */

export type Accent = "sky" | "tangerine" | "grass" | "grape";

export type Example = {
  id: string;
  subject: string; // PHYSICS, CHEMISTRY, ...
  grade: string;
  accent: Accent;
  title: string;
  interest: string; // "football"
  interestPhrase: string; // "for a kid who loves football"
  body: string;
  textbook: string;
  illustration: "football" | "pancakes" | "plant" | "growth";
  duration: string;
};

export const examples: Example[] = [
  {
    id: "projectile",
    subject: "PHYSICS",
    grade: "Grade 9",
    accent: "sky",
    title: "Projectile motion",
    interest: "football",
    interestPhrase: "for a kid who loves football",
    body: "The ball leaves the boot, rises, slows at the top, then drops. That arc is the whole lesson: sideways speed stays put while gravity works on the up-and-down.",
    textbook:
      "A projectile follows a parabolic path under constant acceleration.",
    illustration: "football",
    duration: "2:18",
  },
  {
    id: "stoichiometry",
    subject: "CHEMISTRY",
    grade: "Grade 10",
    accent: "tangerine",
    title: "Stoichiometry",
    interest: "cooking",
    interestPhrase: "for a kid who loves cooking",
    body: "Doubling a recipe never changes the ratio of flour to eggs. Balanced equations work the same way: scale the amounts, keep the ratio.",
    textbook:
      "Use mole ratios from the balanced equation to convert between reactants and products.",
    illustration: "pancakes",
    duration: "2:04",
  },
  {
    id: "photosynthesis",
    subject: "BIOLOGY",
    grade: "Grade 7",
    accent: "grass",
    title: "Photosynthesis",
    interest: "farm-building games",
    interestPhrase: "for a kid who loves farm-building games",
    body: "A crop needs light, water and air to grow. Photosynthesis is how the plant turns those three into sugar, its stored energy, a bit like filling an XP bar.",
    textbook:
      "Photosynthesis converts light energy into chemical energy stored in glucose.",
    illustration: "plant",
    duration: "1:52",
  },
  {
    id: "exponential",
    subject: "MATH",
    grade: "Grade 8",
    accent: "grape",
    title: "Exponential growth",
    interest: "levelling up in games",
    interestPhrase: "for a kid who loves levelling up in games",
    body: "Every level asks for double the XP of the last one. Early levels fly by, late ones take forever, and that's exactly what exponential growth feels like.",
    textbook: "An exponential function has the form y = a · bˣ, where b is greater than 1.",
    illustration: "growth",
    duration: "2:10",
  },
];

/** Interest chips shown on the landing hero (swap the "Now playing" preview). */
export const heroInterests = [
  { id: "football", label: "Football", emoji: "⚽", exampleId: "projectile" },
  { id: "cooking", label: "Cooking", emoji: "🍳", exampleId: "stoichiometry" },
  { id: "gaming", label: "Gaming", emoji: "🎮", exampleId: "exponential" },
] as const;

/* ─────────────── Profile (get-started) data ─────────────── */

export const interestOptions = [
  "Football",
  "Cooking",
  "Gaming",
  "Dance",
  "Drawing",
  "Skateboarding",
  "Music",
  "Animals",
  "Space",
  "Basketball",
];

export const learnOptions = [
  "Projectile motion",
  "Fractions",
  "Photosynthesis",
  "Balancing equations",
  "Exponents",
  "Forces",
  "Cells",
];

export const suggestedCommunities = [
  {
    id: "football-physics",
    name: "Football + Physics",
    blurb: "Learn the science behind the game",
    accent: "grass" as Accent,
    icon: "⚽",
  },
  {
    id: "kitchen-chemistry",
    name: "Kitchen Chemistry",
    blurb: "Ratios, reactions and recipes",
    accent: "tangerine" as Accent,
    icon: "🍳",
  },
];

/* ─────────────── Dashboard data (Maya's home) ─────────────── */

export const communities = [
  { id: "football-physics", name: "Football + Physics", icon: "⚽", isNew: true },
  { id: "kitchen-chemistry", name: "Kitchen Chemistry", icon: "🍳", isNew: false },
  { id: "level-up-maths", name: "Level-Up Maths", icon: "🎮", isNew: false },
];

export const friends = [
  { name: "Priya", initial: "P", color: "blossom" },
  { name: "Leo", initial: "L", color: "grass" },
  { name: "Sam", initial: "S", color: "sunny" },
  { name: "Nora", initial: "N", color: "grape" },
];

export const savedContent = [
  {
    title: "Projectile motion",
    kind: "Video",
    interest: "football",
    illustration: "football" as const,
  },
  {
    title: "Balancing equations",
    kind: "Infographic",
    interest: "cooking",
    illustration: "pancakes" as const,
  },
  {
    title: "Exponents",
    kind: "Game",
    interest: "gaming",
    illustration: "growth" as const,
  },
];

export const challenges = [
  { text: "Score from 30 m: find the kick angle", done: true, xp: 50 },
  { text: "Scale a recipe to feed 12", done: false, xp: 40 },
  { text: "Beat the level-6 XP puzzle", done: false, xp: 60 },
];

export const friendsLearning = [
  { name: "Priya", initial: "P", color: "blossom", topic: "Photosynthesis", via: "baking", illustration: "plant" as const },
  { name: "Leo", initial: "L", color: "grass", topic: "Ratios", via: "skateboarding", illustration: "pancakes" as const },
  { name: "Sam", initial: "S", color: "sunny", topic: "Forces", via: "basketball", illustration: "football" as const },
];

export const outputKinds = [
  { label: "A short video", accent: "sky" as Accent, icon: "▶" },
  { label: "An infographic", accent: "grape" as Accent, icon: "📊" },
  { label: "A game to play", accent: "grass" as Accent, icon: "🎮" },
];

/* ─────────────── Progress / retention (dashboard) ─────────────── */

export const streak = {
  current: 5,
  longest: 12,
  // last 7 days, oldest → today (the last one is today, still open)
  week: [
    { label: "M", done: true },
    { label: "T", done: true },
    { label: "W", done: true },
    { label: "T", done: true },
    { label: "F", done: true, today: true },
    { label: "S", done: false },
    { label: "S", done: false },
  ] as { label: string; done: boolean; today?: boolean }[],
};

export const progress = {
  level: 4,
  title: "Curious Mind",
  xpIntoLevel: 320,
  xpPerLevel: 500,
  totalXp: 2320,
};

export const badges = [
  { icon: "🔥", label: "5-day streak", earned: true },
  { icon: "⚽", label: "Football scholar", earned: true },
  { icon: "🧪", label: "First reaction", earned: true },
  { icon: "📈", label: "Reached Level 4", earned: true },
  { icon: "🏆", label: "Weekly winner", earned: false },
  { icon: "🌱", label: "Biology buff", earned: false },
];

export const leaderboard = [
  { name: "Sam", initial: "S", color: "sunny", xp: 640 },
  { name: "Maya", initial: "M", color: "grape", xp: 520, you: true },
  { name: "Priya", initial: "P", color: "blossom", xp: 480 },
  { name: "Leo", initial: "L", color: "grass", xp: 300 },
  { name: "Nora", initial: "N", color: "grape", xp: 240 },
];
