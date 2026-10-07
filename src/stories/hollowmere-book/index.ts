import { hollowmereLegacy } from "../hollowmere";
import type { StoryDef } from "../types";
import { ch01 } from "./ch01";
import { ch02 } from "./ch02";
import { ch03 } from "./ch03";

// Chapters rewritten at book length live in their own files. Chapters that
// have not been rewritten yet still come from the original single-file story.
const rewritten = [...ch01, ...ch02, ...ch03];
const rewrittenKeys = new Set(rewritten.map((n) => n.key));

export const hollowmere: StoryDef = {
  ...hollowmereLegacy,
  flags: {
    ...hollowmereLegacy.flags,
    watched_east: { label: "Watched the light in the east wing" },
    tipped_salt: { label: "Emptied the salt from your windowsill" },
    noted_gap: { label: "Recorded the missing daybooks" },
    found_scrap: { label: "Found a scorched scrap behind Shelf Nine" },
    joined_julian: { label: "Sat with Julian while the house sang" },
    hid_from_song: { label: "Hid from the singing" },
    kept_notes: { label: "Kept notes on the singing" },
  },
  nodes: [...rewritten, ...hollowmereLegacy.nodes.filter((n) => !rewrittenKeys.has(n.key))],
};