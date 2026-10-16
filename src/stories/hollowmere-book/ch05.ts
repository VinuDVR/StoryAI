import { when } from "../dsl";
import type { NodeDef } from "../types";

export const ch05: NodeDef[] = [
  {
    key: "S4_N06",
    ch: 5,
    title: "Julian's Piano",
    text: [
      "You come down because you heard the piano, and because for once you did not want to be alone with the ceiling.",
      "Julian plays in the drawing room with the lights out, because the moon on the keys is enough. It is the first room in Hollowmere you have been asked into. The furniture wears dust sheets like a congregation of patient ghosts; only the piano is uncovered, a black Broadwood with a cracked lid and keys the colour of old teeth.",
      "He has a way of playing as though each note might be the last thing he is allowed to say.",
      when({ flags: ["saw_portrait"] }, "You have seen the girl in the portrait now: dark curls, a laugh caught mid-breath. The song he is playing is the one from your walls."),
      "JULIAN: I used to play it for her. She'd fall asleep on the rug.",
      when({ anyFlags: ["saw_portrait", "asked_portrait"] }, "He doesn't say who. He doesn't need to."),
      when({ notFlags: ["saw_portrait", "asked_portrait"] }, "He doesn't say who. You don't ask. Not yet."),
    ],
    choices: [
      {
        k: "a",
        t: "Sit beside him on the piano bench.",
        to: "S4_N06B",
        fx: { d: { "julian.affection": 2 } },
        echo: "His hand hesitates on the keys. Then he plays a little softer, for you.",
      },
      {
        k: "b",
        t: "Ask him, gently, about the fire.",
        to: "S4_N06B",
        fx: { d: { "julian.trust": 1, insight: 1 }, f: ["asked_about_fire"] },
      },
      {
        k: "c",
        t: "Leave him in peace and listen from the doorway.",
        to: "S4_N06B",
        fx: { d: { "julian.trust": 1 } },
      },
    ],
  },
  {
    key: "S4_N06B",
    ch: 5,
    title: "What the Keys Remember",
    text: [
      when(
        { notFlags: ["saw_portrait", "asked_portrait"] },
        "JULIAN: My sister. Adelaide.",
        "He says the name as if carrying it across a room full of glass.",
        "JULIAN: She was eleven.",
      ),
      when(
        { anyFlags: ["saw_portrait", "asked_portrait"] },
        "JULIAN: She was eleven.",
        "He says it to the keys.",
        "JULIAN: She'd have been twenty this March. I try not to do the sum. I do it anyway, every morning.",
      ),
      when(
        { flags: ["asked_about_fire"] },
        "His hands stop. The last note hangs in the dark and dies.",
        "JULIAN: They told me it was a lamp, left lit in the nursery. They told me I carried her out. I woke on the lawn with my hand burnt to the bone and her ribbon in it, and I don't remember carrying anyone.",
        "JULIAN: They told me she was still inside. They wouldn't let me see.",
      ),
      "The piano's lid is cracked from corner to corner. He has stopped noticing it, the way you stop noticing the sound of your own pulse.",
      "Outside, the wind has risen. Somewhere in the walls the pipes begin their knocking, three and three, and Julian's hands move on the keys as though to cover the sound.",
    ],
    choices: [
      {
        k: "a",
        t: "Take his scarred hand in both of yours.",
        to: "S4_N06C",
        fx: { d: { "julian.affection": 1 }, f: ["held_hand"] },
        echo: "His fingers are cold and absolutely still. After a while neither of you pretends it is about the scar.",
      },
      {
        k: "b",
        t: "Ask whether he has ever heard her singing.",
        to: "S4_N06C",
        fx: { d: { insight: 1 } },
        echo: "“I used to,” he says. “For the first year. Then I stopped being able to.”",
      },
      {
        k: "c",
        t: "Say nothing, and let the next hour be music.",
        to: "S4_N06C",
        fx: { d: { "julian.trust": 1 } },
      },
    ],
  },
  {
    key: "S4_N06C",
    ch: 5,
    title: "Past Midnight",
    text: [
      "It is past one when he lifts his hands from the keys. Neither of you has moved in an hour. The candle on the stand has burned down to a stub and gone out unnoticed.",
      "He walks you to the foot of the stairs, a little behind you, as he always does, as if you were something he was seeing safely across a road.",
      "JULIAN: Would you do something for me?",
      "JULIAN: If you hear anything in the night, anything at all, would you come and wake me? I know what Mrs. Wren says. I know what the rules are.",
      "He glances once at the dark of the hall.",
      "JULIAN: I've been alone with it for a very long time.",
    ],
    choices: [
      {
        k: "a",
        t: "Promise that you will.",
        to: "S4_N07",
        major: true,
        fx: { d: { "julian.trust": 1 }, f: ["promised_julian"] },
        echo: "“Thank you,” he says. He sounds as though nobody has ever said yes to him before.",
      },
      {
        k: "b",
        t: "Tell him you'll keep to Mrs. Wren's rules, thank you. You'd rather not know.",
        to: "S4_N07",
        major: true,
        fx: { d: { nerve: -1, "wren.trust": 1 } },
        echo: "He nods as though he had expected it, and that is somehow the worst part.",
      },
      {
        k: "c",
        t: "Say you'll try, and mean it only as far as you can.",
        to: "S4_N07",
        major: true,
        echo: "He accepts that gravely, like an honest answer, which it is.",
      },
    ],
  },
];