import { when } from "../dsl";
import type { NodeDef } from "../types";

export const ch04: NodeDef[] = [
  {
    key: "S5_N05",
    ch: 4,
    title: "The Dead Antenna",
    text: [
      "The comms array is dead because someone cut its feed line. From outside. By hand.",
      "ARIA puts the break on the main screen: a severed conductor at the foot of the antenna mast, aft of the habitat ring, where the station's long spine ends in open vacuum.",
      "ARIA: It cannot be repaired from inside. I regret that.",
      "The repair requires a spacewalk in a storm of charged particles, and you only have about twenty minutes before the radiation windows close.",
      when({ flags: ["found_pod_logs"] }, "The pod logs said the same thing: Commander Varga went out to the antenna alone, and did not come back the way he left."),
      when({ flags: ["pressed_aria_dome"] }, "ARIA approves the spacewalk after a pause of eleven seconds. You count it. You have started counting everything."),
      when({ anyFlags: ["tracked_hum", "listened_dome"] }, "Whenever you stop to listen, the nine-second pulse seems to lean aft, toward the mast, like a compass needle."),
      "Tamsin is already pulling on her suit.",
    ],
    choices: [
      {
        k: "a",
        t: "Go out together, and trust her with your tether.",
        to: "S5_N05B",
        fx: { d: { "tamsin.affection": 1, resolve: 1 }, f: ["tether_trust"] },
      },
      {
        k: "b",
        t: "Send the maintenance drone instead.",
        to: "S5_N05B",
        fx: { d: { tech: 1 }, f: ["sent_drone"] },
      },
      {
        k: "c",
        t: "Go out, with Tamsin's voice in your ear the whole way.",
        to: "S5_N05B",
        gems: 15,
        fx: { d: { "tamsin.affection": 2, "tamsin.trust": 1 }, f: ["private_channel"] },
      },
    ],
  },
  {
    key: "S5_N05B",
    ch: 4,
    title: "The Airlock",
    text: [
      "The airlock is the size of a wardrobe and smells of rubber and cold. A radiation counter on the bulkhead ticks the window down in red digits.",
      "## RADIATION WINDOW · 19:42 REMAINING",
      when({ flags: ["tether_trust"] }, "Tamsin clips her tether to yours before she clips it to the hull. She tugs it twice, hard, and meets your eyes through both visors. “If it goes, it goes both ways,” she says. It is the closest anyone has been to you in eleven days."),
      when({ flags: ["sent_drone"] }, "The maintenance drone is a squat grey crab with BISCUIT stencilled on its shell by someone long gone. It rattles into the lock and waits, claws folded, while you and Tamsin crowd the porthole. She chews her thumbnail and does not know she is doing it."),
      when({ flags: ["private_channel"] }, "You go alone. Tamsin seals you in from the control panel, and her voice comes into your helmet on a channel she set up herself. “Can you hear me?” “Yes.” “Good. Don't stop talking to me. Not once.”"),
      "Beyond the outer door lies a darkness with no bottom. Oriel-9 fills half the sky, a brass-coloured wall with storms the size of continents turning across its face, and between you and it, invisible, the particle storm is already hissing against the hull.",
    ],
    choices: [
      {
        k: "a",
        t: "Check your seals twice before you cycle the lock.",
        to: "S5_N05C",
        fx: { d: { tech: 1 }, f: ["double_checked"] },
        echo: "The second check finds a seal that was one click short of closed. You do not mention it.",
      },
      {
        k: "b",
        t: "Ask Tamsin what happens if the window closes early.",
        to: "S5_N05C",
        fx: { d: { "tamsin.trust": 1 }, f: ["asked_window"] },
        echo: "“Then we don't come back,” she says, “so let's not let that happen.”",
      },
      {
        k: "c",
        t: "Cycle the lock now. Every minute is dose.",
        to: "S5_N05C",
        fx: { d: { resolve: 1 }, f: ["rushed_lock"] },
      },
    ],
  },
  {
    key: "S5_N05C",
    ch: 4,
    title: "The Mast",
    text: [
      when({ flags: ["tether_trust"] }, "The mast rises out of the habitat ring like a bare tree: struts, dishes, a lattice of cable. You crawl hand over hand along the rail with Tamsin a body-length behind, her tether taut against yours. Charged particles hiss on your visor like rain on tin."),
      when({ flags: ["private_channel"] }, "You crawl along the rail alone. Tamsin's voice is steady in your ear, reading out radiation counts and, between them, nonsense: the names of every ship she has ever repaired, in order. It helps more than it should."),
      when({ flags: ["sent_drone"] }, "Back on the bridge you watch Biscuit climb the mast on its eight legs. The picture is grainy, striped with static that arrives every nine seconds exactly. Tamsin has stopped chewing her thumbnail. She is gripping the back of your chair."),
      "The cut is clean. Not a tear, not a meteor strike: a neat diagonal shear through the conductor, the way you would cut the stem of a flower.",
      "Beside it, clipped to the rail and closed, is a pair of hull shears with a strip of green tape on the handle. In the commander's kit, green tape means his.",
      when({ flags: ["found_pod_logs"] }, "He came out here alone, you think, and did this. Whatever he did afterwards, he did not come back the way he left."),
      "On the base plate, scratched through the frost into bare metal, are rows of short marks, grouped in nines.",
      "## RADIATION WINDOW · 11:08 REMAINING",
    ],
    choices: [
      {
        k: "a",
        t: "Splice the line fast and ugly. You have minutes.",
        to: "S5_N06",
        fx: { f: ["fixed_fast"] },
        echo: "It will hold. Probably.",
      },
      {
        k: "b",
        t: "Take the time to do it properly, even if it costs dose.",
        to: "S5_N06",
        fx: { d: { resolve: 1 }, f: ["fixed_carefully"] },
        echo: "The dose counter climbs. The splice is beautiful.",
      },
      {
        k: "c",
        t: "Photograph the cut ends and the marks before you touch anything.",
        to: "S5_N06",
        fx: { d: { tech: 1 }, f: ["photographed_cut"] },
      },
    ],
  },
];