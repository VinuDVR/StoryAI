import { when } from "../dsl";
import type { NodeDef } from "../types";

export const ch04: NodeDef[] = [
  {
    key: "S6_N04",
    ch: 4,
    title: "The Fire",
    text: [
      "The showstopper is the one challenge where you are officially allowed to lose your mind. Dame Dorothy's brief fits on a Post-it: “Something tall. Something that makes me forget I am over seventy.”",
      "You have three hours, a four-tier plan, and an oven that has been making a small, optimistic ticking noise since breakfast.",
      when({ flags: ["told_bryce_no"] }, "Bryce has drifted past your bench twice already, each time looking faintly let down that nothing has happened."),
      when({ flags: ["played_for_cameras"] }, "Bryce has drifted past your bench twice already to tell you that you are “going to be an absolute joy in the edit.”"),
      "Something under your oven goes whump.",
      "A tongue of yellow flame licks out of the door and up the front of your station. The cameras swing around with the joy of starving animals being fed.",
      "DOT: That is not a soufflé, dear. That is arson.",
      "Four cameras. Two hundred audience members. One fire.",
    ],
    choices: [
      {
        k: "a",
        t: "Smother it with icing sugar and pretend it was planned.",
        to: "S6_N04B",
        fx: { d: { creativity: 2 }, f: ["flambe_hero"] },
      },
      {
        k: "b",
        t: "Freeze. Jun arrives with a fire blanket like a knight in a slightly floury apron.",
        to: "S6_N04B",
        fx: { d: { "jun.affection": 1, "jun.trust": 1 }, f: ["jun_saved_you"] },
        echo: "\"You're welcome,\" he says, and then goes bright red as the audience whoops.",
      },
      {
        k: "c",
        t: "Turn it into a show: \"Crème brûlée à la Catastrophe!\"",
        to: "S6_N04B",
        gems: 15,
        fx: { d: { creativity: 2, poise: 2, "dot.respect": 2 }, f: ["crowd_favourite"] },
      },
    ],
  },
  {
    key: "S6_N04B",
    ch: 4,
    title: "Smoke Break",
    text: [
      when({ flags: ["flambe_hero"] }, "Icing sugar turns out to be a poor fire extinguisher and a magnificent special effect. The flames die in a cloud of sweet white smoke, and an audience that has waited all week for something to happen gives you a standing ovation. Dame Dorothy notes it on her clipboard without expression."),
      when({ flags: ["jun_saved_you"] }, "Jun's fire blanket drops over the station with the practised flop of a man who has read the safety manual twice. The fire dies in a sulk. He stands there holding one corner of it, apron smeared, ears vivid, while two hundred people cheer a man who would very much like to evaporate."),
      when({ flags: ["crowd_favourite"] }, "“Crème brûlée à la Catastrophe!” you cry, and the fire, either impressed or intimidated, burns obligingly while you caramelise sugar over it with a blowtorch commandeered from Dev. The audience roars. Somewhere behind the cameras a runner faints, or possibly just sits down."),
      "When the smoke clears, three of your four tiers are intact. The fourth is the colour of a very old saddle. The tent smells of burnt butter and adrenaline, and every camera is pointed at you with the tender attention of a vet.",
      "At the next bench, Marguerite has not moved. She has both hands flat on her own table and her eyes on your oven door.",
      when({ flags: ["met_marguerite"] }, "MARGUERITE: Ovens don't just go whump, dear. I have baked in the same Aga since 1974, and it has never once done that to me."),
      when({ notFlags: ["met_marguerite"] }, "A woman in a custard-coloured cardigan says, to nobody in particular, “Ovens don't just go whump.” It is the first thing she has said all day."),
      "Dev, whose own station is smoking in sympathy, is rescuing a tray of macarons with the grim tenderness of a man pulling a child from a river.",
    ],
    choices: [
      {
        k: "a",
        t: "Crouch by the oven and check the gas connection while everyone is watching the smoke.",
        to: "S6_N04C",
        fx: { f: ["checked_oven"] },
        echo: "The seal on the hose is warm and slightly twisted. It could be the heat. It could be a hand.",
      },
      {
        k: "b",
        t: "Laugh it off to camera: “Well, that's one way to proof a loaf.”",
        to: "S6_N04C",
        fx: { d: { poise: 1 } },
        echo: "The audience laughs. You laugh. Your knees do not.",
      },
      {
        k: "c",
        t: "Go and help Dev rescue his macarons.",
        to: "S6_N04C",
        fx: { f: ["helped_dev"] },
        echo: "Dev nods without looking up. “Cheers. I owe you a pint.”",
      },
    ],
  },
  {
    key: "S6_N04C",
    ch: 4,
    title: "Judging the Smoke",
    text: [
      "Judging is held in a tent that smells like a bonfire at a bakery. Dame Dorothy approaches your three and a half tiers with the expression of a woman who has seen a great deal of cake and a few acts of God.",
      when({ flags: ["flambe_hero"] }, "DOT: You put out a fire with a topping. I cannot decide whether to mark you for ingenuity or call the fire brigade."),
      when({ flags: ["crowd_favourite"] }, "DOT: I have judged this programme for twelve years and I have never been applauded by a fire. It was very distracting. I enjoyed it."),
      when({ flags: ["jun_saved_you"] }, "DOT: And you, young man, with the blanket. Heroism is not a flavour. But I noticed."),
      "She tastes the sponge. It is slightly smoky, which she describes, after a long pause, as “a feature”.",
      when({ flags: ["helped_dev"] }, "At the far end of the table, Dev's macarons have been placed in a position of honour. He is pretending not to look at you, and failing."),
      "In the gallery, behind the cameras, Bryce Halloran is clapping with the brightness of a man who has just won an auction.",
      when({ flags: ["played_for_cameras"] }, "He catches your eye and mouths, delighted, “Feisty.”"),
      when({ flags: ["told_bryce_no"] }, "He catches your eye and gives a small, tidy shrug, as if to say: it isn't me, it's the universe."),
    ],
    choices: [
      {
        k: "a",
        t: "Ask the floor manager who last serviced the ovens.",
        to: "S6_N05",
        fx: { f: ["asked_ovens"] },
        echo: "“Production handles all that,” he says, the way other people say “the weather”.",
      },
      {
        k: "b",
        t: "Find Jun afterwards and thank him properly.",
        to: "S6_N05",
        req: { flags: ["jun_saved_you"] },
        hide: true,
        fx: { d: { "jun.trust": 1 }, f: ["thanked_jun"] },
        echo: "“It was a very small blanket,” he says. “You were a very large fire.”",
      },
      {
        k: "c",
        t: "Say nothing. Eat a biscuit. Go to bed.",
        to: "S6_N05",
      },
    ],
  },
];