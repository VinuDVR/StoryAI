import { when } from "../dsl";
import type { NodeDef } from "../types";

export const ch02: NodeDef[] = [
  {
    key: "S6_N02",
    ch: 2,
    title: "The Signature Bake",
    text: [
      "Dame Dorothy Beaumont sweeps into the tent in a mustard cardigan, carrying a clipboard like a war crime.",
      "DOT: Welcome, bakers. Your signature bake is 'A Taste Of Home'. You have two hours. If I find a single soggy bottom, I will say so, and I will say it slowly.",
      "Your hands are shaking. The notebook in your pocket is the only thing keeping you upright: your grandmother's handwriting, buttery and stained, with a recipe for lemon tart on page nine.",
      "Across the tent, Jun is whisking something complicated with a look of deep spiritual joy.",
    ],
    choices: [
      {
        k: "a",
        t: "Bake your grandmother's lemon tart. Exactly as she made it.",
        to: "S6_N02B",
        fx: { d: { creativity: 1, "dot.respect": 1 }, f: ["lemon_tart"] },
      },
      {
        k: "b",
        t: "Go wild: a molecular lemon cloud in a spun-sugar cage.",
        to: "S6_N02B",
        fx: { d: { creativity: 2, poise: -1 }, f: ["went_wild"] },
      },
      {
        k: "c",
        t: "Bake something safe, elegant and unarguable.",
        to: "S6_N02B",
        fx: { d: { poise: 2 }, f: ["played_safe"] },
      },
    ],
  },
  {
    key: "S6_N02B",
    ch: 2,
    title: "Two Hours",
    text: [
      when({ flags: ["lemon_tart"] }, "You open the notebook to page nine. Gran's handwriting says: “Zest like you mean it. Don't rush the curd. If it splits, don't swear, it can hear you.” You decide to take all three instructions personally."),
      when({ flags: ["went_wild"] }, "The molecular lemon cloud requires a siphon, a bag of something called “lecithin” and an alarmingly serious plan. Dev, passing, whispers, “Is that legal?” You say you hope so."),
      when({ flags: ["played_safe"] }, "You set out a pâte sucrée, a calm curd and a very small, very sensible amount of dignity. It is, objectively, the most reasonable thing in the tent. You have never felt so quietly bored."),
      "An hour in, the tent develops a sound of its own: a hundred whisks, a dozen timers, and the faint, sweating murmur of eight adults negotiating with butter. A camera hangs over your shoulder like a very polite vulture.",
      "At the next bench Marguerite is rolling pastry with the unhurried ferocity of a woman who once supervised a school fete in a force-eight gale.",
      when({ flags: ["met_marguerite"] }, "Without looking up, she says, “Don't overwork it, dear. Pastry knows when you're frightened.”"),
      "The clock says fifty minutes. Your oven says it has opinions.",
    ],
    choices: [
      {
        k: "a",
        t: "Stop and taste as you go, the way Gran always did.",
        to: "S6_N02C",
        fx: { d: { creativity: 1, poise: -1 }, f: ["tasted_as_you_go"] },
        echo: "You fall four minutes behind. It is worth it. The curd is perfect.",
      },
      {
        k: "b",
        t: "Trust the timer and keep to the plan.",
        to: "S6_N02C",
        fx: { d: { poise: 1, creativity: -1 } },
        echo: "You finish on the dot. You will never know what you missed.",
      },
      {
        k: "c",
        t: "Grab a spoon of Jun's curd while he isn't looking, just to compare.",
        to: "S6_N02C",
        fx: { f: ["tasted_jun_curd"] },
        echo: "It is better than yours. This is the most irritating thing that has ever happened to you.",
      },
    ],
  },
  {
    key: "S6_N02C",
    ch: 2,
    title: "The Judging Table",
    text: [
      "Judging takes place at a long table under a chandelier made of whisks, which is one of those decisions you only notice once, and then cannot stop noticing.",
      "Dame Dorothy tastes with a ritual solemnity that suggests the biscuit has been placed before a tribunal. She chews. She swallows. Her eyebrows do nothing at all, which is somehow the most terrifying thing they could do.",
      when({ flags: ["lemon_tart"] }, "She stops, and holds the spoon in the air a fraction too long. “Where,” she says, “did you learn to do this?” You say your grandmother. She writes something on her clipboard and does not tell you what."),
      when({ flags: ["went_wild"] }, "She regards the lemon cloud for a long time, the way one regards a very interesting car crash. “Bold,” she says. “I will say that for it.” The audience laughs. You are not sure whether this is good."),
      when({ flags: ["played_safe"] }, "“Competent,” says Dame Dorothy. It is the cruellest word in the English language, and she says it kindly, which makes it worse."),
      when({ flags: ["tasted_as_you_go"] }, "She notes the balance of the curd with a short nod. Tasting as you go has paid off, and you are the only one in the room who knows how."),
      when({ flags: ["tasted_jun_curd"] }, "Across the table, Jun is watching you with an expression of gentle puzzlement. His curd is missing a spoonful. He has not said anything. He has, you suspect, noticed."),
      "The cameras linger on you like a rumour.",
    ],
    choices: [
      {
        k: "a",
        t: "Say honestly what you'd change next time.",
        to: "S6_N03",
        fx: { d: { "dot.respect": 1 } },
        echo: "Dame Dorothy's pen pauses. Nobody ever tells her what's wrong with it, she says, until she's asked.",
      },
      {
        k: "b",
        t: "Thank her gracefully and say nothing else.",
        to: "S6_N03",
      },
      {
        k: "c",
        t: "Tell the whole tent the tart is your grandmother's, and she's the reason you're here.",
        to: "S6_N03",
        req: { flags: ["lemon_tart"] },
        hide: true,
        fx: { d: { "dot.respect": 1 }, f: ["credited_gran"] },
        echo: "The tent goes quiet. Somewhere behind the cameras, someone blows their nose.",
      },
    ],
  },
];