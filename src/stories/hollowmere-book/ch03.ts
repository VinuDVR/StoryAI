import { when } from "../dsl";
import type { NodeDef } from "../types";

export const ch03: NodeDef[] = [
  {
    key: "S4_N03",
    ch: 3,
    title: "The Singing",
    text: [
      "At ten past two, something wakes you.",
      "It isn't a noise at first. It's a change in the quality of the dark, the way a room feels when someone has just stopped speaking in it.",
      "Then you hear it: a woman's voice, thin and sweet, singing a lullaby. It drifts along the corridor from the east wing, through the wall at your shoulder, and into the room as if the plaster were only paper. There are no words you can make out. There is only the tune, patient and rocking, climbing the same four steps and falling back.",
      when({ flags: ["saw_lady"] }, "You recognise the voice. It is the figure from the window."),
      "Somewhere far below, the piano answers it, one careful note at a time, never quite catching up.",
      "The house is not asleep. The house is listening to this, and so are you.",
    ],
    choices: [
      {
        k: "a",
        t: "Follow the singing to the east wing door.",
        to: "S4_N03B",
        fx: { d: { nerve: 1 }, f: ["heard_singing"] },
      },
      {
        k: "b",
        t: "Go downstairs to the piano.",
        to: "S4_N03B",
        fx: { d: { "julian.trust": 1, "julian.affection": 1 }, f: ["joined_julian"] },
        echo: "He doesn't stop playing when you come in. He just shifts along the bench.",
      },
      {
        k: "c",
        t: "Pull the covers over your head and wait for morning.",
        to: "S4_N03B",
        fx: { d: { nerve: -1 }, f: ["hid_from_song"] },
      },
    ],
  },
  {
    key: "S4_N03B",
    ch: 3,
    title: "Grey Light",
    text: [
      when(
        { flags: ["heard_singing"] },
        "The east wing door is black oak bound in iron, with a cross of rowan nailed a hand's breadth above your eyes. You lay your palm against it and the wood is warm. Not warm like a living thing; warm like a stove that has just been banked.",
        "The singing is on the other side, close enough to count its breaths. It does not stop when you whisper hello. It does not answer, either. Only, when you finally step back, the last note hangs in the keyhole a moment, as though deciding whether to follow you.",
      ),
      when(
        { flags: ["joined_julian"] },
        "Julian plays the lullaby's four steps over and over, shifting a little each time, like a man trying to find the version that will make it stop. Near three o'clock the singing does stop. The piano goes on a full minute without it. When he finally lifts his hands, the silence is almost unbearable.",
        "JULIAN: Thank you.",
        "He says it to the keys, not to you.",
      ),
      when(
        { flags: ["hid_from_song"] },
        "You keep the blankets over your head and count the singing's rise and fall like a tide. Near three it stops. You don't dare come out. At some point you realise, with the particular shame of the frightened, that you are holding the corner of the pillow in your teeth.",
      ),
      "By the time grey light finds the shutters you have told yourself several different stories about what you heard. None of them survives the daylight.",
      "When you open your door there is a tray on the floor: tea, toast, a boiled egg in a knitted cosy shaped like a hen. Beside it, folded small, is a note in a neat upright hand.",
      "> Kitchen, when you are ready. Mrs. W.",
      when({ flags: ["found_scrap"] }, "You hold the note beside your memory of the charred scrap behind Shelf Nine. The hand is the same: upright, careful, every stroke of the pen an apology."),
    ],
    choices: [
      {
        k: "a",
        t: "Copy the tune into your catalogue notebook, as near as you can remember it.",
        to: "S4_N04",
        fx: { d: { insight: 1 }, f: ["kept_notes"] },
        echo: "Four steps up, one slow fall. Written down, it looks like nothing. It looks like a staircase.",
      },
      {
        k: "b",
        t: "Eat the egg, wash the cup and go down for breakfast as though nothing has happened.",
        to: "S4_N04",
        fx: { d: { nerve: 1 } },
        echo: "It is the bravest thing you've done all week, and nobody sees it.",
      },
      {
        k: "c",
        t: "Knock at Julian's door. He should hear this from you.",
        to: "S4_N04",
        req: { notFlags: ["joined_julian"] },
        hide: true,
        fx: { d: { "julian.trust": 1 } },
        echo: "He answers on the second knock, grey-faced, still in yesterday's shirt. He hasn't slept either. Neither of you says so.",
      },
    ],
  },
  {
    key: "S4_N04",
    ch: 3,
    title: "Mrs. Wren's Rules",
    text: [
      "In the morning Mrs. Wren serves you tea in the kitchen. She does not sit. Her eyes never leave the window.",
      "The kitchen is the only warm room in Hollowmere, and the only one that looks used: copper pans scoured to a shine, a scrubbed deal table, a dresser of blue-and-white plates, and over the range a row of herbs hung upside down to dry. There is a sprig of rowan among them.",
      when({ flags: ["tipped_salt"] }, "On the sill beside the sink stands a saucer of coarse grey salt, freshly filled, the twin of the one you scattered from your window. Mrs. Wren sees you notice it. Neither of you says a word. It is the loudest silence you have ever been served with your tea."),
      when({ flags: ["noted_gap"] }, "She makes no mention of the word you pencilled beside Shelf Nine. That, you suspect, means she has read it."),
      "MRS. WREN: There are three rules, miss. You do not go into the east wing. You do not go into the cellar. And if you hear your name called in the night, you do not answer.",
      "She says it like a woman reading a recipe she has used for decades.",
      when({ flags: ["heard_singing"] }, "She glances at the mud on your slippers and says nothing, which is somehow worse."),
    ],
    choices: [
      {
        k: "a",
        t: "Promise to follow the rules.",
        to: "S4_N04B",
        major: true,
        fx: { d: { "wren.trust": 1 } },
      },
      {
        k: "b",
        t: "Press her on what happens if you break them.",
        to: "S4_N04B",
        major: true,
        fx: { d: { insight: 1, "wren.trust": -1 } },
      },
      {
        k: "c",
        t: "Offer to help her with the evening rites.",
        to: "S4_N04B",
        major: true,
        gems: 15,
        fx: { d: { insight: 2, "wren.trust": 1 }, f: ["saw_ritual"] },
      },
    ],
  },
  {
    key: "S4_N04B",
    ch: 3,
    title: "Nine O'Clock",
    text: [
      "The day goes the way days at Hollowmere go: the library, the tea tray, the long grey light moving across the papered windows like a patient hand. Julian does not come. The pipes knock three times, pause, knock three times, and you have stopped pretending not to count.",
      "At nine the clock on the landing strikes, and the locks begin.",
      when(
        { flags: ["saw_ritual"] },
        "You were told to hold the lantern and say nothing, so you hold it, and say nothing. Mrs. Wren lays the kitchen table the way another woman might lay out a body: a cloth of undyed linen, a bowl of coarse salt, three grey tallow candles, a sprig of rowan. She draws a circle of salt on the scrubbed boards, small and neat, and sets the third candle in its centre, and does not light it.",
        "Then she speaks for a long while in a low murmur you cannot follow, in no language you know, though the cadence of it, rocking, climbing, falling back, is one you have heard before.",
      ),
      when(
        { notFlags: ["saw_ritual"] },
        "You are not invited into the kitchen. You stand at the head of the back stairs and listen to the bolts go home, front, side, kitchen, cellar, and under them, behind the closed kitchen door, a woman's voice, low and steady, going on far longer than any grace.",
      ),
      "When the last bolt shoots, the whole house seems to settle, like an animal that has been fed.",
    ],
    choices: [
      {
        k: "a",
        t: "Wait at your door until the last bolt has gone, then count to a hundred.",
        to: "S4_N05",
        echo: "Nothing happens at a hundred. Nothing happens at two hundred. You find that worse than anything happening.",
      },
      {
        k: "b",
        t: "Go to bed early. There's a library to finish.",
        to: "S4_N05",
        echo: "You sleep badly, and wake with the lullaby's four steps in your head.",
      },
      {
        k: "c",
        t: "Try the small silver key against your own door.",
        to: "S4_N05",
        req: { items: ["silver_key"] },
        lock: "You haven't found a key to try.",
        fx: { d: { insight: 1 } },
        echo: "It doesn't fit. It doesn't fit any door in the south corridor. It is too long, too old, made for a keyhole cut a century before locks learned to be small.",
      },
    ],
  },
];