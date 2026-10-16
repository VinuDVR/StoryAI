import { when } from "../dsl";
import type { NodeDef } from "../types";

export const ch07: NodeDef[] = [
  {
    key: "S4_N08",
    ch: 7,
    title: "The East Wing Door",
    text: [
      "November closes round Hollowmere like a fist. The library is catalogued to the last shelf but one, and you have stopped pretending the work is why you stay. You stay because the house has begun to feel like a sentence someone left unfinished, and you have never been able to bear a loose end.",
      "On the nail beside the kitchen dresser hangs a chandler's calendar from a Whitby shop, with a lighthouse printed over the months. Mrs. Wren crosses off each day in pencil, one neat stroke apiece, as she does everything. The last square struck through is the twenty-eighth. Two squares on from it, the thirtieth has been ringed in red ink, round and round, until the paper has worn thin as a petal. She has never mentioned it. You have never asked.",
      "At two in the morning, with the pipes knocking and the lullaby thin as thread inside the walls, you stand at the end of the east corridor, before the door you have been told, in three different tones, not to approach.",
      "The door to the east wing is sealed with iron hinges, three locks and a cross of rowan wood nailed at head height.",
      when({ flags: ["promised_julian"] }, "You promised Julian you would wake him if anything happened. You have decided this counts, and have not yet decided what you will do about it."),
      when({ flags: ["answered_house"] }, "The locks seem to loosen a little as you approach, like a mouth half-open."),
      when({ flags: ["spoke_her_name"] }, "At the sound of your footsteps the singing on the other side stops dead, as it did the night you said her name. Then, very slowly, it begins again, closer."),
      "Whatever is in there has been waiting for someone to try the handle.",
    ],
    choices: [
      {
        k: "a",
        t: "Try the small silver key.",
        to: "S4_N08B",
        req: { items: ["silver_key"] },
        lock: "You don't have a key that fits.",
        fx: { d: { insight: 1 }, f: ["used_key"] },
      },
      {
        k: "b",
        t: "Ask Julian to open it with you.",
        to: "S4_N08B",
        req: { gte: { "julian.trust": 3 } },
        lock: "Julian would never hold the key for someone he doesn't trust.",
        fx: { d: { "julian.affection": 1 }, f: ["julian_opened"] },
        echo: "You knock softly on his door. He is awake. He has, you suspect, been awake for nine years.",
      },
      {
        k: "c",
        t: "Break the rowan cross and force the lock.",
        to: "S4_N08B",
        req: { gte: { nerve: 2 } },
        lock: "You don't have the nerve to touch that cross.",
        fx: { d: { nerve: 1 }, f: ["broke_cross"] },
      },
      {
        k: "d",
        t: "Find another way: the servants' passage.",
        to: "S4_N08B",
        fx: { d: { nerve: 1, "wren.trust": -1 }, f: ["servants_route"] },
      },
    ],
  },
  {
    key: "S4_N08B",
    ch: 7,
    title: "Across the Threshold",
    text: [
      when(
        { flags: ["used_key"] },
        "The silver key goes into the middle lock as though it had been waiting nine years for the hand. It turns without a sound. The upper lock gives next, then the lower, one after another, like a sleeper letting out three long breaths.",
        "When you try to draw the key out again, it resists for a moment, the way a hand resists being let go.",
      ),
      when(
        { flags: ["julian_opened"] },
        "Julian comes with a lamp and his coat over his nightshirt, and does not ask why. From inside his collar he draws a key on a cord, worn smooth. He has worn it every day for nine years, he says, and has never once been able to use it.",
        "His scarred hand shakes so badly that you have to steady it. The locks turn one after another. At the third he makes a small sound, as though the key had put its fingers in his chest.",
      ),
      when(
        { flags: ["broke_cross"] },
        "The rowan is hot. It burns your palms as you take hold, and for a moment you think it will hold. Then the nails scream out of the oak one by one, the cross comes away in your hands, and the three locks give under your shoulder like old teeth.",
        "Both your palms are blistered. It will hurt for a week.",
      ),
      when(
        { flags: ["servants_route"] },
        "The servants' passage is a slot behind the wainscot in the kitchen corridor, no wider than your shoulders and smelling of mice and old smoke. Its steps are worn into dips by one pair of feet, going up and coming down for nine years. At the top a hinged panel lets you into the east corridor from behind, as quietly as a thought.",
        "Whoever made this way was never meant to be seen using it. Someone has used it every day.",
      ),
      "Beyond is the air of the night of the fire. Not smoke, nine years too late for smoke, but the memory of smoke, a taste at the back of the throat. It is colder than the corridor you have left, and quieter, like the inside of a held breath.",
    ],
    choices: [
      {
        k: "a",
        t: "Shut the way you came in behind you.",
        to: "S4_N08C",
        fx: { f: ["closed_door"] },
        echo: "The latch drops with a sound like a full stop.",
      },
      {
        k: "b",
        t: "Leave the way you came in open, as a path back.",
        to: "S4_N08C",
        fx: { f: ["door_open"] },
      },
      {
        k: "c",
        t: "Lay your fingers on the wall and feel what the fire did.",
        to: "S4_N08C",
        fx: { d: { insight: 1 } },
        echo: "The plaster is soft under your fingertips, like bread. It comes away black.",
      },
    ],
  },
  {
    key: "S4_N08C",
    ch: 7,
    title: "The Corridor of the Fire",
    text: [
      "The east corridor has been left exactly as the fire left it. The wallpaper hangs from the plaster in long black tongues. Three portraits line the wall, their glass blistered opaque, their faces gone, and the runner on the floor, which was red once, is the grey of ash in a hearth.",
      "Along the wall, at the height of a child's hand, small sooty prints lead away down the passage, again and again, as though a little girl once ran along it trailing her fingers and the house had kept every step.",
      when({ flags: ["closed_door"] }, "Behind you the latch settles like a full stop. It makes you feel more shut in than you expected."),
      when({ flags: ["door_open"] }, "Behind you the open door lets in a rectangle of the dimmer dark of the house. It is not much of a way back. You keep glancing at it anyway."),
      when(
        { flags: ["julian_opened"] },
        "Julian walks beside you with the lamp, close enough that his coat brushes your arm. At a door on the left, beside a row of tiny boots, he stops and cannot seem to start again.",
        "JULIAN: That was her day room. She kept her boots there. Mrs. Wren told me she'd put them away.",
        "He says it like a man learning that a promise has been broken for nine years.",
      ),
      "At the far end a door stands ajar, and from behind it the lullaby is singing itself over and over: four steps up, one slow fall.",
    ],
    choices: [
      {
        k: "a",
        t: "Follow the sooty handprints to the nursery.",
        to: "S4_N09",
        major: true,
        fx: { f: ["followed_prints"] },
      },
      {
        k: "b",
        t: "Open the day room door beside the little boots first.",
        to: "S4_N09",
        major: true,
        fx: { f: ["read_copybook"] },
        echo: "On a child's desk lies a copybook, open, in round careful handwriting: Mrs. Wren says if you hear your name at night you must never answer. I answered once. It was only Julian being funny. It wasn't Julian.",
      },
      {
        k: "c",
        t: "Turn back. You have seen enough to know this is wrong.",
        to: "S4_N09",
        major: true,
        fx: { d: { nerve: -1 }, f: ["tried_leave"] },
        echo: "You walk for what feels like a very long time. The nursery door is exactly as far away as it was.",
      },
    ],
  },
];