import { when } from "../dsl";
import type { NodeDef } from "../types";

export const ch01: NodeDef[] = [
  {
    key: "S4_N01",
    ch: 1,
    title: "The Drive to Hollowmere",
    start: true,
    text: [
      "The taxi leaves you at the gates and will not go a yard further. The driver doesn't explain. He takes his fare without counting it, crosses himself, and reverses into the rain.",
      "For an hour the road across the moor has been nothing but wet black heather and the wipers' tired complaint. You spent most of it rereading the letter: the engagement of one archivist to catalogue the library of the late Sir Reginald Ashcombe, at a salary three times what the county archive pays, the post to be taken up on the evening of the thirtieth of October, “and not a day later, as the library has waited long enough.”",
      "You had thought that was just an old-fashioned way of putting it.",
      "Hollowmere Manor rises out of the fog like a tooth: grey stone, black windows, an east wing with every shutter nailed closed. Nothing about it looks lived in. Nothing about it looks empty, either.",
      "A man waits on the steps with a lantern. He is tall and tired-looking, with a scar crossing the back of his left hand, and he holds the light a little too low, like someone used to people flinching from it.",
      "JULIAN: You must be the archivist. I'm Julian. I'm sorry about the weather. And the house.",
      "Behind him a woman in a grey dress stands as still as a doorframe. Her keys do not so much as chime.",
      "MRS. WREN: Dinner is at seven. We lock the doors at nine. You will not need to go into the east wing.",
      "She says it kindly. It is the kindness of someone who has said it before.",
    ],
    choices: [
      {
        k: "a",
        t: "Thank Julian warmly for the welcome.",
        to: "S4_N01B",
        fx: { d: { "julian.trust": 1, "julian.affection": 1 } },
      },
      {
        k: "b",
        t: "Ask why the east wing's windows are nailed shut.",
        to: "S4_N01B",
        fx: { d: { insight: 1, "julian.trust": -1 } },
        echo: "Mrs. Wren's stare could curdle milk. Julian looks at his shoes.",
      },
      {
        k: "c",
        t: "Notice the pale figure in the upstairs window, and lift a hand to her.",
        to: "S4_N01B",
        gems: 10,
        fx: { d: { insight: 1, nerve: 1 }, f: ["saw_lady"] },
      },
    ],
  },
  {
    key: "S4_N01B",
    ch: 1,
    title: "The Great Hall",
    text: [
      "The front doors close behind you with a sound like a held breath. The hall is vast and cold: a stone floor worn into shallow dishes by two centuries of feet, a staircase that climbs, divides and doubles back on itself, and above the dead hearth the mounted head of a stag with one glass eye missing.",
      "Julian takes your case before you can protest. Mrs. Wren takes your coat, your hat and, somehow, your umbrella, and stands holding all three like a woman awaiting a verdict.",
      when({ flags: ["saw_lady"] }, "Your eyes go to the upper landing, to the window where you saw her. The glass is black now. The curtain is still moving."),
      "Somewhere inside the walls, pipes knock: three slow raps, a pause, then three more. It sounds, absurdly, like someone asking to be let in.",
      "JULIAN: Pipes. Don't mind them. The house talks to itself when it's cold, and it's always cold.",
      "He says it lightly. He does not look at the wall while he says it.",
      "JULIAN: Your room is on the second floor, in the south corridor. The library is through there, past the stag. Dinner is in the kitchen, I'm afraid. We don't use the dining room any more.",
    ],
    choices: [
      {
        k: "a",
        t: "Ask Julian how long he has lived here.",
        to: "S4_N01C",
        fx: { d: { "julian.trust": 1 } },
        echo: "“Longer than I meant to,” he says. Then, quieter: “Nobody's asked me that.”",
      },
      {
        k: "b",
        t: "Tell Mrs. Wren you'll see to your own fire and your own bed. You'd rather be no trouble.",
        to: "S4_N01C",
        fx: { d: { "wren.trust": 1 } },
        echo: "Something in Mrs. Wren's shoulders loosens by perhaps a quarter of an inch. “Very sensible, miss.”",
      },
      {
        k: "c",
        t: "Say nothing. Study the stairs: the dust on them has been scuffed into a path that leads, not up, but east.",
        to: "S4_N01C",
        fx: { d: { insight: 1 } },
      },
    ],
  },
  {
    key: "S4_N01C",
    ch: 1,
    title: "The South Corridor",
    text: [
      "Dinner, in the kitchen, is mutton and boiled potatoes and a silence in which Mrs. Wren's carving knife is the only voice. Afterward Julian walks you up to the second floor himself, and says goodnight at the head of the stairs as if it were a border he wasn't permitted to cross.",
      "The south corridor is long and cold and lined with closed doors, a dozen of them, each with a rust-brown keyhole. Your room is at the far end. A fire has been laid and lit, the sheets are warm from a pan of coals, and on the sill, in a saucer, someone has left a small heap of coarse grey salt.",
      "Beyond the glass the moor is a black sea. Across the courtyard, at the far end of the house, the east wing's nailed shutters are slats of night against night. And behind them, for a moment, something moves: a light, small and low, like a candle carried by someone not very tall.",
      when({ flags: ["saw_lady"] }, "> You know whose light it is. You don't know how you know."),
      "The clock on the landing strikes nine. Far below, one after another, the locks go: front door, side door, kitchen door, cellar. Each one sounds like a decision being made on your behalf.",
    ],
    choices: [
      {
        k: "a",
        t: "Watch the east wing from the window until the light goes out.",
        to: "S4_N02",
        major: true,
        fx: { d: { nerve: 1 }, f: ["watched_east"] },
        echo: "It goes out a little after midnight. You are almost sure it was never a candle.",
      },
      {
        k: "b",
        t: "Tip the salt out of the window. It's a strange thing to leave in a guest's room.",
        to: "S4_N02",
        major: true,
        fx: { d: { nerve: 1 }, f: ["tipped_salt"] },
        echo: "The salt scatters on the wind like a handful of small, offended stars.",
      },
      {
        k: "c",
        t: "Bank the fire and go to bed. Whatever it is can wait until morning.",
        to: "S4_N02",
        major: true,
        echo: "You sleep. If anything in Hollowmere sings that first night, it sings to itself.",
      },
    ],
  },
];