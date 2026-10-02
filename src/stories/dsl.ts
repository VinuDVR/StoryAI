import type { Block, ChoiceDef, Cond, NodeDef, StoryDef } from "./types";

/** Conditional text block: only rendered when the condition passes. */
export const when = (cond: Cond, ...t: string[]): Block => ({ if: cond, t });

export type NormNode = Omit<NodeDef, "choices" | "next" | "nextLabel" | "fx"> & {
  choices: ChoiceDef[];
};

/** Expand `next` shortcuts and make every choice key globally unique. */
export function normalize(def: StoryDef): NormNode[] {
  return def.nodes.map((n) => {
    const { choices, next, nextLabel, fx, ...rest } = n;
    let list: ChoiceDef[] = [];
    if (choices && choices.length) {
      list = choices.map((c) => ({ ...c, k: `${n.key}_${c.k}` }));
    } else if (next) {
      list = [{ k: `${n.key}_NEXT`, t: nextLabel ?? "Continue", to: next, fx }];
    }
    return { ...rest, choices: list };
  });
}
