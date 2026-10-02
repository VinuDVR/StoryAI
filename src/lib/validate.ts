import type { Block, Cond, Effects, GameState, StoryDef } from "../stories/types";
import { normalize, type NormNode } from "../stories/dsl";
import { applyEffects, checkCond, initialState, resolveRoutes } from "./engine";

export interface StoryReport {
  slug: string;
  title: string;
  nodeCount: number;
  choiceCount: number;
  premiumCount: number;
  endingCount: number;
  chapterCount: number;
  errors: string[];
  warnings: string[];
  sim: {
    runs: number;
    free: Record<string, number>;
    all: Record<string, number>;
    endings: { key: string; title: string }[];
  };
}

function condsOf(c: Cond | undefined, out: Cond[] = []): Cond[] {
  if (!c) return out;
  out.push(c);
  c.any?.forEach((x) => condsOf(x, out));
  return out;
}

function blockConds(blocks: Block[]): Cond[] {
  const out: Cond[] = [];
  for (const b of blocks) if (typeof b !== "string") condsOf(b.if, out);
  return out;
}

export function validateStory(def: StoryDef, runs = 4000): StoryReport {
  const nodes = normalize(def);
  const errors: string[] = [];
  const warnings: string[] = [];
  const byKey = new Map<string, NormNode>();

  for (const n of nodes) {
    if (byKey.has(n.key)) errors.push(`Duplicate node id ${n.key}`);
    byKey.set(n.key, n);
  }

  const statKeys = new Set<string>(def.stats.map((s) => s.id));
  for (const c of def.characters) for (const r of c.rel) statKeys.add(`${c.id}.${r}`);

  const addedFlags = new Set<string>();
  const addedItems = new Set<string>();
  const choiceKeys = new Set<string>();
  const effectsList: { where: string; fx: Effects }[] = [];
  const condList: { where: string; c: Cond }[] = [];

  const starts = nodes.filter((n) => n.start);
  if (starts.length !== 1) errors.push(`Expected exactly 1 start node, found ${starts.length}`);

  let choiceCount = 0;
  let premiumCount = 0;

  for (const n of nodes) {
    blockConds(n.text).forEach((c) => condList.push({ where: `${n.key} text`, c }));
    n.routes?.forEach((r, i) => {
      if (!byKey.has(r.to)) errors.push(`${n.key}: route points to missing node ${r.to}`);
      condsOf(r.if).forEach((c) => condList.push({ where: `${n.key} route`, c }));
      if (!r.if && i !== n.routes!.length - 1) errors.push(`${n.key}: unconditional route must be last`);
    });
    if (n.routes?.length && !n.routes[n.routes.length - 1].if) {
      // fine: fallback present
    } else if (n.routes?.length) {
      errors.push(`${n.key}: router has no fallback route`);
    }

    if (n.ending) {
      if (n.choices.length) errors.push(`${n.key}: ending has choices`);
    } else if (!n.routes?.length) {
      if (!n.choices.length) errors.push(`${n.key}: dead end (no choices and not an ending)`);
      else if (!n.choices.some((c) => !c.req && !(c.gems && c.gems > 0)))
        errors.push(`${n.key}: no always-available free choice (soft-lock risk)`);
    }

    for (const c of n.choices) {
      choiceCount++;
      if (choiceKeys.has(c.k)) errors.push(`Duplicate choice id ${c.k}`);
      choiceKeys.add(c.k);
      if (!byKey.has(c.to)) errors.push(`${c.k}: points to missing node ${c.to}`);
      if (c.gems !== undefined) {
        premiumCount++;
        if (!Number.isInteger(c.gems) || c.gems <= 0) errors.push(`${c.k}: premium choice needs a positive price`);
        if (c.req) warnings.push(`${c.k}: premium choice also has requirements`);
      }
      if (c.req) condsOf(c.req).forEach((x) => condList.push({ where: c.k, c: x }));
      if (c.fx) {
        effectsList.push({ where: c.k, fx: c.fx });
        c.fx.f?.forEach((f) => addedFlags.add(f));
        c.fx.i?.forEach((i) => addedItems.add(i));
      }
    }
  }

  for (const { where, fx } of effectsList) {
    for (const k of Object.keys(fx.d ?? {})) if (!statKeys.has(k)) errors.push(`${where}: unknown stat "${k}"`);
  }
  for (const { where, c } of condList) {
    for (const k of [...Object.keys(c.gte ?? {}), ...Object.keys(c.lte ?? {})])
      if (!statKeys.has(k)) errors.push(`${where}: unknown stat "${k}" in condition`);
    for (const f of [...(c.flags ?? []), ...(c.anyFlags ?? []), ...(c.notFlags ?? [])])
      if (!addedFlags.has(f)) errors.push(`${where}: flag "${f}" is checked but never granted`);
    for (const i of c.items ?? []) if (!addedItems.has(i)) errors.push(`${where}: item "${i}" is checked but never granted`);
  }
  for (const f of addedFlags) if (!def.flags[f]) warnings.push(`Flag "${f}" has no journal label`);
  for (const f of Object.keys(def.flags)) if (!addedFlags.has(f)) warnings.push(`Labelled flag "${f}" is never granted`);

  // Graph checks
  const adj = (n: NormNode) => [...n.choices.map((c) => c.to), ...(n.routes ?? []).map((r) => r.to)];
  const start = starts[0];
  if (start) {
    const seen = new Set<string>([start.key]);
    const queue = [start.key];
    while (queue.length) {
      const k = queue.shift()!;
      for (const t of adj(byKey.get(k)!)) {
        if (byKey.has(t) && !seen.has(t)) {
          seen.add(t);
          queue.push(t);
        }
      }
    }
    for (const n of nodes) if (!seen.has(n.key)) errors.push(`${n.key}: orphaned (unreachable from start)`);

    // cycle detection
    const color = new Map<string, number>();
    const visit = (k: string): boolean => {
      color.set(k, 1);
      for (const t of adj(byKey.get(k)!)) {
        if (!byKey.has(t)) continue;
        const c = color.get(t) ?? 0;
        if (c === 1) return true;
        if (c === 0 && visit(t)) return true;
      }
      color.set(k, 2);
      return false;
    };
    if (visit(start.key)) errors.push("Story graph contains a loop");
  }

  // Simulation
  const free: Record<string, number> = {};
  const all: Record<string, number> = {};
  const endings = nodes.filter((n) => n.ending).map((n) => ({ key: n.key, title: n.ending!.title }));
  if (!errors.length && start) {
    for (const mode of ["free", "all"] as const) {
      for (let r = 0; r < runs; r++) {
        let state: GameState = initialState(def);
        let cur = resolveRoutes((k) => byKey.get(k), start.key, state);
        for (let step = 0; step < 200; step++) {
          const node = byKey.get(cur)!;
          if (node.ending) {
            const bucket = mode === "free" ? free : all;
            bucket[cur] = (bucket[cur] ?? 0) + 1;
            break;
          }
          const avail = node.choices.filter((c) => checkCond(state, c.req) && (mode === "all" || !c.gems));
          if (!avail.length) {
            errors.push(`${cur}: simulation soft-lock in ${mode} mode`);
            break;
          }
          const pick = avail[Math.floor(Math.random() * avail.length)];
          state = applyEffects(state, pick.fx);
          cur = resolveRoutes((k) => byKey.get(k), pick.to, state);
        }
      }
    }
    for (const e of endings) {
      if (!all[e.key]) warnings.push(`Ending "${e.title}" never reached in ${runs} simulated runs`);
      else if (!free[e.key]) warnings.push(`Ending "${e.title}" needs premium choices in simulation`);
    }
    if (!Object.keys(free).length) errors.push("No ending reachable without spending gems");
  }

  const chapters = new Set(nodes.filter((n) => !n.routes?.length).map((n) => n.ch));
  return {
    slug: def.slug,
    title: def.title,
    nodeCount: nodes.length,
    choiceCount,
    premiumCount,
    endingCount: endings.length,
    chapterCount: Math.max(0, ...chapters),
    errors: [...new Set(errors)],
    warnings: [...new Set(warnings)],
    sim: { runs, free, all, endings },
  };
}
