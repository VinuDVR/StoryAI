import { keplerStationLegacy } from "../kepler-station";
import type { StoryDef } from "../types";
import { ch01 } from "./ch01";
import { ch02 } from "./ch02";
import { ch03 } from "./ch03";
import { ch04 } from "./ch04";
import { ch05 } from "./ch05";
import { ch06 } from "./ch06";

// Chapters rewritten at book length live in their own files. Chapters that
// have not been rewritten yet still come from the original single-file story.
const rewritten = [...ch01, ...ch02, ...ch03, ...ch04, ...ch05, ...ch06];
const rewrittenKeys = new Set(rewritten.map((n) => n.key));

export const keplerStation: StoryDef = {
  ...keplerStationLegacy,
  flags: {
    ...keplerStationLegacy.flags,
    checked_pod: { label: "Read your pod's event log" },
    called_out: { label: "Called out into the dark" },
    asked_aria_crew: { label: "Asked ARIA where the crew was" },
    asked_aria_why: { label: "Asked ARIA why she woke you", secret: true },
    explained_to_tamsin: { label: "Explained yourself to Tamsin" },
    demanded_tamsin: { label: "Demanded answers from Tamsin" },
    shared_ration: { label: "Shared your ration with Tamsin" },
    offered_watch: { label: "Took Tamsin's watch so she could sleep" },
    tracked_hum: { label: "Traced the hum in the vents", secret: true },
    took_aria_word: { label: "Took ARIA at her word" },
    crosschecked: { label: "Cross-checked ARIA's telemetry" },
    asked_tamsin_theory: { label: "Asked Tamsin for her theory" },
    copied_telemetry: { label: "Copied the raw telemetry" },
    asked_safe: { label: "Asked ARIA what “safe” means" },
    viewport_talk: { label: "Talked with Tamsin at the viewport" },
    asked_tamsin_past: { label: "Asked Tamsin about her life before Kepler" },
    checked_sealed: { label: "Examined the sealed pods with Tamsin" },
    asked_pods_locked: { label: "Asked ARIA why the pods stay sealed" },
    took_recording: { label: "Took the commander's daughter's recording", secret: true },
    listened_dome: { label: "Listened at the door of Dome B", secret: true },
    tried_override: { label: "Tried to override the lock on Dome B" },
    pressed_aria_dome: { label: "Caught ARIA's slip about Dome B", secret: true },
    tether_trust: { label: "Went out on a shared tether with Tamsin" },
    sent_drone: { label: "Sent the drone out to the mast" },
    double_checked: { label: "Checked your seals twice" },
    asked_window: { label: "Asked Tamsin about the radiation window" },
    rushed_lock: { label: "Cycled the airlock at once" },
    fixed_fast: { label: "Spliced the antenna line in a hurry" },
    fixed_carefully: { label: "Spliced the antenna line properly, at a cost" },
    photographed_cut: { label: "Photographed the cut line and the marks", secret: true },
    asked_aria_signal: { label: "Asked ARIA how long the signal had been sending", secret: true },
    checked_tamsin_eva: { label: "Checked on Tamsin after the signal" },
    counted_beat: { label: "Counted the signal's beat" },
    told_tamsin_signal: { label: "Told Tamsin everything you heard" },
    kept_signal_quiet: { label: "Kept the worst of the signal to yourself" },
    replayed_with_tamsin: { label: "Replayed the recording with Tamsin", secret: true },
    held_tamsin_hand: { label: "Held Tamsin's hand in the galley" },
    admitted_fear: { label: "Admitted you were afraid" },
    stayed_professional: { label: "Kept things professional with Tamsin" },
    shared_pulse_theory: { label: "Shared your pulse theory with Tamsin" },
    promised_tamsin: { label: "Promised to stay with Tamsin", secret: true },
    slept_near_tamsin: { label: "Slept beside Tamsin's cot" },
    slept_medbay: { label: "Slept in the med bay" },
    took_night_watch: { label: "Kept the night watch" },
  },
  nodes: [...rewritten, ...keplerStationLegacy.nodes.filter((n) => !rewrittenKeys.has(n.key))],
};