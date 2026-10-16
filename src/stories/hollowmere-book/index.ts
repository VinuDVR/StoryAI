import { hollowmereLegacy } from "../hollowmere";
import type { StoryDef } from "../types";
import { ch01 } from "./ch01";
import { ch02 } from "./ch02";
import { ch03 } from "./ch03";
import { ch04 } from "./ch04";
import { ch05 } from "./ch05";
import { ch06 } from "./ch06";
import { ch07 } from "./ch07";
import { ch08 } from "./ch08";
import { ch09 } from "./ch09";
import { ch10 } from "./ch10";
import { ch11 } from "./ch11";
import { ch12 } from "./ch12";
import { ch13 } from "./ch13";

// Chapters rewritten at book length live in their own files. Chapters that
// have not been rewritten yet still come from the original single-file story.
const rewritten = [...ch01, ...ch02, ...ch03, ...ch04, ...ch05, ...ch06, ...ch07, ...ch08, ...ch09, ...ch10, ...ch11, ...ch12, ...ch13];
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
    asked_portrait: { label: "Asked Julian about the covered portrait" },
    held_hand: { label: "Held Julian's scarred hand" },
    promised_julian: { label: "Promised to wake Julian if you heard anything" },
    looked_landing: { label: "Opened your door to the landing" },
    used_key: { label: "Opened the east wing with the silver key" },
    julian_opened: { label: "Opened the east wing door with Julian" },
    broke_cross: { label: "Broke the rowan cross" },
    closed_door: { label: "Shut the east wing door behind you" },
    door_open: { label: "Left the east wing door open" },
    followed_prints: { label: "Followed the sooty handprints" },
    read_copybook: { label: "Read Adelaide's copybook", secret: true },
    tried_leave: { label: "Tried to turn back in the east wing" },
    promised_adelaide: { label: "Promised to carry Adelaide's message", secret: true },
    woke_julian: { label: "Went to Julian after the nursery" },
    slipped_back: { label: "Slipped back to your room unseen" },
    stayed_nursery: { label: "Kept Adelaide company until the pipes stopped", secret: true },
    refused_offering: { label: "Told Mrs. Wren you would not be the offering" },
    offered_help: { label: "Offered to share Mrs. Wren's burden" },
    agreed_to_sit: { label: "Agreed to sit at Mrs. Wren's table" },
    wrote_letter: { label: "Left a letter for the next archivist", secret: true },
    played_tune: { label: "Played Adelaide's lullaby for Julian", secret: true },
    wore_grey: { label: "Wore the grey dress Mrs. Wren laid out" },
    wore_own: { label: "Refused the grey dress and wore your own clothes" },
    salt_pocket: { label: "Carried salt to supper" },
    sat_in_circle: { label: "Sat inside the salt circle" },
    stood_outside: { label: "Stood outside the salt circle" },
    moved_chair: { label: "Dragged your chair out of the circle" },
    saw_hollow: { label: "Looked the Hollow in the face", secret: true },
    gave_message: { label: "Gave Julian Adelaide's message", secret: true },
    held_message: { label: "Held back Adelaide's message" },
    ran_stairs: { label: "Fled up the stairs with Julian" },
    braced: { label: "Stood your ground against the Hollow" },
    last_word_wren: { label: "Spoke with Mrs. Wren before dawn" },
    last_word_julian: { label: "Spoke with Julian before dawn" },
    last_word_adelaide: { label: "Went to Adelaide before dawn" },
  },
  nodes: [...rewritten, ...hollowmereLegacy.nodes.filter((n) => !rewrittenKeys.has(n.key))],
};