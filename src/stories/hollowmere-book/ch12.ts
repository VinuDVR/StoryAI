import { when } from "../dsl";
import type { NodeDef } from "../types";

export const ch12: NodeDef[] = [
  {
    key: "S4_N13",
    ch: 12,
    title: "Before Dawn",
    text: [
      when({ flags: ["sang_song"] }, "You sang. You don't remember deciding to. The notes came up out of you like water from a well you did not know was there, four steps up and one slow fall, and the hundred voices faltered and tried to follow and could not. They had learned your voice. They had never learned hers."),
      when({ flags: ["ran_stairs"] }, "You ran, Julian's hand wrenching at yours, up the great divided staircase with the whole house at your back. You did not look behind you. You can still feel what it was like not to."),
      when({ flags: ["braced"] }, "You braced, and the Hollow came on like a tide up a beach and stopped at the edge of what you were. You do not know why. You do not think it was courage. You think it was the last thing there was left to try."),
      "Somewhere a clock strikes five. The house draws in its breath and holds it.",
      "It is nearly dawn. The dining room is wrecked, the chairs flung over, the candles guttered to blue stubs. Every door in Hollowmere still stands open onto passages as quiet as a church. The Hollow has withdrawn, the way the sea withdraws before something larger. It is not gone. It has gone to wait.",
      "There is perhaps an hour before the sun and the Hollow's patience meet. Everyone who is left in the house will want something from you in it.",
    ],
    choices: [
      {
        k: "a",
        t: "Go to Mrs. Wren.",
        to: "S4_N13B",
        fx: { f: ["last_word_wren"] },
      },
      {
        k: "b",
        t: "Go to Julian.",
        to: "S4_N13B",
        fx: { f: ["last_word_julian"] },
      },
      {
        k: "c",
        t: "Go straight to the nursery door.",
        to: "S4_N13B",
        fx: { f: ["last_word_adelaide"] },
      },
    ],
  },
  {
    key: "S4_N13B",
    ch: 12,
    title: "The Last Words",
    text: [
      when(
        { flags: ["last_word_wren"] },
        "Mrs. Wren is sitting on the floor of the wrecked dining room with her back against the sideboard, her cap in her lap and her white hair coming down. She looks smaller than you have ever seen her, and older, and oddly light. She has the look of a woman who has put down something heavy and is waiting to find out whether she can still stand.",
        "MRS. WREN: I have kept this house nine years, miss. I do not know how to leave it. I do not know that I would be let.",
      ),
      when({ flags: ["last_word_wren", "wren_wavers"] }, "MRS. WREN: You asked me to listen. Nobody has asked me that since the night of the fire."),
      when(
        { flags: ["last_word_julian"] },
        "Julian is sitting on the third step of the great staircase, like a man waiting to be told that the house is his again. He has turned his scarred hand palm-up on his knee and is looking at it as though it belonged to someone else.",
      ),
      when({ flags: ["last_word_julian", "gave_message"] }, "JULIAN: She remembers the rug. She never minded. Did she say it like that? Was it exactly like that?"),
      when({ flags: ["last_word_julian", "held_message"] }, "You have not told him. The message sits in you like a stone you swallowed, and he can see that it does."),
      when(
        { flags: ["last_word_adelaide"] },
        "The nursery door stands open. She is waiting in the centre of the room in the grey light, small and exact, her dark hair loose. Whatever the house is, it has not touched her. She is holding herself together by sheer stubbornness.",
        "ADELAIDE: It will try again at dusk. It has been practising. I am sorry. I only know what I know.",
      ),
      "The light in the cracks of the shutters is turning from black to iron to pewter.",
    ],
    choices: [
      {
        k: "a",
        t: "Tell them what you think you will do, even though you don't know.",
        to: "S4_N13C",
        echo: "Saying it aloud does not make it easier. It makes it real.",
      },
      {
        k: "b",
        t: "Ask them what they would do in your place.",
        to: "S4_N13C",
        echo: "Nobody answers that. It is a question for whoever has to ask it.",
      },
    ],
  },
  {
    key: "S4_N13C",
    ch: 12,
    title: "The Last Door",
    text: [
      "It is nearly dawn. The house has gone very still, as if weighing you.",
      "You have the front gates at your back and the nursery door in front of you. You have the library's whole catalogue of ghosts, and one pale girl holding out her hand.",
      when({ flags: ["wrote_letter"] }, "Somewhere behind you the letter waits in the library for whoever comes next. You find you very much hope nobody has to read it."),
      when({ flags: ["promised_adelaide"] }, "You promised to carry her message out of this house. You are about to learn what it costs to keep a promise."),
      "Whatever you choose now, Hollowmere will remember it.",
    ],
    choices: [
      {
        k: "a",
        t: "Break the bargain and free Adelaide.",
        to: "S4_END_01",
        major: true,
        req: { anyFlags: ["comforted_adelaide", "spoke_her_name", "sang_song"], gte: { insight: 4 } },
        lock: "You don't yet understand the bargain well enough, or Adelaide doesn't trust you.",
      },
      {
        k: "b",
        t: "Take Adelaide's place as Hollowmere's keeper.",
        to: "S4_END_02",
        major: true,
        req: { gte: { nerve: 6 } },
        lock: "You'd need far more nerve to stay.",
      },
      {
        k: "c",
        t: "Take Julian's hand and walk out together.",
        to: "S4_END_03",
        major: true,
        req: { gte: { "julian.affection": 4, "julian.trust": 3 } },
        lock: "Julian doesn't love or trust you enough to leave with you.",
      },
      {
        k: "d",
        t: "Run for the gates alone.",
        to: "S4_END_04",
        major: true,
      },
      {
        k: "e",
        t: "Let Mrs. Wren finish what she began.",
        to: "S4_END_05",
        major: true,
      },
    ],
  },
];