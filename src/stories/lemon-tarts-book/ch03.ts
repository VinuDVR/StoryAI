import { when } from "../dsl";
import type { NodeDef } from "../types";

export const ch03: NodeDef[] = [
  {
    key: "S6_N03",
    ch: 3,
    title: "The Technical Challenge",
    text: [
      "The technical challenge is a mystery bake. A single sheet of paper, a pile of ingredients, and the cheerful words: \"Kouign-amann. Good luck.\"",
      "You have never heard of a kouign-amann. It sounds like a Breton sneeze.",
      when({ flags: ["lemon_tart"] }, "Dot gives you a long, unreadable look. \"Lemon,\" she mutters to herself, and writes something down."),
      "Two stations over, Jun is frowning at his own bench, lips moving silently.",
      "The recipe is nine words long. Seven of them are “butter”.",
    ],
    choices: [
      {
        k: "a",
        t: "Sneak a peek at Jun's recipe notes.",
        to: "S6_N03B",
        fx: { d: { "jun.trust": -1 }, f: ["peeked"] },
        echo: "He sees you. He says nothing. His ears go a very particular shade of pink.",
      },
      {
        k: "b",
        t: "Whisper across the gap and ask for his help.",
        to: "S6_N03B",
        fx: { d: { "jun.trust": 1, "jun.affection": 1 }, f: ["asked_jun_help"] },
      },
      {
        k: "c",
        t: "Trust your instincts and improvise.",
        to: "S6_N03B",
        fx: { d: { creativity: 1 }, f: ["improvised"] },
      },
    ],
  },
  {
    key: "S6_N03B",
    ch: 3,
    title: "Three Folds and a Prayer",
    text: [
      when({ flags: ["peeked"] }, "The notes are in tiny, perfect handwriting: “Laminate cold. Fold three times. Do not panic (underlined twice).” You commit it to memory with the guilty speed of someone reading a diary."),
      when({ flags: ["asked_jun_help"] }, "Jun glances left, then right, then mouths, with the extravagant care of a man doing sign language for a very small audience: BUTTER. COLD. FOLD. You nod as if this explains everything."),
      when({ flags: ["improvised"] }, "You decide kouign-amann is, in essence, caramelised croissant, and a croissant is, in essence, a very patient pastry. Your instincts are loud. Your instincts have never baked anything French."),
      "The dough fights back. It is rolled into a rectangle, folded like a business letter, rolled again, and each time it comes out somehow stickier, as if offended. The tent fills with the smell of butter and the sound of people saying “oh no” in a variety of dialects.",
      "Dev's dough has gone the shape of Wales. Marguerite's is flawless, and she knows it.",
      "A camera swings in to catch your face. You can feel yourself making an expression you cannot control. It is the one the audience will be shown, later, in slow motion.",
    ],
    choices: [
      {
        k: "a",
        t: "Laminate slowly and carefully, like a surgeon.",
        to: "S6_N03C",
        fx: { d: { poise: 1 } },
        echo: "You run out of time by a hair. You are very calm about it.",
      },
      {
        k: "b",
        t: "Wing it. More sugar. Always more sugar.",
        to: "S6_N03C",
        fx: { d: { creativity: 1, poise: -1 } },
        echo: "The caramel is possibly a crime. It is also, possibly, genius.",
      },
      {
        k: "c",
        t: "Hurry. Everybody else looks like they're ahead of you.",
        to: "S6_N03C",
        echo: "You are not ahead of anybody. You are, however, very warm.",
      },
    ],
  },
  {
    key: "S6_N03C",
    ch: 3,
    title: "Results",
    text: [
      "The kouign-amanns emerge from the ovens in a range of conditions from “triumph” to “hostage situation”. Dame Dorothy walks the line, tapping each with a spoon, holding each to the light, like a jeweller examining a suspicious diamond.",
      when({ flags: ["peeked"] }, "Your pastry is suspiciously close to Jun's. Dame Dorothy compares them for a long beat. “Interesting,” she says, with a look that could strip paint."),
      when({ flags: ["asked_jun_help"] }, "Your pastry and Jun's sit side by side. Dame Dorothy tastes yours, then his, and for the first time all day almost smiles. “Somebody here,” she says, “has been taking notes. Honestly.”"),
      when({ flags: ["improvised"] }, "Your pastry is nothing like anyone else's. It is, said Dame Dorothy slowly, “an entirely new interpretation of the word 'butter'.” Nobody can tell whether she means it as praise."),
      "Marguerite is placed first. Dev is placed last, and takes it with the serenity of a man who has once been trapped in a loft. You land somewhere in the middle, which, in a baking competition, is the loneliest place there is.",
      "The cameras pan across eight faces. Jun's is looking at the floor with enormous concentration. The producer, in the shadows at the back, is looking at all of you.",
      "Somewhere in the tent a timer goes off, and nobody can find it.",
    ],
    choices: [
      {
        k: "a",
        t: "Congratulate Marguerite, and then turn and congratulate Jun on his rise, too.",
        to: "S6_N04",
        fx: { d: { "jun.trust": 1 } },
        echo: "He flushes. “I didn't think anyone was watching,” he says. You were.",
      },
      {
        k: "b",
        t: "Give the camera your best, most dazzling smile.",
        to: "S6_N04",
        fx: { d: { poise: 1 } },
        echo: "You can feel it land, a little crooked, like a hat in a gale.",
      },
      {
        k: "c",
        t: "Slip out to the pantry for a moment's peace.",
        to: "S6_N04",
        echo: "The pantry smells of vanilla and defeat. There are, tellingly, no pods left.",
      },
    ],
  },
];