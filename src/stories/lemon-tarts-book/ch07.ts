import { when } from "../dsl";
import type { NodeDef } from "../types";

export const ch07: NodeDef[] = [
  {
    key: "S6_N07",
    ch: 7,
    title: "Dot's Office",
    text: [
      when({ flags: ["told_dot"] }, "You knock on Dame Dorothy's trailer at four o'clock, exactly as ordered. It is the most obedient thing you have done since primary school."),
      when({ notFlags: ["told_dot"] }, "A runner found you at lunch with a folded note in the unmistakable hand of a woman who has never ended a sentence with an exclamation mark: “Trailer. Four o'clock. Bring honesty.” You have brought a biscuit as well, in case honesty gets peckish."),
      "Dame Dorothy's trailer smells of Earl Grey and discipline. She pours you a cup without asking.",
      "DOT: Somebody in my tent is cheating. I have judged baking for forty years, and I know a sabotaged bake when I taste one.",
      when({ flags: ["accused_jun"] }, "DOT: And I saw your little performance this morning. Was it quite fair?"),
      "She looks at you over her glasses for a long moment.",
      "DOT: Tell me something true about why you're here.",
    ],
    choices: [
      {
        k: "a",
        t: "Confess honestly: you're terrified, and you're baking for someone who's gone.",
        to: "S6_N07B",
        fx: { d: { "dot.respect": 2 }, f: ["confessed_dot"] },
      },
      {
        k: "b",
        t: "Blame the rival. It was definitely Jun.",
        to: "S6_N07B",
        fx: { d: { "dot.respect": -1 }, f: ["blamed_jun"] },
      },
      {
        k: "c",
        t: "Slide your grandmother's notebook across the desk.",
        to: "S6_N07B",
        gems: 15,
        fx: { d: { "dot.respect": 3, creativity: 1 }, f: ["dot_moved"] },
      },
    ],
  },
  {
    key: "S6_N07B",
    ch: 7,
    title: "What Dot Knows",
    text: [
      when({ flags: ["confessed_dot"] }, "Dot says nothing for a moment. Then she nudges the biscuit tin an inch towards you, which, from her, is a hug."),
      when({ flags: ["blamed_jun"] }, "Dot's pen stops. “Blame is a very cheap ingredient,” she says. “It never rises.” She writes something down. You get the feeling it is not “promising”."),
      when({ flags: ["dot_moved"] }, "She turns the notebook's pages with two fingers, as if it might bruise. At page nine she stops, and her mouth does something complicated. “Lemon,” she says. “Of course.”"),
      "DOT: Here is what I know. Two of this week's ovens were serviced by a firm I have never hired. A batch of sugar went missing from the pantry log and turned up in your bin as salt. And every camera in that tent belongs to the production company, not to me.",
      "She taps her clipboard.",
      "DOT: If I demand the footage, the footage will be lost. In my experience, things are always lost by the people who own the cameras.",
      "You notice she is not looking at Jun when she says it. She is looking, for some reason, out of the window, at the production trailer across the lawn.",
    ],
    choices: [
      {
        k: "a",
        t: "Show her the logo on the sugar bag.",
        to: "S6_N07C",
        major: true,
        req: { flags: ["found_clue"] },
        hide: true,
        fx: { f: ["showed_dot_bag"] },
        echo: "She reads the little blue logo the way a doctor reads a thermometer.",
      },
      {
        k: "b",
        t: "Tell her what you saw on the lawn at two in the morning.",
        to: "S6_N07C",
        major: true,
        req: { anyFlags: ["followed_bryce", "noted_trailer"] },
        hide: true,
        fx: { f: ["told_dot_bryce"] },
        echo: "Dot goes very still. She doesn't say a name. She doesn't need to.",
      },
      {
        k: "c",
        t: "Admit you've no proof, only a very bad feeling.",
        to: "S6_N07C",
        major: true,
        echo: "“A bad feeling is where most proof starts,” says Dot, “and where most nonsense does, too.”",
      },
    ],
  },
  {
    key: "S6_N07C",
    ch: 7,
    title: "The Teapot",
    text: [
      "The kettle clicks off. Dot refills your cup without asking, which you are beginning to realise is how she asks.",
      when({ flags: ["told_dot_bryce"] }, "She says the name once, like a woman testing a floorboard. “He came to me eleven years ago with a spreadsheet and a smile. The smile has not changed.”"),
      when({ flags: ["showed_dot_bag"] }, "She holds the bag at arm's length by one corner. “Evidence,” she says, “is a lovely thing. It is also extremely easy to lose.” She does not give it back."),
      "DOT: When I was twenty-six, I baked my own wedding cake. Four tiers. It collapsed in the church hall in front of two hundred guests, and I stood in the middle of the floor holding a bottom tier like a drowned cat.",
      "DOT: Harold ate a slice off the floor. He said it was the best thing he'd ever tasted.",
      "She says it without self-pity, as a fact she forgave a long time ago.",
      "DOT: I have been looking for that cake, or that man, in every bake for forty years. Do you know, sometimes I catch a flicker.",
      "Outside, the afternoon light slants through the blinds and stripes the tea. A runner knocks twice, nervously, and flees.",
    ],
    choices: [
      {
        k: "a",
        t: "Ask her what Harold's favourite was.",
        to: "S6_N08",
        fx: { d: { "dot.respect": 1 } },
        echo: "“Lemon curd,” she says, and does not elaborate. She does not need to.",
      },
      {
        k: "b",
        t: "Promise to bake something Harold would have stayed at the table for.",
        to: "S6_N08",
        fx: { d: { creativity: 1 }, f: ["promised_dot"] },
      },
      {
        k: "c",
        t: "Thank her and leave her to her tea.",
        to: "S6_N08",
      },
    ],
  },
];