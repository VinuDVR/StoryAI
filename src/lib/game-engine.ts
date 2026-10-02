import type {
  PlaythroughState,
  ChoiceEffects,
  NodeConditions,
} from "@/db/schema";

export function createInitialState(storyId: number): PlaythroughState {
  const storyDefaults: Record<number, PlaythroughState> = {
    1: {
      stats: { courage: 0, mystery: 0 },
      relationships: { rowan: { trust: 0, affection: 0 } },
      flags: [],
      inventory: [],
    },
    2: {
      stats: { cleverness: 0, notoriety: 0 },
      relationships: { luca: { trust: 0, affection: 0 }, shaw: { trust: 0 } },
      flags: [],
      inventory: [],
    },
    3: {
      stats: { honour: 0, magic: 0, mercy: 0 },
      relationships: { kael: { trust: 0, affection: 0 } },
      flags: [],
      inventory: [],
    },
  };

  return (
    storyDefaults[storyId] ?? {
      stats: {},
      relationships: {},
      flags: [],
      inventory: [],
    }
  );
}

export function applyEffects(
  state: PlaythroughState,
  effects: ChoiceEffects
): PlaythroughState {
  const next: PlaythroughState = {
    stats: { ...state.stats },
    relationships: JSON.parse(JSON.stringify(state.relationships)),
    flags: [...state.flags],
    inventory: [...state.inventory],
  };

  if (effects.stats) {
    for (const [k, v] of Object.entries(effects.stats)) {
      next.stats[k] = (next.stats[k] ?? 0) + v;
    }
  }

  if (effects.relationships) {
    for (const [char, changes] of Object.entries(effects.relationships)) {
      if (!next.relationships[char]) next.relationships[char] = {};
      for (const [stat, delta] of Object.entries(changes)) {
        next.relationships[char][stat] =
          (next.relationships[char][stat] ?? 0) + delta;
      }
    }
  }

  if (effects.flags_add) {
    for (const flag of effects.flags_add) {
      if (!next.flags.includes(flag)) next.flags.push(flag);
    }
  }

  if (effects.flags_remove) {
    next.flags = next.flags.filter((f) => !effects.flags_remove!.includes(f));
  }

  if (effects.inventory_add) {
    for (const item of effects.inventory_add) {
      if (!next.inventory.includes(item)) next.inventory.push(item);
    }
  }

  return next;
}

export function checkConditions(
  state: PlaythroughState,
  conditions: NodeConditions | null | undefined
): boolean {
  if (!conditions?.requires) return true;
  const { flags, stats, relationships } = conditions.requires;

  if (flags) {
    for (const f of flags) {
      if (!state.flags.includes(f)) return false;
    }
  }

  if (stats) {
    for (const [stat, rule] of Object.entries(stats)) {
      const val = state.stats[stat] ?? 0;
      if (rule.gte !== undefined && val < rule.gte) return false;
      if (rule.lte !== undefined && val > rule.lte) return false;
      if (rule.eq !== undefined && val !== rule.eq) return false;
    }
  }

  if (relationships) {
    for (const [char, statRules] of Object.entries(relationships)) {
      const charStats = state.relationships[char] ?? {};
      for (const [stat, rule] of Object.entries(statRules)) {
        const val = charStats[stat] ?? 0;
        if (rule.gte !== undefined && val < rule.gte) return false;
        if (rule.lte !== undefined && val > rule.lte) return false;
      }
    }
  }

  return true;
}

export function getStatLabel(key: string): string {
  const labels: Record<string, string> = {
    courage: "Courage",
    mystery: "Mystery",
    cleverness: "Cleverness",
    notoriety: "Notoriety",
    honour: "Honour",
    magic: "Magic",
    mercy: "Mercy",
    trust: "Trust",
    affection: "Affection",
    respect: "Respect",
  };
  return labels[key] ?? key.charAt(0).toUpperCase() + key.slice(1);
}

export function getStatIcon(key: string): string {
  const icons: Record<string, string> = {
    courage: "⚔️",
    mystery: "🔮",
    cleverness: "🧠",
    notoriety: "💀",
    honour: "⭐",
    magic: "✨",
    mercy: "🕊️",
    trust: "🤝",
    affection: "❤️",
    respect: "👑",
  };
  return icons[key] ?? "•";
}

export function getCharacterName(key: string): string {
  const names: Record<string, string> = {
    rowan: "Rowan Vale",
    luca: "Luca Moretti",
    shaw: "Detective Shaw",
    kael: "Kael Ardyn",
    violet: "Violet",
  };
  return names[key] ?? key.charAt(0).toUpperCase() + key.slice(1);
}

export function formatEffectsSummary(effects: ChoiceEffects): string[] {
  const parts: string[] = [];

  if (effects.stats) {
    for (const [k, v] of Object.entries(effects.stats)) {
      const sign = v > 0 ? "+" : "";
      parts.push(`${sign}${v} ${getStatLabel(k)}`);
    }
  }

  if (effects.relationships) {
    for (const [char, changes] of Object.entries(effects.relationships)) {
      const name = getCharacterName(char);
      for (const [stat, delta] of Object.entries(changes)) {
        const sign = delta > 0 ? "+" : "";
        parts.push(`${name} ${getStatLabel(stat)} ${sign}${delta}`);
      }
    }
  }

  if (effects.flags_add?.length) {
    for (const f of effects.flags_add) {
      parts.push(`🚩 ${f.replace(/_/g, " ")}`);
    }
  }

  return parts;
}

export function getRelationshipPercentage(value: number): number {
  // Relationship stats can range from -10 to 10, display as 0-100%
  return Math.max(0, Math.min(100, ((value + 10) / 20) * 100));
}

export function getEndingEmoji(endingType: string | null): string {
  const map: Record<string, string> = {
    romance: "❤️",
    bittersweet: "🌙",
    sacrifice: "🕊️",
    special: "✨",
    justice: "⚖️",
    clean: "🌿",
    notoriety: "💎",
    throne: "👑",
    power: "🔮",
    hopeful: "🌅",
  };
  return map[endingType ?? ""] ?? "📖";
}
