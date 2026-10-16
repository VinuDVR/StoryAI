import { lemonTartsLegacy } from "../lemon-tarts";
import type { StoryDef } from "../types";
import { ch01 } from "./ch01";
import { ch02 } from "./ch02";
import { ch03 } from "./ch03";

// Chapters rewritten at book length live in their own files. Chapters that
// have not been rewritten yet still come from the original single-file story.
const rewritten = [...ch01, ...ch02, ...ch03];
const rewrittenKeys = new Set(rewritten.map((n) => n.key));

export const lemonTarts: StoryDef = {
  ...lemonTartsLegacy,
  flags: {
    ...lemonTartsLegacy.flags,
    split_pod: { label: "Split the last vanilla pod with Jun" },
    grabbed_pod: { label: "Snatched the last vanilla pod" },
    met_marguerite: { label: "Befriended Marguerite" },
    clocked_jun: { label: "Studied Jun's station" },
    told_bryce_no: { label: "Told Bryce you wouldn't do drama" },
    played_for_cameras: { label: "Played up for Bryce's cameras" },
    went_wild: { label: "Went wild with a molecular lemon cloud" },
    played_safe: { label: "Baked something safe and elegant" },
    tasted_as_you_go: { label: "Tasted as you went, like Gran" },
    tasted_jun_curd: { label: "Stole a spoonful of Jun's curd" },
    credited_gran: { label: "Credited your grandmother in front of the tent", secret: true },
    asked_jun_help: { label: "Asked Jun for help in the technical" },
    improvised: { label: "Improvised the kouign-amann" },
  },
  nodes: [...rewritten, ...lemonTartsLegacy.nodes.filter((n) => !rewrittenKeys.has(n.key))],
};