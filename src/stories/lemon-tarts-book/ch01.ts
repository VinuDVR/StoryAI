import { when } from "../dsl";
import type { NodeDef } from "../types";

export const ch01: NodeDef[] = [
  {
    key: "S6_N01",
    ch: 1,
    title: "The Last Vanilla Pod",
    start: true,
    text: [
      "The Great Crumb & Whisk tent smells of butter, sugar and quiet panic. A cameraman is already filming you blink.",
      "You have been awake since four. You have rehearsed your name, your hometown and your Face Of Calm Determination in the bathroom mirror, and the mirror, frankly, was not convinced.",
      "You have one job this morning: reach the pantry, collect one Madagascar vanilla pod, and not cry on television.",
      "There is one pod left. There is also a man in a spotless navy apron, with excellent forearms, whose hand is already on it.",
      "JUN: Sorry, is this yours?",
      "YOU: It's the last one.",
      "JUN: I noticed. I've been noticing all morning. I've been planning this pod since six a.m.",
    ],
    choices: [
      {
        k: "a",
        t: "Offer to split it, like a civilised human.",
        to: "S6_N01B",
        fx: { d: { "jun.trust": 1, "jun.affection": 1 }, f: ["split_pod"] },
      },
      {
        k: "b",
        t: "Snatch it and run.",
        to: "S6_N01B",
        fx: { d: { poise: -1, "jun.trust": -1 }, f: ["grabbed_pod"] },
        echo: "You hear him say \"Wow\" behind you, with real respect.",
      },
      {
        k: "c",
        t: "Trade him your gran's secret sugar trick for the pod.",
        to: "S6_N01B",
        gems: 10,
        fx: { d: { "jun.trust": 2, creativity: 1 }, f: ["shared_secret"] },
      },
    ],
  },
  {
    key: "S6_N01B",
    ch: 1,
    title: "Name Badges",
    text: [
      when({ flags: ["split_pod"] }, "You carry your half of the pod back to your bench like a wounded bird. Jun carries his like a diplomat's briefcase. Neither of you says anything. A runner with a clipboard whispers that this was “lovely” and that you should “do it again for the cameras”."),
      when({ flags: ["grabbed_pod"] }, "You reach your bench panting, pod aloft. Somewhere behind you a man is sighing in the exact tone of someone updating his opinion of you. A runner with a clipboard says “Great energy!” and writes something down."),
      when({ flags: ["shared_secret"] }, "You carry your pod back to your bench with a sense of having done something either very clever or very stupid. Jun has already vanished into the pantry, where he is, you are almost sure, taking notes on a trick he cannot possibly have understood."),
      "The tent fills. There are eight of you, and the cameras are choosing favourites already. At the next bench is Marguerite, a retired headmistress in a cardigan the colour of custard, who has brought her own rolling pin and her own opinions. Two benches along, Dev, a plumber from Leeds, is stroking a jar of sourdough starter and murmuring to it.",
      "Everyone's name is stuck to their apron on a laminated badge. Yours, you notice, has been spelled correctly. It is the one thing today that will go to plan.",
    ],
    choices: [
      {
        k: "a",
        t: "Introduce yourself to Marguerite. She looks like she knows where the bodies are buried.",
        to: "S6_N01C",
        fx: { f: ["met_marguerite"] },
        echo: "“Marguerite,” she says. “Unless the tape is running, in which case it's Margie, and I'm adorable.”",
      },
      {
        k: "b",
        t: "Practise your to-camera line in the reflection of a mixing bowl.",
        to: "S6_N01C",
        fx: { d: { poise: 1 } },
        echo: "Your reflection, stretched into a shiny bulb, looks like a convict. You keep practising.",
      },
      {
        k: "c",
        t: "Steal a glance at Jun's station. Know your enemy.",
        to: "S6_N01C",
        fx: { f: ["clocked_jun"] },
        echo: "His tools are lined up in size order. Even his whisk looks like it has a pension.",
      },
    ],
  },
  {
    key: "S6_N01C",
    ch: 1,
    title: "Mise en Place",
    text: [
      "Ten minutes before filming, Bryce Halloran, executive producer, drifts down the aisle in a gilet and a cloud of expensive aftershave, collecting contestants one by one with the gentle, bright-eyed smile of a man who has never been refused.",
      when({ flags: ["met_marguerite"] }, "Marguerite mutters, out of the side of her mouth, “That man once made a woman cry over a Victoria sponge, and then kept the footage.”"),
      "BRYCE: Lovely, lovely. Listen. Between us, the audience loves a little tension. A feud. A tiff. A tiny, tasteful meltdown. Give me something to cut to and I'll make you a star.",
      "He says “star” the way other men say “scone”: as a thing that should be handed over without negotiation.",
      when({ flags: ["clocked_jun"] }, "Across the tent, Jun is polishing a spoon. He doesn't look like a man who has ever had a tiff. He looks like a man who writes apologetic letters to doorbells."),
      "The producer's smile does not shift by a millimetre. You have the odd, specific feeling that you have just been added to a spreadsheet.",
    ],
    choices: [
      {
        k: "a",
        t: "Tell him politely that you're here to bake, not to brawl.",
        to: "S6_N02",
        major: true,
        fx: { f: ["told_bryce_no"] },
        echo: "“Of course,” says Bryce, still smiling. “Of course.” You do not like how long he goes on smiling.",
      },
      {
        k: "b",
        t: "Play along. Offer him a little sparkle for the cameras.",
        to: "S6_N02",
        major: true,
        fx: { d: { creativity: 1 }, f: ["played_for_cameras"] },
        echo: "“That's the spirit!” he says, and writes “FEISTY” next to your name.",
      },
      {
        k: "c",
        t: "Nod vaguely and go and check your oven. Ovens never ask for drama.",
        to: "S6_N02",
        major: true,
        echo: "Bryce is already moving on to the next victim. You get the sense you've been postponed, not forgotten.",
      },
    ],
  },
];