import { when } from "../dsl";
import type { NodeDef } from "../types";

export const ch08: NodeDef[] = [
  {
    key: "S4_N09",
    ch: 8,
    title: "The Nursery",
    text: [
      "The east wing is preserved exactly as it was the night of the fire: scorched wallpaper, a cracked dollhouse, a small bed where the sheets still hold the shape of a sleeper. The window is shuttered from the outside, and ash lies in drifts along the sills, undisturbed, as though the room had been told to wait.",
      when({ flags: ["followed_prints"] }, "The small prints end at the threshold. Inside, in the ash, a single pair of bare footprints stands facing the middle of the room, and does not leave."),
      when({ flags: ["tried_leave"] }, "The nursery door has opened after all. You have no memory of crossing the threshold, only of the passage running on and on, and then of the smell of old smoke, suddenly very near."),
      "A girl stands in the centre of the room with her back to you. She is singing.",
      when(
        { flags: ["julian_opened"] },
        "Beside you Julian has stopped breathing. He is staring at the empty middle of the room, and then at you, staring at it. He cannot see her. You can tell by the way his face keeps hunting.",
      ),
      "When she turns, her face is lovely and cracked like old porcelain, and her eyes are the eyes of someone who has been asking for help for nine years.",
      "ADELAIDE: You came. Nobody comes. Julian comes, but he cannot hear me any more.",
    ],
    choices: [
      {
        k: "a",
        t: "Speak to her gently. Tell her she isn't alone.",
        to: "S4_N09B",
        major: true,
        fx: { d: { nerve: 1 }, f: ["comforted_adelaide"] },
      },
      {
        k: "b",
        t: "Demand to know what the house wants.",
        to: "S4_N09B",
        fx: { d: { insight: 1 } },
      },
      {
        k: "c",
        t: "Flee back down the corridor.",
        to: "S4_N09B",
        fx: { d: { nerve: -1 }, f: ["fled_nursery"] },
      },
    ],
  },
  {
    key: "S4_N09B",
    ch: 8,
    title: "A Promise Asked",
    text: [
      when(
        { flags: ["comforted_adelaide"] },
        "Your voice comes out smaller than you meant. She listens as if to rain on a roof. When you finish she comes close and lays her hand over yours. It is cold, and light as a leaf, and does not quite touch.",
        "ADELAIDE: You said alone as if it were something you could stop.",
      ),
      when(
        { notFlags: ["comforted_adelaide", "fled_nursery"] },
        "You demand to know what the house wants. The words go out into the room and do not come back.",
        "ADELAIDE: The house wants nothing. Wanting is for things with a mouth. The house is hungry. It is not the same.",
        "She looks at you with the endless tiredness of someone who has explained this to a wall.",
      ),
      when(
        { flags: ["fled_nursery"] },
        "You get no further than the corridor. Her voice follows, not loudly, like a hand on your sleeve.",
        "ADELAIDE: Julian ran too. It's all right. Everybody runs the first time.",
        "You stand at the mouth of the passage with your back to her and your heart going like a trapped bird. You do not go back in. You do not go any further either.",
      ),
      when(
        { flags: ["julian_opened"] },
        "JULIAN: Who are you talking to?",
        "He asks it very quietly. He already knows. He wants you to be the one to say it.",
      ),
      "ADELAIDE: Will you carry something for me? Julian cannot hear me, and Mrs. Wren will not. There is a thing he needs to be told, and I will tell you when it is time. You will know it. Will you promise to carry it out of this house?",
      when({ flags: ["kept_notes"] }, "Her eyes go to the notebook in your pocket as though she could smell the ink.", "ADELAIDE: You wrote down my song. Nobody ever wrote it down."),
      "It is the strangest commission you have ever been offered. You have carried enough odd papers across county lines to know when a document matters.",
    ],
    choices: [
      {
        k: "a",
        t: "Promise to carry it to Julian.",
        to: "S4_N09C",
        fx: { d: { "julian.trust": 1 }, f: ["promised_adelaide"] },
        echo: "The cold in your hand eases, very slightly, like a fist unclenching.",
      },
      {
        k: "b",
        t: "Say you will if you can, and ask what it will cost you.",
        to: "S4_N09C",
        fx: { d: { insight: 1 } },
        echo: "She almost smiles. “Nobody has ever asked that, either.”",
      },
      {
        k: "c",
        t: "Tell her you can't promise anything in this house.",
        to: "S4_N09C",
        echo: "She nods as though she had expected it, and had not hoped otherwise.",
      },
    ],
  },
  {
    key: "S4_N09C",
    ch: 8,
    title: "Until the Pipes Knock",
    text: [
      "Time in the nursery runs differently. You have been here minutes or hours. The dollhouse has its front hinged open, and in each tiny room a tiny family is arranged around a tiny table, every one of them facing the door.",
      "Then, from inside the walls, the pipes begin: three slow raps, a pause, three more. The sound is nearer than it has ever been. Adelaide's head turns toward it with the flinch of a rabbit.",
      "ADELAIDE: It is the third watch. It comes when the house sleeps, and it comes for whoever is awake in the east wing. You must not be here.",
      "She says it the way a mother says it: go, now, don't argue.",
      when({ flags: ["promised_adelaide"] }, "She is already fading at the edges, as if keeping her shape cost her something. “Thank you,” she says, and it is the only warm thing you have felt in an hour."),
      when({ flags: ["julian_opened"] }, "Julian takes your elbow. His hand is shaking. “We should go,” he says, in the voice of a man stepping off a cliff out of politeness."),
    ],
    choices: [
      {
        k: "a",
        t: "Go to Julian's door and wake him.",
        to: "S4_N10",
        req: { notFlags: ["julian_opened"] },
        hide: true,
        fx: { d: { "julian.trust": 1 }, f: ["woke_julian"] },
        echo: "He opens the door before you can knock, fully dressed. He has not been to bed.",
      },
      {
        k: "b",
        t: "Slip back to your room through the servants' passage, unseen.",
        to: "S4_N10",
        fx: { f: ["slipped_back"] },
        echo: "The panel closes behind you with a click you feel in your teeth.",
      },
      {
        k: "c",
        t: "Stay. Sit on the nursery floor with her until the pipes stop.",
        to: "S4_N10",
        fx: { d: { "wren.trust": -1 }, f: ["stayed_nursery"] },
        echo: "The pipes knock until nearly dawn. Adelaide sings, very softly, and you do not move.",
      },
      {
        k: "d",
        t: "Walk out with Julian, his hand at your elbow, and say nothing yet.",
        to: "S4_N10",
        req: { flags: ["julian_opened"] },
        hide: true,
        fx: { d: { "julian.affection": 1 }, f: ["woke_julian"] },
      },
    ],
  },
];