import { when } from "../dsl";
import type { NodeDef } from "../types";

export const ch06: NodeDef[] = [
  {
    key: "S5_N07",
    ch: 6,
    title: "Night Cycle",
    text: [
      "The galley is the only warm room on the station. Tamsin sits across from you with a mug of something that pretends to be tea.",
      "In the corner stands the coffee machine she repaired on her first day, like a trophy. Somebody has taped a note to it in block capitals: DO NOT TOUCH. TAMSIN.",
      "TAMSIN: Eleven days. I kept thinking I was hearing people. In the vents, in the walls. I kept the wrench by my bed.",
      when({ flags: ["heard_signal"] }, "You can still hear the signal if you close your eyes. She notices you doing it, and looks at you for a long time."),
      when({ flags: ["muted_receivers"] }, "The station is unnaturally quiet. It feels as though it's holding its breath."),
      "TAMSIN: I'm glad it was you who woke up.",
    ],
    choices: [
      {
        k: "a",
        t: "Take her hand across the table.",
        to: "S5_N07B",
        fx: { d: { "tamsin.affection": 2, "tamsin.trust": 1 }, f: ["held_tamsin_hand"] },
        echo: "Her fingers curl around yours as if they'd been waiting to.",
      },
      {
        k: "b",
        t: "Admit that you're afraid too.",
        to: "S5_N07B",
        fx: { d: { "tamsin.trust": 2 }, f: ["admitted_fear"] },
      },
      {
        k: "c",
        t: "Keep it professional. Plan the next step.",
        to: "S5_N07B",
        fx: { d: { resolve: 1 }, f: ["stayed_professional"] },
      },
    ],
  },
  {
    key: "S5_N07B",
    ch: 6,
    title: "The Sixth Night",
    text: [
      when({ flags: ["held_tamsin_hand"] }, "She does not pull her hand away. She looks at it, at yours around it, as if it were a repair she had not planned, and then she talks."),
      when({ flags: ["admitted_fear"] }, "TAMSIN: Thank God. I thought it was only me. Everyone on the barges says there's nothing to be afraid of in a place with no one in it. They're liars."),
      when({ flags: ["stayed_professional"] }, "She straightens too, matching you: a checklist, a plan. It lasts four sentences, and then it cracks, and what comes out is not a plan."),
      "TAMSIN: On the sixth night I woke up standing in front of Dome B. I don't remember walking there. My palm was flat on the door, and it was warm, and the humming was coming through it into my arm. I stood there for nine hours.",
      "TAMSIN: ARIA told me afterwards. She watched the whole time. She never said a word.",
      "She says it flatly, like a fault report. She is looking at the mug.",
      "TAMSIN: That's why I keep the wrench by the bed. It isn't for people. It's so I've got something to hold on to when I wake up on my feet.",
      when({ flags: ["listened_dome"] }, "You remember the note leaning toward you through the bulkhead. You do not tell her how close you came to staying there."),
      when({ flags: ["asked_tamsin_past"] }, "You think of the diesel mechanic who stopped being near people. It has not stopped hurting her, you suspect, to ask for help."),
    ],
    choices: [
      {
        k: "a",
        t: "Tell her about the pulse you found in the telemetry.",
        to: "S5_N07C",
        req: { anyFlags: ["copied_telemetry", "tracked_hum"] },
        hide: true,
        fx: { d: { "tamsin.trust": 1 }, f: ["shared_pulse_theory"] },
        echo: "“Nine seconds,” she says slowly. “I counted nine hours.”",
      },
      {
        k: "b",
        t: "Stay quiet. Let her finish.",
        to: "S5_N07C",
        echo: "She does, and then looks faintly surprised that she is still sitting upright.",
      },
      {
        k: "c",
        t: "Promise her you'll stay with her wherever this goes.",
        to: "S5_N07C",
        fx: { d: { "tamsin.affection": 1 }, f: ["promised_tamsin"] },
        echo: "She looks at you for a long moment, and says nothing, and does not need to.",
      },
    ],
  },
  {
    key: "S5_N07C",
    ch: 6,
    title: "The Small Hours",
    text: [
      "Past midnight the station switches to night cycle: the corridor lights drop to a dim amber, the ventilation turns down to a murmur, and the whole habitat ring seems to curl in on itself like a sleeping animal.",
      "You walk her back to the alcove off the spine. The cot is narrow. The hex-key marks on the bulkhead are still there, eleven of them, and Tamsin, without a word, scratches a twelfth.",
      when({ flags: ["promised_tamsin"] }, "She leaves the headset on her pillow and does not take it off. You understand that it is for you."),
      when({ flags: ["private_channel"] }, "She hands you a spare headset. The channel is still open, she says. It always will be."),
      "ARIA: Doctor. Chief. I would like to make a statement in the morning. It concerns the crew. I would be grateful if you would both be present.",
      "It is the first time ARIA has asked for anything. The pause after she finishes is eleven seconds long, and you count every one.",
    ],
    choices: [
      {
        k: "a",
        t: "Take the cot beside hers, with the wrench between you.",
        to: "S5_N08",
        fx: { d: { "tamsin.affection": 1 }, f: ["slept_near_tamsin"] },
      },
      {
        k: "b",
        t: "Sleep in the med bay with the door open.",
        to: "S5_N08",
        fx: { f: ["slept_medbay"] },
      },
      {
        k: "c",
        t: "Sit up on watch at the end of the corridor.",
        to: "S5_N08",
        fx: { d: { resolve: 1 }, f: ["took_night_watch"] },
      },
    ],
  },
];