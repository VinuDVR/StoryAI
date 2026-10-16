import { STORIES } from "../src/stories";
import { validateStory } from "../src/lib/validate";

const slug = process.argv[2] ?? "hollow-at-hollowmere";
const def = STORIES.find((s) => s.slug === slug);
if (!def) {
  console.error(`No story with slug "${slug}". Available: ${STORIES.map((s) => s.slug).join(", ")}`);
  process.exit(1);
}

const r = validateStory(def, 3000);
console.log(`${r.title}: ${r.nodeCount} nodes, ${r.choiceCount} choices, ${r.premiumCount} premium, ${r.endingCount} endings, ${r.chapterCount} chapters`);
console.log(`Errors (${r.errors.length}):`);
for (const e of r.errors) console.log("  x " + e);
console.log(`Warnings (${r.warnings.length}):`);
for (const w of r.warnings) console.log("  ! " + w);
console.log("Endings (share of random runs: free only / with premium):");
for (const e of r.sim.endings) {
  const free = ((r.sim.free[e.key] ?? 0) / r.sim.runs) * 100;
  const all = ((r.sim.all[e.key] ?? 0) / r.sim.runs) * 100;
  console.log(`  ${e.title}: ${free.toFixed(1)}% / ${all.toFixed(1)}%`);
}