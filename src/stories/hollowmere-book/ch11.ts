import { when } from "../dsl";
import type { NodeDef } from "../types";

export const ch11: NodeDef[] = [
  {
    key: "S4_N12",
    ch: 11,
    title: "The Hollow Wakes",
    text: [
      "The house does not scream. It exhales.",
      "Every door in Hollowmere opens at once, and the sound runs through the building like a shot along a gun barrel: front door, kitchen door, cellar, nursery, the whole long cold alphabet of them. The shutters fly back and the night comes in, black and smelling of wet heather. The flames on the candles stand straight up, trembling, as though they were afraid.",
      "The portraits turn their faces to the wall. You do not see it. You hear it, forty frames swinging on their hooks with a sound like many people turning away.",
      when({ flags: ["wren_wavers"] }, "Mrs. Wren has stopped guarding the circle. She stands with her hands over her mouth, weeping."),
      when({ flags: ["broke_circle"] }, "The salt lies scattered across the carpet like spilled stars. The house is angrier for it. It is also, for the first time in nine years, uncertain."),
      when({ flags: ["adelaide_heard"] }, "For the space of a single breath every person in the room can hear her. Adelaide stands in the doorway, plain as any of the living. Julian says her name, and it is the first time in nine years that his voice has said it to something that answered."),
      "Something in the walls is reaching for the third place at the table.",
    ],
    choices: [
      {
        k: "a",
        t: "Look at the dark above the door, where the sound is coming from.",
        to: "S4_N12B",
        fx: { f: ["saw_hollow"] },
        echo: "There is no face. There is a place where a face would be, if the dark had one.",
      },
      {
        k: "b",
        t: "Look at Julian.",
        to: "S4_N12B",
        echo: "He is looking at you. Neither of you has to say what for.",
      },
      {
        k: "c",
        t: "Look at Mrs. Wren.",
        to: "S4_N12B",
        echo: "She is the only person in the room who is not surprised.",
      },
    ],
  },
  {
    key: "S4_N12B",
    ch: 11,
    title: "A Hundred Voices",
    text: [
      "The lullaby comes from every room at once, and then it breaks into a chord, a hundred voices that are all, somehow, your own: the you of six years old, the you of last Tuesday, the you of the taxi at the gate. They sing in harmony. They sing as though they loved you.",
      when({ flags: ["saw_hollow"] }, "You looked at it, and that was the mistake or the gift. Now it has a direction, and the direction is you. The dark in the doorway thickens into the shape of someone leaning down, as a parent leans over a bed. It has no face, but it has patience, and a very good memory, and it has spent a month practising your mother's voice."),
      when({ notFlags: ["saw_hollow"] }, "You keep your eyes on the table, and you can still feel it, the way you feel a draught: a pressure on the back of the neck, patient as a hand."),
      when({ flags: ["played_tune"] }, "Julian's scarred hand is moving on the tablecloth, finding the lullaby's four steps against the linen. It steadies him. It steadies you to see it."),
      when({ flags: ["wrote_letter"] }, "You think, absurdly, of the letter in the library. Someone will find it. It seems a very small thing to hold on to, and you hold on to it."),
      when(
        { flags: ["promised_adelaide"] },
        "Adelaide is at your elbow, close as a person sharing a pew. She is shaking.",
        "ADELAIDE: This is the time. It has to be now, while it is looking at you. Tell him I remember the rug. Tell him I never minded.",
      ),
      when(
        { notFlags: ["promised_adelaide"] },
        "Adelaide is at your elbow, close as a person sharing a pew. She is shaking.",
        "ADELAIDE: You never promised me anything. It doesn't matter. Please. Tell him I remember the rug. Tell him I never minded.",
      ),
    ],
    choices: [
      {
        k: "a",
        t: "Turn and say it to Julian over the noise: she remembers the rug, she never minded.",
        to: "S4_N12C",
        fx: { f: ["gave_message"] },
        echo: "He cannot hear her. He can hear you. For nine years that has been the whole problem.",
      },
      {
        k: "b",
        t: "Hold it back. It would break him, here, with that thing listening.",
        to: "S4_N12C",
        fx: { f: ["held_message"] },
        echo: "You will say it later, if there is a later.",
      },
      {
        k: "c",
        t: "Ask Adelaide what the Hollow wants from you tonight.",
        to: "S4_N12C",
        fx: { d: { insight: 1 } },
        echo: "She tells you in a whisper: a name, said aloud, in its own house, in your own voice. That is all it has ever needed.",
      },
    ],
  },
  {
    key: "S4_N12C",
    ch: 11,
    title: "Reach",
    text: [
      "The shape in the doorway has stopped being a shape and become a direction. Everything in the room leans toward the third place, toward the circle, toward you: the candle flames, the tablecloth, the shadows of the chairs.",
      "Reaching is the wrong word for it, and the only one you have. The Hollow has no hands. It has the hunger of a hand, the way a cold has the shape of a window. It crosses the floorboards, and the boards keep a record of it, a long low groan like a ship's keel on rock.",
      when({ flags: ["gave_message"] }, "Julian's face has broken open. He is looking at the empty air beside you and saying his sister's name, again and again, like a man trying a lock."),
      when({ flags: ["held_message"] }, "Julian is white to the lips. He can feel something he cannot name, and he is looking at you as if you could name it."),
      "This is the last moment in which you can choose how you meet it.",
    ],
    choices: [
      {
        k: "a",
        t: "Stand your ground and sing Adelaide's lullaby.",
        to: "S4_N13",
        major: true,
        req: { flags: ["heard_singing"] },
        lock: "You've never heard the song properly.",
        fx: { d: { insight: 1, nerve: 1 }, f: ["sang_song"] },
      },
      {
        k: "b",
        t: "Seize Julian's hand and run for the stairs.",
        to: "S4_N13",
        major: true,
        req: { gte: { "julian.affection": 3 } },
        lock: "Julian doesn't feel close enough to you to follow.",
        fx: { d: { "julian.affection": 1 }, f: ["ran_stairs"] },
      },
      {
        k: "c",
        t: "Brace yourself and wait it out.",
        to: "S4_N13",
        major: true,
        fx: { d: { nerve: 1 }, f: ["braced"] },
      },
    ],
  },
];