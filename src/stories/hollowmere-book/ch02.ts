import { when } from "../dsl";
import type { NodeDef } from "../types";

export const ch02: NodeDef[] = [
  {
    key: "S4_N02",
    ch: 2,
    title: "The Collector's Library",
    text: [
      "The library is magnificent and in ruins: twelve thousand volumes, every one mildewed, every one beautifully bound. Dust hangs in the lamplight like slow smoke, and the tall windows that must once have looked out over the moor have been papered over from the inside with yellowed sheets of newspaper.",
      when({ flags: ["saw_lady"] }, "You find yourself glancing up at the ceiling, toward the room where you saw her."),
      "On your second morning you begin properly. Sir Reginald Ashcombe collected the way some men drink: steadily, without joy, and with great thoroughness. He left ledgers, catalogues, and a half-burnt inventory that stops mid-sentence, in a hand that grows shakier toward the scorched edge.",
      "Mrs. Wren has sent up tea and oatcakes by way of a tray left outside the door, and has not been seen since. Julian looked in once, hovered on the threshold as though the room were a cold bath, and went away again.",
      "Around noon you lift a fallen book from the floor, a treatise on tidal charts, its spine split down the middle. As you do, a small object slides from between its pages and rings on the floorboards.",
    ],
    choices: [
      {
        k: "a",
        t: "Read the collector's ledger closely.",
        to: "S4_N02B",
        fx: { d: { insight: 1 }, f: ["found_ledger"] },
      },
      {
        k: "b",
        t: "Keep cataloguing. Be a professional.",
        to: "S4_N02B",
        fx: { d: { "julian.trust": 1 } },
        echo: "Julian lingers at the door that afternoon. He looks oddly touched by the tidy stacks.",
      },
      {
        k: "c",
        t: "Pick up the small silver key.",
        to: "S4_N02B",
        fx: { f: ["silver_key"], i: ["silver_key"] },
      },
    ],
  },
  {
    key: "S4_N02B",
    ch: 2,
    title: "The Missing Shelf",
    text: [
      "By the third day you have a system, and the system has found a hole.",
      "The household records of Hollowmere should fill the whole of Shelf Nine: leather daybooks, one for every year since 1801, kept in Sir Reginald's own tidy hand. The shelf is bare. The dust along its edge is thin and fresh, as though the books had been lifted out with great care, and not very long ago.",
      when({ flags: ["found_ledger"] }, "You turn back to the collector's ledger. It lists the daybooks one by one, each with a small tick beside it, except for the last nine, where the ticks have been scratched out so hard that the nib tore the paper."),
      when({ items: ["silver_key"] }, "In your pocket the small silver key presses against your hip like a question."),
      "Someone wanted these gone. Someone who knew exactly which books to take, and exactly how little dust to disturb.",
    ],
    choices: [
      {
        k: "a",
        t: "Ask Mrs. Wren, plainly, where the daybooks have gone.",
        to: "S4_N02C",
        major: true,
        fx: { d: { insight: 1, "wren.trust": -1 } },
        echo: "“Lost, miss,” says Mrs. Wren. “Lots of things were.” She does not ask which books you mean.",
      },
      {
        k: "b",
        t: "Say nothing. Pencil the gap into your catalogue as “wanting” and keep your own counsel.",
        to: "S4_N02C",
        major: true,
        fx: { d: { "wren.trust": 1 }, f: ["noted_gap"] },
        echo: "It is the most polite way you know of calling a house a liar.",
      },
      {
        k: "c",
        t: "Search the shelf and the floor behind it for anything the thief missed.",
        to: "S4_N02C",
        major: true,
        fx: { f: ["found_scrap"] },
        echo: "Wedged where the wood meets the wall is a curl of charred paper no bigger than your thumbnail. One line survives, in a careful, upright hand: forgive me, I could not do otherwise.",
      },
    ],
  },
  {
    key: "S4_N02C",
    ch: 2,
    title: "Tea at the Threshold",
    text: [
      "At dusk the papered windows turn the colour of weak tea. You have lit a second lamp and are fighting the mildew on volume four hundred and six when the door opens, without a knock.",
      "Julian stands on the threshold with a tray, as if the library floor were a line he had promised not to cross. Behind him the corridor is dark. He has brought tea, and two cups, because he is too polite to bring one.",
      when({ flags: ["noted_gap"] }, "His eyes go to your catalogue, to the single pencilled word beside Shelf Nine, and then away again, quickly, as if the word might be catching."),
      "Last night, long after the locks, you heard a piano somewhere below you, one careful note after another, and told yourself you were dreaming.",
      "JULIAN: Mrs. Wren says you've been at it since dawn. She says it the way other people say arson.",
      "JULIAN: I thought you might stop long enough to be rude to a cup of tea.",
      "He is trying to smile. It is a little like watching someone learn a language they used to speak.",
    ],
    choices: [
      {
        k: "a",
        t: "Tell him about yourself: the rented room, the county archive, the fact that nobody is waiting for you at home.",
        to: "S4_N03",
        fx: { d: { "julian.affection": 1 } },
        echo: "He listens the way people do when they've forgotten what it is to be told things.",
      },
      {
        k: "b",
        t: "Ask him about the piano you heard last night.",
        to: "S4_N03",
        fx: { d: { "julian.trust": 1 } },
        echo: "“I didn't think it carried,” he says. “I'll play softer.” “Don't,” you say, and are surprised by it.",
      },
      {
        k: "c",
        t: "Thank him, take the tea, and say you really must finish the shelf.",
        to: "S4_N03",
        echo: "He nods, relieved and a little disappointed, and leaves the door open behind him.",
      },
    ],
  },
];