// Shared story + game-state types. No imports so they're usable anywhere.

/** Condition. Stat keys: "courage" (player stat) or "rowan.trust" (relationship). */
export type Cond = {
  flags?: string[]; // all of these flags must be set
  notFlags?: string[]; // none of these flags may be set
  anyFlags?: string[]; // at least one of these flags
  items?: string[]; // all of these items held
  gte?: Record<string, number>;
  lte?: Record<string, number>;
  any?: Cond[]; // at least one sub-condition passes
};

/** Effects. d = stat deltas, f = flags to add, rf = flags to remove, i = items to add. */
export type Effects = {
  d?: Record<string, number>;
  f?: string[];
  rf?: string[];
  i?: string[];
};

/** A block of scene text. Strings: "NAME: dialogue", "> thought", "## sign/system", else narration. */
export type Block = string | { if: Cond; t: string[] };

export type EndingType = "romance" | "hopeful" | "bittersweet" | "dark" | "neutral";

export interface EndingDef {
  n: number;
  title: string;
  type: EndingType;
}

export interface CharacterDef {
  id: string;
  name: string;
  role: string;
  blurb: string;
  color: string;
  emoji: string;
  /** relationship stats tracked for this character, e.g. ["trust","affection"] */
  rel: string[];
}

export interface ChoiceDef {
  /** local key, made globally unique on normalize */
  k: string;
  t: string;
  to: string;
  fx?: Effects;
  req?: Cond;
  /** shown when the choice is locked */
  lock?: string;
  /** hide entirely when requirements are not met */
  hide?: boolean;
  /** premium price in gems */
  gems?: number;
  /** soft feedback shown on the next scene instead of raw numbers */
  echo?: string;
  /** counts toward "major choices" on the ending screen */
  major?: boolean;
}

export interface RouteDef {
  if?: Cond;
  to: string;
}

export interface NodeDef {
  key: string;
  ch: number;
  title: string;
  text: Block[];
  choices?: ChoiceDef[];
  /** auto-continue target (creates a single "Continue" choice) */
  next?: string;
  nextLabel?: string;
  /** effects applied by the auto-continue */
  fx?: Effects;
  /** router node: skipped automatically, first matching route wins */
  routes?: RouteDef[];
  start?: boolean;
  ending?: EndingDef;
}

export interface FlagInfo {
  label: string;
  /** hidden decisions that are counted on the ending screen */
  secret?: boolean;
}

export interface StoryDef {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  genres: string[];
  rating: string;
  setting: string;
  tone: string;
  cover: { from: string; to: string; emoji: string; image?: string };
  stats: { id: string; label: string }[];
  initial?: Record<string, number>;
  characters: CharacterDef[];
  flags: Record<string, FlagInfo>;
  items?: Record<string, string>;
  nodes: NodeDef[];
}

export interface StoryMeta {
  setting: string;
  tone: string;
  stats: { id: string; label: string }[];
  initial: Record<string, number>;
  characters: CharacterDef[];
  flags: Record<string, FlagInfo>;
  items: Record<string, string>;
}

export interface GameState {
  stats: Record<string, number>;
  rel: Record<string, Record<string, number>>;
  flags: string[];
  items: string[];
  gemsSpent: number;
  echo?: string | null;
  shifted?: string[];
}

export interface RenderBlock {
  type: "narration" | "dialogue" | "thought" | "system";
  speaker?: string;
  color?: string;
  text: string;
}
