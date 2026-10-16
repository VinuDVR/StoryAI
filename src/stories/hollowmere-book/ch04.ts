import { when } from "../dsl";
import type { NodeDef } from "../types";

export const ch04: NodeDef[] = [
  {
    key: "S4_N05",
    ch: 4,
    title: "The Portrait Gallery",
    text: [
      "Mrs. Wren has asked you to carry a basket of clean linen along the upstairs gallery to the press at its far end. She hasn't said why she can't do it herself. You suspect it isn't her knees.",
      "The gallery is lined with Ashcombes: stern men in stiff collars, pale wives with their hands folded over their wedding rings, and a dog with a melancholy face that has outlived three generations of owners and seems to blame every one of them. The windows are shuttered, so the lamps burn all day, and every painted eye follows the flame.",
      "One frame at the far end is draped with black velvet.",
      when({ flags: ["saw_ritual"] }, "You remember what Mrs. Wren laid out on the kitchen table, and the shape the salt made, and you take a careful half-step back."),
      "Every other frame on this wall wears a skin of grey dust. The velvet has none. Someone brushes it, recently and regularly, and does not want it to look neglected.",
      "Julian's footsteps approach along the corridor, slow and measured.",
    ],
    choices: [
      {
        k: "a",
        t: "Lift the velvet and look.",
        to: "S4_N05B",
        major: true,
        fx: { d: { nerve: 1 }, f: ["saw_portrait"] },
      },
      {
        k: "b",
        t: "Ask Julian who is under the cloth.",
        to: "S4_N05B",
        major: true,
        req: { gte: { "julian.trust": 1 } },
        lock: "Julian doesn't trust you enough to be asked yet.",
        fx: { d: { "julian.affection": 1 }, f: ["asked_portrait"] },
      },
      {
        k: "c",
        t: "Leave it alone and move on.",
        to: "S4_N05B",
        major: true,
      },
    ],
  },
  {
    key: "S4_N05B",
    ch: 4,
    title: "Under the Velvet",
    text: [
      when(
        { flags: ["saw_portrait"] },
        "The cloth slides away under your fingers with a sound like a long exhale. The girl in the portrait is perhaps eleven: dark curls escaping a ribbon, a mouth caught in the middle of a laugh she hasn't finished. Her eyes are painted looking a little to one side, as though someone just out of the frame has said something clever.",
        "A brass plate at the foot of the frame reads A. M. A., then a date of birth. Nothing after it. Not even a dash.",
      ),
      when(
        { flags: ["saw_portrait"], notFlags: ["asked_portrait"] },
        "Julian stops three paces off. He doesn't look angry. He looks like a man who has been waiting years for someone to do exactly this, and dreading it.",
        "JULIAN: You found her.",
      ),
      when(
        { flags: ["asked_portrait"] },
        "Julian looks at the draped frame for a long moment. When he answers, he does it with the flat care of a man stepping across ice.",
        "JULIAN: My sister. Adelaide. Mrs. Wren keeps her covered, and I keep letting her.",
      ),
      when(
        { notFlags: ["saw_portrait", "asked_portrait"] },
        "Julian reaches you and stops beside the draped frame, not looking at it, the way you don't look at a stranger's wound.",
        "JULIAN: Mrs. Wren sent you with the linen. She'll have wanted to see whether you'd look.",
      ),
      "For a while neither of you speaks. The lamps hiss. Along the wall the painted Ashcombes watch the pair of you with the weary interest of people who have seen this scene before.",
    ],
    choices: [
      {
        k: "a",
        t: "Ask him to tell you about her.",
        to: "S4_N05C",
        fx: { d: { "julian.trust": 1 } },
        echo: "“Not here,” he says. “But yes. Ask me again, somewhere with a piano.”",
      },
      {
        k: "b",
        t: "Say you're sorry, and leave the rest unasked.",
        to: "S4_N05C",
        fx: { d: { "julian.affection": 1 } },
        echo: "He lets out a breath he has clearly been holding for several years.",
      },
      {
        k: "c",
        t: "Ask why Mrs. Wren keeps her hidden.",
        to: "S4_N05C",
        fx: { d: { insight: 1, "julian.trust": -1 } },
        echo: "“You'd have to ask her,” Julian says, and it is not an invitation.",
      },
    ],
  },
  {
    key: "S4_N05C",
    ch: 4,
    title: "Mrs. Wren on the Stairs",
    text: [
      "You find Mrs. Wren at the foot of the back stairs, where the kitchen passage meets the hall, as though she has been standing there some time. She looks at the empty basket in your arms, then at your face, then, briefly, up at the ceiling, in the direction of the gallery.",
      when(
        { flags: ["saw_portrait"] },
        "MRS. WREN: The cloth was straight when I sent you, miss. I know it was straight.",
        "Her voice is quiet, not angry.",
        "MRS. WREN: I have straightened it every morning for nine years.",
      ),
      when(
        { notFlags: ["saw_portrait"] },
        "MRS. WREN: You didn't lift it.",
        "She doesn't ask. She says it like a fact she is writing in a book.",
        "MRS. WREN: That is well.",
      ),
      "She takes the basket from you. Her hands tremble very slightly, and she folds them around the wicker to hide it.",
      "MRS. WREN: There are things in this house that are not for the telling, miss. Not because they are shameful. Because telling is how they get out.",
    ],
    choices: [
      {
        k: "a",
        t: "Apologise, and promise to leave the cloth alone.",
        to: "S4_N06",
        fx: { d: { "wren.trust": 1 } },
      },
      {
        k: "b",
        t: "Ask what she means by “get out.”",
        to: "S4_N06",
        fx: { d: { insight: 1, "wren.trust": -1 } },
        echo: "Her face closes like a door in a draught.",
      },
      {
        k: "c",
        t: "Say nothing. Watch her hands, and let her see you watching.",
        to: "S4_N06",
        echo: "She tucks them into her apron. It is the first time you have seen her hide anything.",
      },
    ],
  },
];