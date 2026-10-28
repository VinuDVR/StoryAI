import { when } from "../dsl";
import type { NodeDef } from "../types";

export const ch05: NodeDef[] = [
  {
    key: "S6_N05",
    ch: 5,
    title: "Midnight in the Tent",
    text: [
      "You can't sleep. At midnight you creep back into the silent tent, because nothing soothes an anxious baker like industrial equipment.",
      "The tent at night is a different animal. The cameras sleep under their covers like huge, expensive birds. The chandelier of whisks ticks as it cools. Every bench has been wiped and every oven propped open to dry, and the whole place smells of sugar and bleach, like a very clean sweet shop.",
      when({ flags: ["checked_oven"] }, "You check your oven first. You tell yourself it is habit. It is not habit."),
      "There's a single light on at Jun's bench. He's flattening dough with the tender concentration of a man defusing a bomb.",
      when({ flags: ["lemon_tart"] }, "He looks up. \"I tasted your tart, earlier. It was the kind of thing that makes you call your gran.\""),
      "JUN: Couldn't sleep either?",
    ],
    choices: [
      {
        k: "a",
        t: "Pull up a stool and practise together.",
        to: "S6_N05B",
        fx: { d: { "jun.affection": 2, "jun.trust": 1 }, f: ["practised_with_jun"] },
        echo: "Two hours vanish in flour and laughter. Neither of you mention the time.",
      },
      {
        k: "b",
        t: "Ask him about the lemon recipe he keeps scribbling in the margins.",
        to: "S6_N05B",
        fx: { d: { "jun.trust": 1 }, f: ["knows_jun_recipe"] },
      },
      {
        k: "c",
        t: "Leave him to it. Rivals don't have midnight chats.",
        to: "S6_N05B",
        fx: { d: { poise: 1 }, f: ["left_jun"] },
      },
    ],
  },
  {
    key: "S6_N05B",
    ch: 5,
    title: "Jun's Lemon",
    text: [
      when({ flags: ["practised_with_jun"] }, "You pull up a stool. He doesn't ask. He slides a bowl of flour towards you with the quiet understanding of a man who has been lonely in a very large tent. You spend an hour folding, rolling and swearing softly. Jun's jokes arrive in an apologetic drizzle, and you find you are laughing at them."),
      when({ flags: ["knows_jun_recipe"] }, "He goes very still. Then, slowly, he turns his notebook so you can see: a page of crossings-out, and underneath, a recipe in someone else's handwriting, with a smudge in the corner the size of a thumb."),
      when({ flags: ["left_jun"] }, "You make it as far as the tent flap before curiosity wrecks your dignity. You spend a full minute pretending to adjust your shoe while Jun hums over his dough. It's a lullaby. You don't know it. You tell yourself it doesn't make you want to go back."),
      when({ notFlags: ["left_jun"] }, "JUN: My grandmother's lemon tart. I can read every word of it except the thing she added last."),
      when({ notFlags: ["left_jun"] }, "JUN: She said there was one thing that made it taste like home, and she never wrote it down. She said I'd know it when I tasted it."),
      when({ notFlags: ["left_jun"] }, "He says it lightly. He does not look up while he says it."),
    ],
    choices: [
      {
        k: "a",
        t: "Tell him about Gran's notebook, and page nine.",
        to: "S6_N05C",
        req: { notFlags: ["left_jun"] },
        hide: true,
        fx: { d: { "jun.trust": 1 }, f: ["told_jun_gran"] },
        echo: "He listens the way you listen to a song you thought only you knew.",
      },
      {
        k: "b",
        t: "Offer to taste whatever he's making. No jokes.",
        to: "S6_N05C",
        req: { notFlags: ["left_jun"] },
        hide: true,
        fx: { d: { "jun.affection": 1 } },
        echo: "He hands you a spoon with both hands, as though it were an exam paper.",
      },
      {
        k: "c",
        t: "Keep it light. Make a joke about his apron.",
        to: "S6_N05C",
        req: { notFlags: ["left_jun"] },
        hide: true,
        fx: { d: { poise: 1 } },
        echo: "“It's a very good apron,” he says, deeply wounded, and then laughs.",
      },
      {
        k: "d",
        t: "Slip out into the night.",
        to: "S6_N05C",
      },
    ],
  },
  {
    key: "S6_N05C",
    ch: 5,
    title: "The Walk Back",
    text: [
      "It's past two when you cross the lawn to the caravans. The moon is up, the grass is silver, and somewhere a fox is having what sounds like an argument with a bin.",
      when({ anyFlags: ["practised_with_jun", "knows_jun_recipe"] }, "Jun walks you as far as the first caravan, with his hands in his pockets and his eyes on the grass, in the way of a man who is trying very hard not to be walking you home."),
      "Across the lawn, a figure is leaving the production trailer with a plain canvas tote bag and the unhurried stride of a man who doesn't expect to be seen. It's Bryce. He carries the bag the way you'd carry something you'd rather not be asked about.",
      when({ anyFlags: ["practised_with_jun", "knows_jun_recipe"] }, "JUN: That's the third time this week. I assumed it was a very late snack."),
      when({ flags: ["told_bryce_no"] }, "He doesn't see you. You find you are glad. You haven't forgotten the length of his smile."),
      when({ flags: ["played_for_cameras"] }, "He doesn't see you. You are, slightly, relieved, and slightly insulted."),
    ],
    choices: [
      {
        k: "a",
        t: "Follow Bryce quietly.",
        to: "S6_N06",
        fx: { f: ["followed_bryce"] },
        echo: "He cuts between two marquees and vanishes into the props tent. When you reach the flap there's only a stack of crates and the smell of aftershave. You note which crate.",
      },
      {
        k: "b",
        t: "Note which way he came from, and go to bed.",
        to: "S6_N06",
        fx: { f: ["noted_trailer"] },
      },
      {
        k: "c",
        t: "Go to bed and stop being a detective.",
        to: "S6_N06",
      },
    ],
  },
];