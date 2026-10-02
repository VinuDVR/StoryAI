import type {
  Block,
  CharacterDef,
  Cond,
  Effects,
  GameState,
  RenderBlock,
  RouteDef,
} from "../stories/types";

/**
 * The game engine. AI (or authors) generate content; this file alone decides
 * how state changes, which choices are available and where the story goes next.
 */

export const STAT_MIN = -5;
export const STAT_MAX = 10;

const clamp = (n: number) => Math.max(STAT_MIN, Math.min(STAT_MAX, n));

export function initialState(def: {
  stats: { id: string }[];
  characters: CharacterDef[];
  initial?: Record<string, number>;
}): GameState {
  const state: GameState = { stats: {}, rel: {}, flags: [], items: [], gemsSpent: 0, echo: null, shifted: [] };
  for (const s of def.stats) state.stats[s.id] = 0;
  for (const c of def.characters) {
    if (!c.rel.length) continue;
    state.rel[c.id] = {};
    for (const r of c.rel) state.rel[c.id][r] = 0;
  }
  for (const [k, v] of Object.entries(def.initial ?? {})) setStat(state, k, v);
  return state;
}

function setStat(state: GameState, key: string, value: number) {
  const i = key.indexOf(".");
  if (i > 0) {
    const c = key.slice(0, i);
    const s = key.slice(i + 1);
    state.rel[c] ??= {};
    state.rel[c][s] = clamp(value);
  } else {
    state.stats[key] = clamp(value);
  }
}

export function getStat(state: GameState, key: string): number {
  const i = key.indexOf(".");
  if (i > 0) return state.rel[key.slice(0, i)]?.[key.slice(i + 1)] ?? 0;
  return state.stats[key] ?? 0;
}

export function checkCond(state: GameState, c?: Cond | null): boolean {
  if (!c) return true;
  if (c.flags && !c.flags.every((f) => state.flags.includes(f))) return false;
  if (c.notFlags && c.notFlags.some((f) => state.flags.includes(f))) return false;
  if (c.anyFlags && !c.anyFlags.some((f) => state.flags.includes(f))) return false;
  if (c.items && !c.items.every((i) => state.items.includes(i))) return false;
  if (c.gte) for (const [k, v] of Object.entries(c.gte)) if (getStat(state, k) < v) return false;
  if (c.lte) for (const [k, v] of Object.entries(c.lte)) if (getStat(state, k) > v) return false;
  if (c.any && !c.any.some((x) => checkCond(state, x))) return false;
  return true;
}

export function applyEffects(state: GameState, fx?: Effects | null): GameState {
  const next: GameState = structuredClone(state);
  if (!fx) return next;
  for (const [k, delta] of Object.entries(fx.d ?? {})) setStat(next, k, getStat(next, k) + delta);
  for (const f of fx.f ?? []) if (!next.flags.includes(f)) next.flags.push(f);
  if (fx.rf) next.flags = next.flags.filter((f) => !fx.rf!.includes(f));
  for (const i of fx.i ?? []) if (!next.items.includes(i)) next.items.push(i);
  return next;
}

/** Follow router nodes (content-less nodes with `routes`) until a real scene is found. */
export function resolveRoutes<N extends { routes?: RouteDef[] | null }>(
  get: (key: string) => N | undefined,
  key: string,
  state: GameState,
): string {
  let cur = key;
  for (let i = 0; i < 12; i++) {
    const routes = get(cur)?.routes;
    if (!routes || routes.length === 0) return cur;
    const hit = routes.find((r) => checkCond(state, r.if));
    if (!hit) return cur;
    cur = hit.to;
  }
  return cur;
}

const SPEAKER = /^([A-Z][A-Z0-9'.\- ]{0,28}):\s+(.+)$/;

const titleCase = (s: string) =>
  s
    .toLowerCase()
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");

export function parseLine(line: string, characters: CharacterDef[] = []): RenderBlock {
  if (line.startsWith("> ")) return { type: "thought", text: line.slice(2) };
  if (line.startsWith("## ")) return { type: "system", text: line.slice(3) };
  const m = SPEAKER.exec(line);
  if (m) {
    const speaker = titleCase(m[1]);
    const first = speaker.toLowerCase().split(" ")[0];
    const char = characters.find((c) => c.name.toLowerCase().split(" ")[0] === first);
    return { type: "dialogue", speaker, color: char?.color, text: m[2] };
  }
  return { type: "narration", text: line };
}

export function renderBlocks(blocks: Block[], state: GameState, characters: CharacterDef[] = []): RenderBlock[] {
  const out: RenderBlock[] = [];
  for (const b of blocks) {
    if (typeof b === "string") out.push(parseLine(b, characters));
    else if (checkCond(state, b.if)) for (const l of b.t) out.push(parseLine(l, characters));
  }
  return out;
}

export const REL_LABELS: Record<string, { label: string; icon: string }> = {
  trust: { label: "Trust", icon: "🤝" },
  affection: { label: "Affection", icon: "❤️" },
  respect: { label: "Respect", icon: "⭐" },
  bond: { label: "Bond", icon: "💫" },
  rivalry: { label: "Rivalry", icon: "⚔️" },
  fear: { label: "Fear", icon: "😨" },
};
