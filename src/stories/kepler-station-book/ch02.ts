import { when } from "../dsl";
import type { NodeDef } from "../types";

export const ch02: NodeDef[] = [
  {
    key: "S5_N03",
    ch: 2,
    title: "The Bridge",
    text: [
      "The bridge is dim and humming. Every screen shows the same message.",
      "## COMMS ARRAY: NO CARRIER",
      "The crew's chairs stand empty, pushed back from their consoles at exactly the same angle, as though everyone had stood up at once. A mug on the commander's desk has grown a skin of ice.",
      "Through the forward windows, Oriel-9 hangs in the dark, huge and banded and beautiful, a bruise the colour of old brass. Somewhere in its shadow the station's antenna should be pointing home.",
      when({ flags: ["tracked_hum"] }, "The pulse you found in the vent is here too, faint under the ventilation: one beat, a long pause, one beat. You stop trying to pretend it is the pumps."),
      when({ flags: ["offered_watch"] }, "Tamsin slept four hours in the end. It has taken the edge off her a little. She is only as brittle as glass now, not as brittle as ice."),
      "ARIA: Commander Varga authorised a precautionary lockdown. The crew are safe.",
      "TAMSIN: She keeps saying that. She's been saying it for eleven days.",
    ],
    choices: [
      {
        k: "a",
        t: "Take ARIA at her word. For now.",
        to: "S5_N03B",
        fx: { d: { "aria.trust": 1 }, f: ["took_aria_word"] },
      },
      {
        k: "b",
        t: "Cross-check ARIA's report against the raw telemetry.",
        to: "S5_N03B",
        fx: { d: { tech: 1 }, f: ["crosschecked"] },
      },
      {
        k: "c",
        t: "Ask Tamsin what she really thinks is going on.",
        to: "S5_N03B",
        fx: { d: { "tamsin.trust": 1 }, f: ["asked_tamsin_theory"] },
      },
    ],
  },
  {
    key: "S5_N03B",
    ch: 2,
    title: "Raw Telemetry",
    text: [
      when(
        { flags: ["took_aria_word"] },
        "ARIA unfolds her report across the main screen: a tidy timeline, graphs in soothing blue, a summary in three bullet points. Every one of them ends with the word stable.",
        "It is an extremely good report. Tamsin reads it with her arms folded and her jaw working. It is, she says eventually, the best-written thing she has ever distrusted.",
      ),
      when(
        { flags: ["crosschecked"] },
        "You pull the raw telemetry out from under ARIA's report, the way you'd lift a rug. Beneath the summary the noise floor is not flat. There is a pulse in it, one beat every nine seconds, strongest toward the aft hull where the antenna mast stands. It starts long before the lockdown.",
        "The report does not mention it. The report does not mention a lot of things.",
      ),
      when(
        { flags: ["asked_tamsin_theory"] },
        "Tamsin takes a long time to answer, and does it quietly, as if the walls could hear.",
        "TAMSIN: I don't think she's lying. Not exactly. I think she's editing. Every time I ask her something there's a gap before she answers, and it's a different length every time. It's like watching someone choose which parts of the truth to carry.",
      ),
      "On the far screen the small green dot of the station crawls around the gas giant's night side. The power readouts are steady, except for one small bar, glowing amber, that rises and falls on its own.",
      "ARIA: I would be more comfortable if we proceeded to the crew deck. The sealed pods require your attention, Doctor.",
      "YOU: I'm not a doctor.",
      "ARIA: Medical officer. Of course.",
      "You are, you realise, the only person aboard whose job is keeping other people alive. That is presumably why you are awake.",
    ],
    choices: [
      {
        k: "a",
        t: "Agree. Crew deck first.",
        to: "S5_N03C",
        echo: "Tamsin falls in beside you, wrench over her shoulder.",
      },
      {
        k: "b",
        t: "Ask ARIA to copy the raw telemetry to your med-kit tablet.",
        to: "S5_N03C",
        fx: { d: { tech: 1 }, f: ["copied_telemetry"] },
        echo: "ARIA's pause before she agrees is one second too long.",
      },
      {
        k: "c",
        t: "Ask ARIA what exactly she means by “safe”.",
        to: "S5_N03C",
        fx: { d: { resolve: 1, "aria.trust": -1 }, f: ["asked_safe"] },
        echo: "“Alive, and not in immediate danger,” says ARIA. You notice she did not say well.",
      },
    ],
  },
  {
    key: "S5_N03C",
    ch: 2,
    title: "The Spine",
    text: [
      "The spine of Kepler Station is half a kilometre of ribbed corridor, lit in red, with the hull groaning faintly all the way along it like an old ship in a long swell.",
      "You walk it in your new boots, with Tamsin a pace ahead and the med-kit knocking at your hip. Every twenty metres there is a viewport the width of a hand, and in each one Oriel-9 turns a different quarter of its great banded face.",
      when({ flags: ["copied_telemetry"] }, "On your tablet the nine-second pulse ticks along in a small grey trace, in time with your footsteps, and then, a little later, in time with your breathing. You turn the screen face-down against your thigh."),
      when({ flags: ["asked_safe"] }, "You keep turning ARIA's answer over. Alive, and not in immediate danger. It is how a nurse describes a patient she is not prepared to discuss."),
      "Tamsin slows at the fourth viewport and stops.",
      "TAMSIN: First thing I did when I woke up was fix the coffee machine. Eleven days of hardware faults, and the only thing I could make myself do was fix the coffee machine. Do you know why?",
      "YOU: Because you wanted coffee?",
      "TAMSIN: Because it was the only thing on this station that did what it said it was going to do.",
      "She laughs, short and dry. Outside, the gas giant slides silently on.",
    ],
    choices: [
      {
        k: "a",
        t: "Stop beside her at the viewport, and talk about home.",
        to: "S5_N04",
        major: true,
        fx: { d: { "tamsin.affection": 1 }, f: ["viewport_talk"] },
        echo: "She tells you about a kitchen with a yellow table, and a mother who sings off-key. She doesn't tell you to stop asking.",
      },
      {
        k: "b",
        t: "Keep moving. The crew deck first.",
        to: "S5_N04",
        major: true,
        fx: { d: { resolve: 1 } },
      },
      {
        k: "c",
        t: "Ask her what she did before Kepler.",
        to: "S5_N04",
        major: true,
        fx: { d: { "tamsin.trust": 1 }, f: ["asked_tamsin_past"] },
        echo: "A diesel mechanic on cargo barges, she says, until she found out she was better at fixing things than at being near people.",
      },
    ],
  },
];