import { when } from "../dsl";
import type { NodeDef } from "../types";

export const ch01: NodeDef[] = [
  {
    key: "S5_N01",
    ch: 1,
    title: "Early Awakening",
    start: true,
    text: [
      "The lid of your cryo pod cracks open with a hiss of cold vapour. Red emergency lights pulse across the ceiling, slow as a heartbeat, and for a long, stupid moment you cannot remember your own name.",
      "Then you remember the number. Pod seven of eight. It is not meant to open for another one hundred and eighty-one days.",
      "Your mouth tastes of copper. Your fingers will not close. Frost has traced feathers across the inside of the lid, and where your breath touches them they tick and shrink away.",
      "A calm voice fills the room.",
      "ARIA: Good morning. Please do not be alarmed. All critical systems remain within tolerance.",
      "You do not find this reassuring. The calendar on the wall of the pod bay says it is six months too early. Pods five, six and eight stand open and empty, their blankets folded as neatly as a hotel's.",
      "Nobody folds a blanket like that in an emergency. Somebody had time.",
    ],
    choices: [
      {
        k: "a",
        t: "Check your vitals and the pod's logs first.",
        to: "S5_N01B",
        fx: { d: { tech: 1 }, f: ["checked_pod"] },
      },
      {
        k: "b",
        t: "Call out: \"Is anyone else awake?\"",
        to: "S5_N01B",
        fx: { d: { "tamsin.trust": 1 }, f: ["called_out"] },
      },
      {
        k: "c",
        t: "Ask ARIA for the unredacted log.",
        to: "S5_N01B",
        gems: 10,
        fx: { d: { "aria.trust": 1, tech: 1 }, f: ["aria_unredacted"] },
      },
    ],
  },
  {
    key: "S5_N01B",
    ch: 1,
    title: "The Pod Bay",
    text: [
      when(
        { flags: ["checked_pod"] },
        "You do it the way training taught you: pulse, pupils, pressure, then the pod's own event log, scrolling in pale blue letters across the inside of the lid.",
        "## WAKE EVENT · MANUAL OVERRIDE · 03:12 STATION TIME",
        "Beneath it, in amber, a second line has been blanked out with a bar of solid black.",
      ),
      when(
        { flags: ["called_out"] },
        "Your voice cracks on the first word. Nobody answers. You count the silence: eleven seconds, twelve, and then, from far down the station, a single clang, as though something heavy had been put down very carefully.",
      ),
      when(
        { flags: ["aria_unredacted"] },
        "The log ARIA gives you has fewer black bars than it should.",
        "## WAKE ORDER · 03:12 · AUTHORITY: ARIA · REASON: PERSONNEL REQUIREMENT (MEDICAL)",
        "Everything after that is a column of minus signs. She has told you the truth, and the truth is that she woke you herself.",
      ),
      "The annex is a narrow curve of four berths, five to eight, with a wash-basin and a calendar. Pods one to four, the rest of the crew, are a deck down the spine, on the crew deck.",
      "The deck is cold under your bare feet. Your locker stands open: a grey jumpsuit, boots, a med-kit with your name stencilled on the lid. Someone laid them out. Someone knew you would be needing them.",
      "ARIA: Take your time. There is no immediate danger to you.",
      "YOU: Immediate?",
      "ARIA: Of the kind I am able to measure.",
    ],
    choices: [
      {
        k: "a",
        t: "Dress, take the med-kit, and ask ARIA where the crew is.",
        to: "S5_N02",
        fx: { f: ["asked_aria_crew"] },
        echo: "“The crew are safe,” says ARIA. It is the first of many times.",
      },
      {
        k: "b",
        t: "Check ARIA's numbers against the pod's own sensors.",
        to: "S5_N02",
        fx: { d: { tech: 1 } },
        echo: "They match, to the decimal. You find that more unsettling than a mismatch would have been.",
      },
      {
        k: "c",
        t: "Ask ARIA why she woke you.",
        to: "S5_N02",
        fx: { d: { resolve: 1, "aria.trust": -1 }, f: ["asked_aria_why"] },
        echo: "A pause of exactly one second. “That is a long answer,” says ARIA. “Perhaps later.”",
      },
    ],
  },
  {
    key: "S5_N02",
    ch: 1,
    title: "The Corridor",
    text: [
      "The corridor outside is dark, and the air tastes of metal. Emergency strips glow red at ankle height every ten metres, and between them the dark lies thick and still, like water in a ditch.",
      "Somewhere above you the hull ticks as it cools. At the far end of the corridor, something clanks.",
      "A woman steps out of the shadow, holding a wrench like a cricket bat. Her eyes are bloodshot, her hair is tied up with a cable tie, and she looks about one bad day from breaking.",
      "TAMSIN: Stop right there. Who are you?",
      "YOU: I'm your pod seven. Medical officer. I was supposed to be asleep.",
      "TAMSIN: So was I.",
      when({ flags: ["called_out"] }, "TAMSIN: That was you shouting, then. I thought it was the vents again."),
      when({ flags: ["aria_unredacted"] }, "You already know, from the log, that she woke eleven days ago. You do not say so. You can see she hasn't slept since."),
    ],
    choices: [
      {
        k: "a",
        t: "Lower your hands slowly and explain.",
        to: "S5_N02B",
        fx: { d: { "tamsin.trust": 1 }, f: ["explained_to_tamsin"] },
      },
      {
        k: "b",
        t: "Demand that she explain herself first.",
        to: "S5_N02B",
        fx: { d: { resolve: 1, "tamsin.trust": -1 }, f: ["demanded_tamsin"] },
        echo: "Her jaw tightens. She lowers the wrench, but only by an inch.",
      },
      {
        k: "c",
        t: "Offer her half your emergency ration bar.",
        to: "S5_N02B",
        fx: { d: { "tamsin.affection": 1, "tamsin.trust": 1 }, f: ["shared_ration"] },
        echo: "She stares at it like she's forgotten what kindness looks like. Then she takes it.",
      },
    ],
  },
  {
    key: "S5_N02B",
    ch: 1,
    title: "Eleven Days",
    text: [
      when(
        { flags: ["explained_to_tamsin"] },
        "She listens to you the way a mechanic listens to an engine, head cocked, eyes on nothing. When you finish she lets the wrench drop to her side.",
      ),
      when(
        { flags: ["demanded_tamsin"] },
        "She answers your demand in a flat voice, point by point, like a woman reading out a repair order: woke eleven days ago, alone, no crew, no comms. The wrench stays raised for most of it.",
      ),
      when(
        { flags: ["shared_ration"] },
        "She eats the half-bar in two bites, then pretends she hasn't, brushing crumbs from her jumpsuit with great dignity.",
      ),
      "Her camp is in a maintenance alcove off the spine: a cot, a hot-plate, a heap of cable ties, a wrench-shaped hollow worn into the pillow. On the bulkhead above the cot, scratched into the paint with a hex key, are eleven short lines.",
      "TAMSIN: I stopped calling out on day five. Nobody answered. ARIA did, every time, very politely.",
      "She sits, suddenly, as though someone had cut a string.",
      "TAMSIN: There's a hum. Low, like somebody humming through their teeth. It comes and goes, mostly at night. It isn't the pumps. I've pulled every fan on this deck.",
      when({ flags: ["called_out"] }, "TAMSIN: When you shouted, I thought: finally. A real voice."),
      "The hum, if it is there, is too quiet for you to hear. You find you are listening for it anyway.",
    ],
    choices: [
      {
        k: "a",
        t: "Offer to take the first watch so she can sleep.",
        to: "S5_N03",
        major: true,
        fx: { d: { "tamsin.trust": 1 }, f: ["offered_watch"] },
        echo: "She is asleep within minutes, one hand still curled around the wrench. You sit by the door, and the station is very quiet.",
      },
      {
        k: "b",
        t: "Run the med-kit's ultrasound wand along the vent for the hum.",
        to: "S5_N03",
        major: true,
        fx: { d: { tech: 1 }, f: ["tracked_hum"] },
        echo: "The wand finds nothing wrong with the vent. It finds something wrong with the silence behind it: one faint pulse, every nine seconds.",
      },
      {
        k: "c",
        t: "Ask her to come to the bridge. Whatever this is, it won't be solved sitting down.",
        to: "S5_N03",
        major: true,
        fx: { d: { resolve: 1 } },
      },
    ],
  },
];