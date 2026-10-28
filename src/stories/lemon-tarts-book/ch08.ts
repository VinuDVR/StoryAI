import { when } from "../dsl";
import type { NodeDef } from "../types";

export const ch08: NodeDef[] = [
  {
    key: "S6_N08",
    ch: 8,
    title: "The Partner Challenge",
    text: [
      "The semi-final is a pairs challenge, and the universe, which clearly has a sense of humour, puts you with Jun.",
      when({ flags: ["accused_jun"] }, "He's scrupulously polite. He hasn't made a single joke all morning, and you miss them more than you expected to."),
      when({ flags: ["apologised_jun"] }, "He has been warmer since your apology. Not much. A degree. You are trying very hard not to count degrees."),
      when({ flags: ["practised_with_jun"] }, "He has brought two aprons to the bench, and held one out before you could ask."),
      "DOT: You have ninety minutes to produce a joint dessert that represents both of you. I want harmony. I want flavour. I want no fire.",
      "Jun gives you a nervous half-smile over a mountain of egg whites.",
    ],
    choices: [
      {
        k: "a",
        t: "Follow Jun's plan. He clearly knows what he's doing.",
        to: "S6_N08B",
        major: true,
        fx: { d: { "jun.trust": 1 }, f: ["followed_jun"] },
      },
      {
        k: "b",
        t: "Take charge. Somebody has to.",
        to: "S6_N08B",
        major: true,
        fx: { d: { poise: 1, creativity: 1 }, f: ["took_charge"] },
      },
      {
        k: "c",
        t: "Suggest a compromise: your lemon, his technique.",
        to: "S6_N08B",
        major: true,
        req: { gte: { "jun.trust": 2 } },
        lock: "Jun would need to trust you enough to try it.",
        fx: { d: { creativity: 2, "jun.affection": 1 }, f: ["compromised"] },
      },
    ],
  },
  {
    key: "S6_N08B",
    ch: 8,
    title: "Meringue Diplomacy",
    text: [
      when({ flags: ["followed_jun"] }, "Jun's plan is a pencilled diagram with arrows. There are, by your count, eleven stages and a sub-stage labelled “emotional”. You follow it the way you'd follow a very kind sat-nav."),
      when({ flags: ["took_charge"] }, "You take the whisk. Jun lets you, which should have been a warning. By minute twenty you have a bowl of egg-white soup and the creeping suspicion that leadership is mostly shouting."),
      when({ flags: ["compromised"] }, "Your lemon, his technique. It sounds like a peace treaty and bakes like one: nobody entirely happy, everybody secretly pleased. Every ten minutes one of you says “try this”, and the other tries it."),
      "Across the tent Marguerite and Dev have been paired, and are conducting a mild constitutional crisis over whether sourdough counts as dessert.",
      "DEV: It's got sugar in it. Technically.",
      "MARGUERITE: So has a Labrador, dear.",
      "At minute fifty the meringue refuses to peak. It slumps in the bowl like a sulking teenager. Jun stares at it as if it had personally betrayed him. His hands, you notice, are shaking very slightly.",
    ],
    choices: [
      {
        k: "a",
        t: "Crack jokes about the sulking meringue until he laughs.",
        to: "S6_N08C",
        fx: { d: { "jun.affection": 1 } },
      },
      {
        k: "b",
        t: "Take the whisk, gently, and tell him to breathe.",
        to: "S6_N08C",
        fx: { d: { "jun.trust": 1 } },
      },
      {
        k: "c",
        t: "Ask Jun what's actually worrying him.",
        to: "S6_N08C",
        req: { gte: { "jun.trust": 3 } },
        lock: "Jun would need to trust you more before he said.",
        fx: { d: { "jun.trust": 1 }, f: ["jun_opened_up"] },
      },
      {
        k: "d",
        t: "Rescue it with a pinch of cream of tartar and nerve.",
        to: "S6_N08C",
        fx: { d: { creativity: 1 } },
        echo: "The meringue stiffens in sudden, awkward respect.",
      },
    ],
  },
  {
    key: "S6_N08C",
    ch: 8,
    title: "Two Plates",
    text: [
      when({ flags: ["jun_opened_up"] }, "Jun told you, in a low voice between whisks, that he's afraid of finishing second to someone who knows what the thing is supposed to taste like. “I only ever make things I've read about,” he said. “You make things you remember.”"),
      when({ flags: ["told_jun_gran"] }, "He has set his grandmother's recipe notebook on the corner of the bench, face-down, like a man who wants it near but can't bear to look. You don't mention it. You both know it's there."),
      "The ninety minutes end the way ninety minutes always do: a hundred small crises and one large one, all resolved by hand. Two plates reach the judging table. The meringue is, against all odds, peaked.",
      "Dot tastes. For a long moment she looks like a woman listening to a faraway radio.",
      when({ flags: ["compromised"] }, "DOT: Your lemon and his technique. It tastes of two kitchens that have decided to be one. I do not say this often: well done."),
      when({ flags: ["followed_jun"] }, "DOT: It is his dish, expertly executed, with you holding the spoon. It is beautiful. It is also slightly lonely."),
      when({ flags: ["took_charge"] }, "DOT: Bold. Confident. A little bossy. It rose, though, which is more than I can say for most men I've known."),
      "Marguerite and Dev's sourdough, it is announced, “narrowly fails to qualify as a dessert”. Dev takes it well. Marguerite does not.",
    ],
    choices: [
      {
        k: "a",
        t: "Share the credit with Jun, out loud.",
        to: "S6_N09",
        fx: { d: { "jun.trust": 1 } },
      },
      {
        k: "b",
        t: "Take the compliment and enjoy it.",
        to: "S6_N09",
        fx: { d: { poise: 1 } },
      },
      {
        k: "c",
        t: "Quietly pass your spoon to Jun for the last taste.",
        to: "S6_N09",
        req: { gte: { "jun.affection": 3 } },
        hide: true,
        fx: { d: { "jun.affection": 1 } },
        echo: "He holds the spoon as if it were the last thing anyone had ever given him.",
      },
    ],
  },
];