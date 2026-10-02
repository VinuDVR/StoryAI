import type { EndingType, RenderBlock } from "@/stories/types";

export interface ChoiceView {
  key: string;
  text: string;
  premium: boolean;
  price: number;
  locked: boolean;
  lockReason?: string;
}

export interface BondView {
  id: string;
  name: string;
  emoji: string;
  color: string;
  role: string;
  blurb: string;
  stats: { label: string; icon: string; pct: number }[];
}

export interface EndingView {
  number: number;
  title: string;
  type: EndingType;
  majorChoices: number;
  secretsFound: number;
  secretsTotal: number;
  premiumUsed: number;
  gemsSpent: number;
  endingsFound: number;
  endingsTotal: number;
  endings: { key: string; title: string | null; found: boolean; current: boolean }[];
}

export interface GameView {
  id: string;
  slug: string;
  storyTitle: string;
  coverFrom: string;
  coverTo: string;
  coverImage: string | null;
  status: "active" | "completed";
  gems: number;
  chapter: number;
  totalChapters: number;
  node: { key: string; title: string; blocks: RenderBlock[] };
  choices: ChoiceView[];
  notice: { echo: string | null; shifted: string[] };
  bonds: BondView[];
  traits: { label: string; value: number }[];
  journal: { flags: { label: string; secret: boolean }[]; items: string[] };
  history: { step: number; chapter: number; scene: string; choice: string; premium: boolean; major: boolean }[];
  ending: EndingView | null;
}
