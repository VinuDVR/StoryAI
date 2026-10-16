import { when } from "../dsl";
import type { NodeDef } from "../types";

export const ch06: NodeDef[] = [
  {
    key: "S4_N07",
    ch: 6,
    title: "The Name Called",
    text: [
      "The days after that run together like wet ink: the library, the tray at the door, the locks at nine, the knocking in the pipes, and sometime after two the lullaby, a little nearer each night, or so you tell yourself so you can stop telling yourself anything else.",
      when(
        { flags: ["promised_julian"] },
        "You have not had to wake Julian. You have lain awake each night with his request like a stone on your chest, listening for the thing that would make you cross the corridor. Nothing has come. You have begun, shamefully, to hope nothing will.",
      ),
      "Three nights later, at the bottom of a dream, somebody says your name.",
      "It is not a whisper. It is a voice exactly like your own mother's, from the landing outside your door, patient, loving, a little disappointed. There is a warmth under the door, the width of a finger, as though someone were standing very close with a candle.",
      "It says it again. And again.",
      when({ flags: ["asked_about_fire"] }, "You think about Julian's scar, and the word he did not say."),
      "Mrs. Wren's third rule turns over and over in your head.",
    ],
    choices: [
      {
        k: "a",
        t: "Answer it.",
        to: "S4_N07B",
        major: true,
        fx: { d: { nerve: 1, insight: 1 }, f: ["answered_house"] },
        echo: "Something on the landing is pleased. You feel it like warmth through a keyhole.",
      },
      {
        k: "b",
        t: "Stay silent until dawn.",
        to: "S4_N07B",
        major: true,
        fx: { d: { nerve: 2 }, f: ["stayed_silent"] },
      },
      {
        k: "c",
        t: "Answer with Adelaide's name instead.",
        to: "S4_N07B",
        gems: 15,
        major: true,
        fx: { d: { insight: 1, nerve: 1 }, f: ["spoke_her_name"] },
      },
    ],
  },
  {
    key: "S4_N07B",
    ch: 6,
    title: "The Landing",
    text: [
      when(
        { flags: ["answered_house"] },
        "The voice stops. In the quiet after, the boards creak once outside your door, under a weight that is not quite a person's. The warmth under the door deepens. Then, very gently, as though someone were being careful of a sleeping child, the handle turns a quarter-turn, stops, and turns back.",
      ),
      when(
        { flags: ["stayed_silent"] },
        "You keep your mouth shut and your eyes open. The voice tries again, a little sadder each time, and then a different voice, a man's, one you almost recognise, and then Julian's. It is very good at Julian. It is almost good enough. It tells you it is frightened. It asks you to open the door.",
        "You hold the blanket in both fists and say nothing, and at last, long after the clock on the landing strikes four, it stops.",
      ),
      when(
        { flags: ["spoke_her_name"] },
        "You say Adelaide. The voice stops as though cut with scissors. A very long moment passes. Then something laughs, softly, in a voice that is nobody's, and from further off, from behind the wall at your shoulder, the lullaby begins. It is not the house's voice at all. It is a girl's, and it is frightened.",
      ),
      "Nothing else happens. That is the worst of it. When the window greys, the landing is only a landing.",
    ],
    choices: [
      {
        k: "a",
        t: "Open the door and look at the landing.",
        to: "S4_N07C",
        fx: { f: ["looked_landing"] },
        echo: "There is nothing on the boards but a fine line of salt, laid across your threshold in a neat, careful hand. You didn't put it there.",
      },
      {
        k: "b",
        t: "Stay in bed until the house is awake.",
        to: "S4_N07C",
      },
      {
        k: "c",
        t: "Write down exactly what you heard, word for word, while it is fresh.",
        to: "S4_N07C",
        fx: { d: { insight: 1 } },
        echo: "The page looks back at you. It reads like a letter from a stranger who knows you very well.",
      },
    ],
  },
  {
    key: "S4_N07C",
    ch: 6,
    title: "Breakfast Without Appetite",
    text: [
      "Mrs. Wren is at the range when you come down, her back to you, and she does not turn.",
      when(
        { flags: ["answered_house"] },
        "MRS. WREN: You answered.",
        "She doesn't ask. She says it to the kettle. Then she turns and puts before you a plate piled like a farmhand's: eggs, bacon, fried bread, a heap of salted potatoes. She is feeding you the way people feed the condemned.",
        "MRS. WREN: Eat everything, miss.",
      ),
      when(
        { notFlags: ["answered_house"] },
        "MRS. WREN: You slept badly.",
        "MRS. WREN: Most do.",
        "She sets down porridge, and beside the bowl a small linen pouch of coarse grey salt, tied with a thread of rowan.",
        "MRS. WREN: For your pocket. It will do no harm.",
      ),
      when({ flags: ["looked_landing"] }, "Her eyes go to your slippers. Crystals of salt are still caught in the weave of the hem, where you stepped through the line across your threshold. She says nothing. Her mouth tightens."),
      when({ flags: ["promised_julian"] }, "Julian is not at the table. His chair is pushed in. You did not wake him. You tell yourself it was kindness."),
      "Outside, the moor is the colour of a bruise. Somewhere above you the pipes knock, three and three, and Mrs. Wren does not look at the ceiling.",
    ],
    choices: [
      {
        k: "a",
        t: "Tell Mrs. Wren everything the voice said.",
        to: "S4_N08",
        fx: { d: { "wren.trust": 1 } },
        echo: "She listens without a flicker. At the end she says only: “It never has the whole of you, miss. That's why it asks.”",
      },
      {
        k: "b",
        t: "Ask her, plainly, what the circle of salt on the kitchen table is for.",
        to: "S4_N08",
        fx: { d: { insight: 1, "wren.trust": -1 } },
        echo: "“Eat your breakfast, miss.” It is the coldest thing she has ever said to you.",
      },
      {
        k: "c",
        t: "Eat, thank her, and say nothing at all.",
        to: "S4_N08",
      },
    ],
  },
];