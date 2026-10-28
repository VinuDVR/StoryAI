import { when } from "../dsl";
import type { NodeDef } from "../types";

export const ch06: NodeDef[] = [
  {
    key: "S6_N06",
    ch: 6,
    title: "The Sabotage",
    text: [
      "You wake with the particular feeling of someone who has won a prize in a dream and is about to be told it was a clerical error.",
      when({ flags: ["checked_oven"] }, "You think, absurdly, of a warm, twisted hose seal, and wonder whether the tent has been trying to tell you something."),
      "When you return to your bench in the morning, your beautiful, carefully measured caster sugar has been replaced by something else. You taste a pinch.",
      "Salt.",
      "You look up. Every baker in the tent is very busy not looking at you. At the far end, Jun is holding a whisk and looking confused.",
      "The cameras are rolling. They are, as always, rolling.",
    ],
    choices: [
      {
        k: "a",
        t: "Accuse Jun in front of everyone.",
        to: "S6_N06B",
        major: true,
        fx: { d: { "jun.trust": -3 }, f: ["accused_jun"] },
        echo: "Jun goes very still. \"I see,\" he says, in a voice that's very far from flirty.",
      },
      {
        k: "b",
        t: "Investigate quietly. Look at the cameras, the logs, the footprints.",
        to: "S6_N06B",
        major: true,
        fx: { d: { creativity: 1 }, f: ["found_clue"] },
      },
      {
        k: "c",
        t: "Take it to Dot.",
        to: "S6_N06B",
        major: true,
        fx: { d: { "dot.respect": 1 }, f: ["told_dot"] },
      },
    ],
  },
  {
    key: "S6_N06B",
    ch: 6,
    title: "The Bench Where It Happened",
    text: [
      when(
        { flags: ["accused_jun"] },
        "“Jun,” you say, loudly enough for the back row, “did you do this?” The silence that follows could be sliced and plated. Jun lays down his whisk like a man putting down a weapon he never meant to carry.",
        "JUN: No.",
        "Marguerite lowers her rolling pin an inch.",
        "MARGUERITE: Dear, I watched that boy apologise to a proving drawer yesterday. If he were going to commit a crime, he would leave a note saying sorry.",
        "Dev, from behind a tray of macarons, adds that Jun lent him his last egg on Tuesday and has not mentioned it since.",
      ),
      when(
        { flags: ["found_clue"] },
        "You don't shout. You crouch. You examine the bench, the bin, the floor and the sack under the pantry shelf. Bakers talk about mise en place; you are practising mise en suspicion. In the bin, face-down and half-empty, is a bag of caster sugar. It is the wrong brand. It carries, in small blue letters, the production company's logo.",
      ),
      when({ flags: ["found_clue", "followed_bryce"] }, "You've seen that logo before, stencilled on the side of a crate in the props tent at two in the morning. You do not let your face move."),
      when(
        { flags: ["told_dot"] },
        "Dame Dorothy listens to the whole story with her pen hovering over the clipboard. She does not say a word until you have finished.",
        "DOT: Not here. My trailer, after judging. Say nothing to anybody.",
        "She says it kindly, which is the most alarming way she can say anything.",
      ),
      "A runner arrives with a replacement bag of sugar and an expression of rehearsed concern. He does not meet your eye.",
      "Bryce appears in the doorway of the tent with a coffee and the tranquil face of a man who has never slept badly in his life.",
      when({ flags: ["told_bryce_no"] }, "BRYCE: Drama, hm? And here you were telling me you didn't do drama."),
      when({ flags: ["played_for_cameras"] }, "BRYCE: This is exactly what I meant. Don't stop. This is gold."),
    ],
    choices: [
      {
        k: "a",
        t: "Mention, lightly, that you saw somebody crossing the lawn last night.",
        to: "S6_N06C",
        req: { anyFlags: ["followed_bryce", "noted_trailer"] },
        hide: true,
        fx: { f: ["hinted_to_bryce"] },
        echo: "Bryce's smile doesn't move. His coffee, very slightly, does.",
      },
      {
        k: "b",
        t: "Quietly ask Dev and Marguerite to keep an eye on the benches.",
        to: "S6_N06C",
        fx: { f: ["recruited_bakers"] },
        echo: "Dev nods. Marguerite looks at her rolling pin with new purpose.",
      },
      {
        k: "c",
        t: "Throw yourself into rescuing the bake.",
        to: "S6_N06C",
        fx: { d: { creativity: 1 }, f: ["rescued_bake"] },
      },
    ],
  },
  {
    key: "S6_N06C",
    ch: 6,
    title: "Forty Minutes and Half a Bag",
    text: [
      "You have forty minutes and half a bag of sugar.",
      when({ flags: ["rescued_bake"] }, "You tear up your plan and start again from the one thing you know: butter, flour, whatever is left. It comes together the way things do when you have run out of other options."),
      when({ flags: ["recruited_bakers"] }, "All morning, small kindnesses arrive from both sides without comment: Marguerite's spare sieve, a clean bowl from Dev, a spoonful of pastry cream pushed across the bench like contraband."),
      when({ flags: ["hinted_to_bryce"] }, "Behind the cameras Bryce is making a long call in a low voice. Once he looks over his shoulder at you, and you look back, and it is the longest second of the day."),
      "By lunch your bench looks like a bench again. Whatever happens next, this will not be a morning you tell your grandchildren about. It might be one you tell a lawyer.",
      when({ flags: ["told_dot"] }, "Dot catches your eye across the tent and taps her watch twice: after judging."),
    ],
    choices: [
      {
        k: "a",
        t: "Walk over to Jun and apologise, properly.",
        to: "S6_N07",
        req: { flags: ["accused_jun"] },
        hide: true,
        fx: { d: { "jun.trust": 1 }, f: ["apologised_jun"] },
        echo: "He doesn't say it's fine. He says, “Thank you,” which is better.",
      },
      {
        k: "b",
        t: "Eat lunch with Marguerite and Dev. Safety in numbers.",
        to: "S6_N07",
        echo: "Marguerite shares her egg sandwich as though it were a state secret.",
      },
      {
        k: "c",
        t: "Walk the perimeter of the tent and count the cameras.",
        to: "S6_N07",
        echo: "Nine cameras. Someone, somewhere, has footage.",
      },
    ],
  },
];