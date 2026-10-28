import { when } from "../dsl";
import type { NodeDef } from "../types";

export const ch05: NodeDef[] = [
  {
    key: "S5_N06",
    ch: 5,
    title: "The Signal",
    text: [
      "When the antenna comes alive, it does not find Earth. It finds something else.",
      "A signal floods the speakers: a long, slow pattern, a hum beneath a rhythm, like a heartbeat in a language you almost understand. It has been transmitting for years.",
      "It was the reason for the lockdown. It was why the crew left their beds.",
      when({ flags: ["private_channel"] }, "Tamsin's voice in your helmet is very quiet: “Don't listen to it too long. Promise me.”"),
      when({ flags: ["tether_trust"] }, "Tamsin's glove closes on your arm, hard enough to feel through two suits."),
      when({ flags: ["sent_drone"] }, "On the bridge screen Biscuit's camera swings upward as the dish unfolds, and the bridge speakers fill with a sound like a very large animal turning over in its sleep."),
      "Your own pulse has started to match its rhythm.",
    ],
    choices: [
      {
        k: "a",
        t: "Listen deeper. You need to understand it.",
        to: "S5_N06B",
        fx: { d: { resolve: 1 }, f: ["heard_signal"] },
      },
      {
        k: "b",
        t: "Record the signal for analysis.",
        to: "S5_N06B",
        fx: { d: { tech: 1 }, f: ["recorded_signal"] },
      },
      {
        k: "c",
        t: "Mute every receiver on the station.",
        to: "S5_N06B",
        fx: { d: { resolve: 1 }, f: ["muted_receivers"] },
      },
    ],
  },
  {
    key: "S5_N06B",
    ch: 5,
    title: "Under the Rhythm",
    text: [
      when({ flags: ["heard_signal"] }, "You let it in. At first it is only rhythm, a long rise and a short fall, but the longer you listen the more it has a grammar, and the grammar is made of absence: a gap where an answer should go, and then the rise again, and then the gap. It is the shape of someone leaving room for a reply. The gap is nine seconds long."),
      when({ flags: ["recorded_signal"] }, "The tablet records without complaint. The file grows in the corner of the screen, megabyte by megabyte, and the waveform looks less like sound than like a long, slow breath."),
      when({ flags: ["recorded_signal", "copied_telemetry"] }, "You hold it beside the telemetry you copied earlier. The first marker lines up with the nine-second pulse to the millisecond."),
      when({ flags: ["muted_receivers"] }, "You mute every receiver you can reach. The speakers fall silent. It makes no difference. The beat does not need speakers: it is in the rail under your hands, a faint tremor, one pulse every nine seconds, as though the station itself were the receiver."),
      "The lights in the lock dim and brighten, once per beat. Nobody is controlling them.",
      "ARIA: Please return inside. The radiation window will close in six minutes.",
      "She says it gently, and for the first time you understand that she is frightened too.",
    ],
    choices: [
      {
        k: "a",
        t: "Ask ARIA how long it has been transmitting.",
        to: "S5_N06C",
        fx: { d: { "aria.trust": -1 }, f: ["asked_aria_signal"] },
        echo: "“Four years, two months and eleven days,” says ARIA. “The station has been receiving since before we arrived.”",
      },
      {
        k: "b",
        t: "Check on Tamsin.",
        to: "S5_N06C",
        fx: { d: { "tamsin.affection": 1 }, f: ["checked_tamsin_eva"] },
        echo: "She answers on the first word, as if she had been holding it ready.",
      },
      {
        k: "c",
        t: "Look away from the screens, breathe, and count the beat.",
        to: "S5_N06C",
        fx: { d: { resolve: 1 }, f: ["counted_beat"] },
        echo: "Nine seconds. Nine seconds. Counting gives your mind something to hold, and the signal slides off it.",
      },
    ],
  },
  {
    key: "S5_N06C",
    ch: 5,
    title: "Decontamination",
    text: [
      "The inner door cycles, and the world comes back in a rush of warm air and noise: pumps, fans, the dull thump of your own heart. You hang your helmet on its hook and discover your hands are shaking.",
      "## DOSE LOGGED · WITHIN LIMITS",
      when({ flags: ["fixed_carefully"] }, "The dose readout is higher than it should be. You spent a third of your window on a splice nobody will ever inspect. The splice is perfect. It has taken something out of you."),
      when({ flags: ["fixed_fast"] }, "The splice you made in a hurry holds, the screens say. You do not entirely believe them."),
      when({ flags: ["photographed_cut"] }, "On your tablet, in the cold white of the helmet lamp, are the shears with their strip of green tape, the clean diagonal shear, and the rows of marks in groups of nine."),
      "Tamsin is waiting at the inner door, with a flask in one hand and the wrench in the other, and for a moment you are not sure which she means to give you.",
      when({ flags: ["tether_trust"] }, "She looks you over for damage, hands quick and impersonal, the way she checks a seal. It takes her a second too long to take her hands away."),
      when({ flags: ["private_channel"] }, "She never took the headset off. Her voice has gone hoarse from talking."),
      when({ flags: ["sent_drone"] }, "Biscuit clatters in behind you, and Tamsin laughs for the first time since you woke. It is a startled, rusty sound."),
      "TAMSIN: So. Did it work?",
      "Somewhere in the walls the pulse ticks by again, and neither of you mentions it.",
    ],
    choices: [
      {
        k: "a",
        t: "Tell Tamsin everything you heard.",
        to: "S5_N07",
        fx: { d: { "tamsin.trust": 1 }, f: ["told_tamsin_signal"] },
      },
      {
        k: "b",
        t: "Tell her the signal is real, and keep the rest until you understand it.",
        to: "S5_N07",
        fx: { d: { resolve: 1 }, f: ["kept_signal_quiet"] },
      },
      {
        k: "c",
        t: "Ask her to sit with you while you play the recording once.",
        to: "S5_N07",
        req: { flags: ["recorded_signal"] },
        hide: true,
        fx: { d: { "tamsin.affection": 1 }, f: ["replayed_with_tamsin"] },
        echo: "You play it at a whisper. She doesn't speak until the gap, and then she says, very softly, “It's waiting for somebody to say something.”",
      },
    ],
  },
];