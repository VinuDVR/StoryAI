import { when } from "../dsl";
import type { NodeDef } from "../types";

export const ch09: NodeDef[] = [
  {
    key: "S6_N09",
    ch: 9,
    title: "The Rumour",
    text: [
      "You hear about it first from Dev, who arrives at your caravan door holding three newspapers and the expression of a man delivering a telegram.",
      "The next morning every newsagent in the county carries the same headline:",
      "## BAKE-OFF RIVALS CAUGHT SNOGGING IN PANTRY!",
      "There is a photograph. It is extremely blurry. It is, in fact, a picture of the two of you both reaching for the same jar of sprinkles.",
      "Bryce Halloran, the executive producer, is hovering near the catering table, looking like a cat that has swallowed a rating.",
    ],
    choices: [
      {
        k: "a",
        t: "Deny it loudly, repeatedly and into every microphone.",
        to: "S6_N09B",
        fx: { d: { poise: -1, "jun.affection": -1 }, f: ["denied_rumour"] },
      },
      {
        k: "b",
        t: "Own it with humour. \"He was stealing my sprinkles.\"",
        to: "S6_N09B",
        fx: { d: { poise: 2, "jun.affection": 1 }, f: ["owned_rumour"] },
      },
      {
        k: "c",
        t: "Ask Jun quietly what he wants to do about it.",
        to: "S6_N09B",
        fx: { d: { "jun.trust": 1, "jun.affection": 1 }, f: ["asked_jun_rumour"] },
        echo: "He blinks at you as though nobody has asked him that before.",
      },
    ],
  },
  {
    key: "S6_N09B",
    ch: 9,
    title: "The Gate",
    text: [
      "By nine there are four reporters at the gate, a van from a breakfast programme, and a man with a very long lens who is pretending to be a birdwatcher. The tent hums like a hive somebody has kicked.",
      when({ flags: ["denied_rumour"] }, "You denied it to a microphone, then to a second microphone, then to a lamppost. The more you deny, the more the cameras lean in. You have never been so thoroughly believed to be lying."),
      when({ flags: ["owned_rumour"] }, "“He was stealing my sprinkles,” you said, into the nearest lens, and the clip is already everywhere, with a laughing face under it and a hashtag that includes the word “sprinklegate”."),
      when({ flags: ["asked_jun_rumour"] }, "Jun came out beside you, a little white, and said quietly, without being asked, “It isn't true. But I'd be lying if I said I minded.” It is the most scandalous thing he has ever said in public, and he said it to a car park."),
      "Bryce appears at your elbow with a coffee for you, which is how you know he wants something.",
      "BRYCE: Lovely work. Remarkable engagement. Do you know, I could make this go away. Or I could make it bigger. I'm very flexible.",
      when({ flags: ["told_bryce_no"] }, "BRYCE: You were so sure you didn't do drama. And look at us."),
      when({ flags: ["played_for_cameras"] }, "BRYCE: You did promise me sparkle."),
      "He smiles. You feel the spreadsheet adjust.",
    ],
    choices: [
      {
        k: "a",
        t: "Tell him to make it go away. Politely.",
        to: "S6_N09C",
        major: true,
        fx: { d: { poise: 1 }, f: ["refused_bryce_deal"] },
        echo: "“Of course,” says Bryce, in the voice of a man who has noted the refusal and filed it under “later”.",
      },
      {
        k: "b",
        t: "Ask him, casually, who tipped off the press.",
        to: "S6_N09C",
        major: true,
        fx: { f: ["asked_who_leaked"] },
        echo: "“Press are like pigeons,” he says. “They simply arrive.” His eyes do not.",
      },
      {
        k: "c",
        t: "Let him make it bigger. It's only a headline.",
        to: "S6_N09C",
        major: true,
        fx: { d: { poise: -1 }, f: ["let_bryce_run"] },
      },
    ],
  },
  {
    key: "S6_N09C",
    ch: 9,
    title: "Hundreds and Thousands",
    text: [
      "At four, with the press finally gone, the tent breathes out. You find yourself in the pantry, because the universe has the subtlety of a brass band. It is quiet, cool, and smells of cinnamon and bad decisions.",
      "Jun is there already, standing very straight in front of a shelf of sprinkles as if they were a jury.",
      when({ flags: ["apologised_jun"] }, "JUN: I wanted to say thank you. For the apology. It meant more than the headline."),
      when({ flags: ["accused_jun"], notFlags: ["apologised_jun"] }, "He doesn't turn round. “You accused me in front of everyone,” he says, to the sprinkles. “And now the whole country thinks we're, well. And I find I can't be as angry as I'd like.”"),
      "JUN: I could make a statement. I could say it was a jar. I could say it was, in point of fact, hundreds and thousands.",
      "He says it with the dignity of a man proposing marriage by accident.",
    ],
    choices: [
      {
        k: "a",
        t: "Say you'd rather stand beside him than behind a story.",
        to: "S6_N10",
        fx: { d: { "jun.affection": 1 } },
        echo: "He turns, at last, and the sprinkles have the decency to look away.",
      },
      {
        k: "b",
        t: "Keep it professional: a joint statement, two lines, no sprinkles.",
        to: "S6_N10",
        fx: { d: { poise: 1 } },
      },
      {
        k: "c",
        t: "Offer him half the jar. Rivals share.",
        to: "S6_N10",
        fx: { d: { "jun.trust": 1 } },
        echo: "He takes it with both hands, as though it were evidence.",
      },
    ],
  },
];