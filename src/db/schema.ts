import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import type { Block, Cond, Effects, GameState, RouteDef, StoryMeta } from "@/stories/types";

export const players = pgTable("players", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique(),
  passwordHash: text("password_hash"),
  displayName: text("display_name"),
  gems: integer("gems").notNull().default(60),
  lastDailyClaim: timestamp("last_daily_claim", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const playerSessions = pgTable(
  "player_sessions",
  {
    tokenHash: text("token_hash").primaryKey(),
    playerId: uuid("player_id")
      .notNull()
      .references(() => players.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("player_sessions_player_idx").on(t.playerId)],
);

export const gemTransactions = pgTable(
  "gem_transactions",
  {
    id: serial("id").primaryKey(),
    playerId: uuid("player_id")
      .notNull()
      .references(() => players.id, { onDelete: "cascade" }),
    amount: integer("amount").notNull(),
    kind: text("kind").notNull(), // welcome | daily | pack | spend
    description: text("description").notNull(),
    rewardKey: text("reward_key"),
    playthroughId: uuid("playthrough_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("gem_tx_player_idx").on(t.playerId),
    uniqueIndex("gem_tx_reward_unique").on(t.playerId, t.rewardKey),
  ],
);

export const stories = pgTable("stories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  tagline: text("tagline").notNull(),
  description: text("description").notNull(),
  coverImageUrl: text("cover_image_url"),
  coverFrom: text("cover_from").notNull(),
  coverTo: text("cover_to").notNull(),
  coverEmoji: text("cover_emoji").notNull(),
  genres: jsonb("genres").$type<string[]>().notNull(),
  ageRating: text("age_rating").notNull(),
  isPremium: boolean("is_premium").notNull().default(false),
  status: text("status").notNull().default("published"),
  chapterCount: integer("chapter_count").notNull().default(0),
  endingCount: integer("ending_count").notNull().default(0),
  sortOrder: integer("sort_order").notNull().default(0),
  meta: jsonb("meta").$type<StoryMeta>().notNull(),
  contentHash: text("content_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const storyNodes = pgTable(
  "story_nodes",
  {
    id: serial("id").primaryKey(),
    storyId: integer("story_id")
      .notNull()
      .references(() => stories.id, { onDelete: "cascade" }),
    nodeKey: text("node_key").notNull(),
    chapterNumber: integer("chapter_number").notNull(),
    sceneTitle: text("scene_title").notNull(),
    content: jsonb("content").$type<Block[]>().notNull(),
    isStart: boolean("is_start").notNull().default(false),
    isEnding: boolean("is_ending").notNull().default(false),
    endingType: text("ending_type"),
    endingNumber: integer("ending_number"),
    endingTitle: text("ending_title"),
    conditions: jsonb("conditions").$type<Cond | null>(),
    routes: jsonb("routes").$type<RouteDef[] | null>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("story_node_key_idx").on(t.storyId, t.nodeKey)],
);

export const nodeChoices = pgTable(
  "node_choices",
  {
    id: serial("id").primaryKey(),
    nodeId: integer("node_id")
      .notNull()
      .references(() => storyNodes.id, { onDelete: "cascade" }),
    choiceKey: text("choice_key").notNull(),
    choiceText: text("choice_text").notNull(),
    targetNodeKey: text("target_node_key").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    isPremium: boolean("is_premium").notNull().default(false),
    priceGems: integer("price_gems").notNull().default(0),
    conditions: jsonb("conditions").$type<Cond | null>(),
    effects: jsonb("effects").$type<Effects | null>(),
    isMajor: boolean("is_major").notNull().default(false),
    echo: text("echo"),
    lockReason: text("lock_reason"),
    hideWhenLocked: boolean("hide_when_locked").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("node_choices_node_idx").on(t.nodeId)],
);

export const playthroughs = pgTable(
  "playthroughs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    playerId: uuid("player_id")
      .notNull()
      .references(() => players.id, { onDelete: "cascade" }),
    storyId: integer("story_id")
      .notNull()
      .references(() => stories.id, { onDelete: "cascade" }),
    currentNodeKey: text("current_node_key").notNull(),
    state: jsonb("state").$type<GameState>().notNull(),
    status: text("status").notNull().default("active"), // active | completed
    endingKey: text("ending_key"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (t) => [index("playthroughs_player_idx").on(t.playerId)],
);

export const playthroughSteps = pgTable(
  "playthrough_steps",
  {
    id: serial("id").primaryKey(),
    playthroughId: uuid("playthrough_id")
      .notNull()
      .references(() => playthroughs.id, { onDelete: "cascade" }),
    stepNumber: integer("step_number").notNull(),
    fromNodeKey: text("from_node_key").notNull(),
    toNodeKey: text("to_node_key").notNull(),
    choiceKey: text("choice_key").notNull(),
    choiceText: text("choice_text").notNull(),
    isPremium: boolean("is_premium").notNull().default(false),
    isMajor: boolean("is_major").notNull().default(false),
    gemsSpent: integer("gems_spent").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("steps_playthrough_idx").on(t.playthroughId)],
);
