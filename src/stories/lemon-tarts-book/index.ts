import { lemonTartsLegacy } from "../lemon-tarts";
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

// Chapters rewritten at book length live in their own files. Chapters that
// have not been rewritten yet still come from the original single-file story.
const rewritten = [...ch01, ...ch02, ...ch03, ...ch04, ...ch05, ...ch06, ...ch07, ...ch08, ...ch09, ...ch10, ...ch11, ...ch12];
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
    jun_saved_you: { label: "Let Jun put out the fire" },
    checked_oven: { label: "Checked your oven's gas seal", secret: true },
    helped_dev: { label: "Rescued Dev's macarons" },
    asked_ovens: { label: "Asked who serviced the ovens" },
    thanked_jun: { label: "Thanked Jun for the fire blanket" },
    practised_with_jun: { label: "Baked with Jun at midnight" },
    left_jun: { label: "Left Jun alone at midnight" },
    told_jun_gran: { label: "Told Jun about your gran's notebook", secret: true },
    followed_bryce: { label: "Followed Bryce across the lawn", secret: true },
    noted_trailer: { label: "Saw Bryce leave the production trailer" },
    hinted_to_bryce: { label: "Hinted to Bryce that you saw him" },
    recruited_bakers: { label: "Asked Dev and Marguerite to keep watch" },
    rescued_bake: { label: "Rebuilt your bake from scratch" },
    apologised_jun: { label: "Apologised to Jun" },
    confessed_dot: { label: "Told Dot the truth about why you're here" },
    blamed_jun: { label: "Blamed Jun to Dot" },
    showed_dot_bag: { label: "Showed Dot the sugar bag", secret: true },
    told_dot_bryce: { label: "Told Dot what you saw on the lawn", secret: true },
    promised_dot: { label: "Promised Dot a bake worth staying for" },
    followed_jun: { label: "Followed Jun's plan in the pairs challenge" },
    took_charge: { label: "Took charge in the pairs challenge" },
    compromised: { label: "Blended your lemon with Jun's technique" },
    jun_opened_up: { label: "Heard what Jun was afraid of", secret: true },
    denied_rumour: { label: "Denied the pantry rumour" },
    owned_rumour: { label: "Joked about the pantry rumour" },
    asked_jun_rumour: { label: "Asked Jun about the pantry rumour" },
    refused_bryce_deal: { label: "Told Bryce to make the story go away" },
    asked_who_leaked: { label: "Asked Bryce who tipped off the press", secret: true },
    let_bryce_run: { label: "Let Bryce run with the story" },
    stepped_out: { label: "Let Bryce see you overhearing him" },
    recorded_bryce: { label: "Recorded Bryce's confession", secret: true },
    bryce_explained: { label: "Asked Bryce why he did it", secret: true },
    sat_with_marguerite: { label: "Sat with Marguerite on the lawn" },
    final_gran_page: { label: "Opened Gran's notebook for the final" },
    final_precise: { label: "Planned a flawless showstopper" },
    final_watched_jun: { label: "Watched what Jun was baking" },
    final_tasted: { label: "Tasted as you went in the final" },
    final_helped_marguerite: { label: "Helped Marguerite in the final" },
  },
  nodes: [...rewritten, ...lemonTartsLegacy.nodes.filter((n) => !rewrittenKeys.has(n.key))],
};