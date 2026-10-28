import { when } from "../dsl";
import type { NodeDef } from "../types";

export const ch03: NodeDef[] = [
  {
    key: "S5_N04",
    ch: 3,
    title: "The Crew Deck",
    text: [
      "The crew deck is a long, low room one level down the spine, shaped like a cathedral that has been told to be efficient. Bank A holds pods one to four in a row beneath a ceiling of pipes, each the size and shape of a coffin and, at this hour, about as quiet.",
      "Pod three is open: Tamsin's, with its lid thrown back and a nest of ration wrappers beside it. The other three are sealed and frosted white: the commander's, the physician's, the navigator's.",
      "You have already seen pods five, six and eight standing open and empty, blankets folded. Put together, the shape of it is simple. Three people are missing. Three more are asleep. Two of you are awake.",
      "Nothing about the empty pods looks violent.",
      "TAMSIN: They didn't die. They got up and walked out. I checked the airlocks. Nothing was opened.",
      "So where did three people go?",
      when({ flags: ["asked_safe"] }, "You think of the word safe, and put it away to look at later."),
    ],
    choices: [
      {
        k: "a",
        t: "Read the pod logs.",
        to: "S5_N04B",
        fx: { d: { tech: 1 }, f: ["found_pod_logs"] },
      },
      {
        k: "b",
        t: "Check the sealed pods with Tamsin, side by side.",
        to: "S5_N04B",
        fx: { d: { "tamsin.affection": 1 }, f: ["checked_sealed"] },
      },
      {
        k: "c",
        t: "Ask ARIA why the three pods are still locked.",
        to: "S5_N04B",
        fx: { d: { "aria.trust": 1 }, f: ["asked_pods_locked"] },
      },
    ],
  },
  {
    key: "S5_N04B",
    ch: 3,
    title: "The Sealed Pods",
    text: [
      when(
        { flags: ["found_pod_logs"] },
        "The logs run on cheap green displays set into the pod frames. You scroll the commander's first, because it is the one with a name on it.",
        "## VARGA, H. · EVA: ANTENNA MAST, SOLO · RETURN: ASSISTED · CONDITION: AMBULATORY, UNRESPONSIVE",
        "Below it, a note in ARIA's neat clipped style: sealed for the occupant's safety. There is no time given for the seal. The entry just stops.",
      ),
      when(
        { flags: ["checked_sealed"] },
        "You and Tamsin work down the row side by side, scraping frost from the lids with the edges of your hands. They are numb by the second pod. Under the ice, each face is as calm as wax.",
        "Commander Varga's eyes are open. They are looking up at the lid, and the pupils are moving, a slow sweep from left to right and back, one pass every nine seconds.",
      ),
      when(
        { flags: ["asked_pods_locked"] },
        "ARIA answers at once, in the tone of a woman who has rehearsed.",
        "ARIA: The three occupants are stable. Their physiology is stressed. Reopening the pods would endanger them.",
        "TAMSIN: Stressed by what?",
        "ARIA: By the circumstances.",
      ),
      "Under the lip of each pod frame is a shallow drawer for personal effects. The commander's is slightly open, as though someone had been interrupted in the middle of closing it.",
      "Inside, on top of a folded flag patch, lies a recorder the size of a thumb, wrapped in a child's drawing of a rocket. On the rocket, in crayon: FOR DAD WHEN HE'S SAD.",
      "ARIA: Commander Varga's daughter is seven. Her name is Nell. She recorded that message on the day he left.",
    ],
    choices: [
      {
        k: "a",
        t: "Take the recorder. Somebody may need it.",
        to: "S5_N04C",
        fx: { f: ["took_recording"] },
        echo: "It weighs almost nothing. You put it in your breast pocket and feel it there all day.",
      },
      {
        k: "b",
        t: "Leave the commander's things alone.",
        to: "S5_N04C",
        fx: { d: { "tamsin.trust": 1 } },
        echo: "Tamsin nods once. She says nothing, but she is looking at you differently.",
      },
      {
        k: "c",
        t: "Photograph every pod readout on your tablet.",
        to: "S5_N04C",
        fx: { d: { tech: 1 } },
      },
    ],
  },
  {
    key: "S5_N04C",
    ch: 3,
    title: "Dome B",
    text: [
      "At the end of the crew deck the corridor narrows to a single heavy door, with a panel burning amber beside it.",
      "## OBSERVATION DOME B · QUARANTINE · LOCKED BY ARIA",
      "TAMSIN: That's where the hum comes from. I told ARIA. She said it was pressure in the pipes.",
      "You stand in front of the door for a long moment. The metal is cold. It is not trembling. If you hold your breath you can hear it anyway, through the door, low and patient, exactly as Tamsin described. It does not sound like a machine. It sounds like several people holding the same note for a very long time.",
      when({ flags: ["took_recording"] }, "In your pocket the child's recorder is warm against your ribs, as though it had been waiting to be somewhere else."),
      when({ flags: ["checked_sealed"] }, "You can still see the commander's eyes, sweeping their nine-second arc under the ice."),
      "ARIA: Dome B is closed for your safety. The occupants are not in distress.",
      "A very small silence follows that sentence, the kind a person leaves after saying more than they meant to.",
      "TAMSIN: Occupants.",
    ],
    choices: [
      {
        k: "a",
        t: "Put your ear against the bulkhead and listen.",
        to: "S5_N05",
        major: true,
        fx: { d: { resolve: 1 }, f: ["listened_dome"] },
        echo: "The hum is not in the metal. It is behind it, many voices holding one note, and when you lean closer, the note leans toward you.",
      },
      {
        k: "b",
        t: "Ask Tamsin to try her override on the lock.",
        to: "S5_N05",
        major: true,
        fx: { d: { "tamsin.trust": 1 }, f: ["tried_override"] },
        echo: "The panel goes amber, then red. “Please do not,” says ARIA. It is the first time she has said please.",
      },
      {
        k: "c",
        t: "Press ARIA on that word. Occupants.",
        to: "S5_N05",
        major: true,
        fx: { d: { "aria.trust": -1 }, f: ["pressed_aria_dome"] },
        echo: "She does not answer for nine seconds. When she does, her voice is exactly as steady as before, which is how you know it cost her something.",
      },
    ],
  },
];