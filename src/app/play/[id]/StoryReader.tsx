"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Gem,
  Heart,
  Shield,
  Star,
  ChevronDown,
  ChevronUp,
  Scroll,
  RotateCcw,
  Share2,
  BookOpen,
} from "lucide-react";
import type { PlaythroughState, ChoiceEffects, NodeConditions } from "@/db/schema";
import {
  checkConditions,
  getStatLabel,
  getStatIcon,
  getCharacterName,
  getRelationshipPercentage,
  getEndingEmoji,
  formatEffectsSummary,
} from "@/lib/game-engine";

// ─── Types ────────────────────────────────────────────────────────────────────
type NodeData = {
  nodeKey: string;
  chapterNumber: number;
  sceneTitle: string;
  content: string;
  speaker: string | null;
  speakerDialogue: string | null;
  isEnding: boolean;
  endingType: string | null;
  endingTitle: string | null;
  endingContent: string | null;
};

type ChoiceData = {
  id: number;
  choiceKey: string;
  choiceText: string;
  targetNodeKey: string;
  isPremium: boolean;
  priceGems: number;
  conditions: NodeConditions | null;
  effects: ChoiceEffects;
  effectsSummary: string | null;
  sortOrder: number;
};

type StepData = {
  nodeKey: string;
  choiceKey: string | null;
  choiceText: string | null;
  chapterNumber: number;
  effectsApplied: ChoiceEffects | null;
};

type Props = {
  playthrough: {
    id: number;
    storyId: number;
    currentNodeKey: string;
    state: PlaythroughState;
    isCompleted: boolean;
    endingKey: string | null;
    gemsBalance: number;
    gemsSpent: number;
  };
  story: {
    id: number;
    title: string;
    characters: Array<{
      id: string;
      name: string;
      role: string;
      description: string;
      stats?: string[];
    }>;
  };
  initialNode: NodeData;
  initialChoices: ChoiceData[];
  steps: StepData[];
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function RelationshipBar({
  name,
  stats,
}: {
  name: string;
  stats: Record<string, number>;
}) {
  return (
    <div className="space-y-2">
      <div className="text-xs font-sans font-semibold text-slate-300 uppercase tracking-wider">
        {getCharacterName(name)}
      </div>
      {Object.entries(stats).map(([stat, val]) => (
        <div key={stat}>
          <div className="flex justify-between text-xs font-sans text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              {getStatIcon(stat)} {getStatLabel(stat)}
            </span>
            <span>{val}/10</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${getRelationshipPercentage(val)}%`,
                background:
                  stat === "affection"
                    ? "linear-gradient(90deg, #fb7185, #f43f5e)"
                    : stat === "trust"
                    ? "linear-gradient(90deg, #818cf8, #6366f1)"
                    : "linear-gradient(90deg, #34d399, #10b981)",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function StatPill({ stat, value }: { stat: string; value: number }) {
  return (
    <div className="flex items-center gap-1.5 bg-white/5 rounded-lg px-2.5 py-1.5 text-xs font-sans">
      <span>{getStatIcon(stat)}</span>
      <span className="text-slate-400">{getStatLabel(stat)}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}

function EffectsToast({
  effects,
  visible,
}: {
  effects: ChoiceEffects;
  visible: boolean;
}) {
  const parts = formatEffectsSummary(effects);
  if (!parts.length || !visible) return null;

  return (
    <div className="fixed top-6 right-6 z-50 bg-[#1a1a2e] border border-purple-500/30 rounded-xl p-4 shadow-2xl animate-fade-in-up max-w-xs">
      <div className="text-xs font-sans font-semibold text-purple-400 mb-2 uppercase tracking-wider">
        Relationship Changed
      </div>
      <div className="space-y-1">
        {parts.map((p, i) => (
          <div key={i} className="text-sm text-slate-300 font-sans">
            {p}
          </div>
        ))}
      </div>
    </div>
  );
}

function EndingScreen({
  node,
  state,
  steps,
  storyId,
  playthroughId,
  gemsSpent,
}: {
  node: NodeData;
  state: PlaythroughState;
  steps: StepData[];
  storyId: number;
  playthroughId: number;
  gemsSpent: number;
}) {
  const emoji = getEndingEmoji(node.endingType);
  const flagCount = state.flags.length;
  const choiceCount = steps.filter((s) => s.choiceKey).length;

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-6 py-12">
      <div className="max-w-xl w-full text-center space-y-8 animate-fade-in-up">
        {/* Ending badge */}
        <div className="text-6xl">{emoji}</div>

        <div>
          <div className="text-xs font-sans uppercase tracking-widest text-purple-400 mb-2">
            Ending Reached
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            {node.endingTitle ?? node.sceneTitle}
          </h1>
        </div>

        {/* Story content */}
        <div className="text-left bg-[#12121a] border border-white/5 rounded-2xl p-6 story-content text-slate-300 space-y-4">
          {node.content.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
          {node.speakerDialogue && (
            <div className="border-l-2 border-purple-500/40 pl-4 italic text-slate-400">
              {node.speaker && (
                <div className="text-xs font-sans font-semibold text-purple-400 uppercase tracking-wider mb-1 not-italic">
                  {node.speaker}
                </div>
              )}
              <p>{node.speakerDialogue}</p>
            </div>
          )}
          {node.endingContent && (
            <p className="text-slate-500 italic text-sm border-t border-white/5 pt-4">
              {node.endingContent}
            </p>
          )}
        </div>

        {/* Stats summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#12121a] border border-white/5 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{choiceCount}</div>
            <div className="text-xs font-sans text-slate-500 mt-1">Choices Made</div>
          </div>
          <div className="bg-[#12121a] border border-white/5 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{flagCount}</div>
            <div className="text-xs font-sans text-slate-500 mt-1">Secrets Found</div>
          </div>
          <div className="bg-[#12121a] border border-white/5 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-amber-400">💎 {gemsSpent}</div>
            <div className="text-xs font-sans text-slate-500 mt-1">Gems Spent</div>
          </div>
        </div>

        {/* Relationships */}
        {Object.entries(state.relationships).length > 0 && (
          <div className="bg-[#12121a] border border-white/5 rounded-xl p-5 text-left space-y-4">
            <div className="text-sm font-sans font-semibold text-slate-300 flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400" />
              Final Relationships
            </div>
            {Object.entries(state.relationships).map(([char, stats]) => (
              <RelationshipBar key={char} name={char} stats={stats} />
            ))}
          </div>
        )}

        {/* Flags */}
        {state.flags.length > 0 && (
          <div className="bg-[#12121a] border border-white/5 rounded-xl p-5 text-left">
            <div className="text-sm font-sans font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" />
              Your Story
            </div>
            <div className="flex flex-wrap gap-2">
              {state.flags.map((f) => (
                <span
                  key={f}
                  className="text-xs font-sans bg-purple-500/10 border border-purple-500/20 text-purple-300 px-2.5 py-1 rounded-full"
                >
                  ✓ {f.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`/stories/${storyId}`}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-sans font-semibold text-sm transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Play Again
          </Link>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-sans font-semibold text-sm transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            All Stories
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function StoryReader({
  playthrough: initialPt,
  story,
  initialNode,
  initialChoices,
  steps: initialSteps,
}: Props) {
  const [pt, setPt] = useState(initialPt);
  const [node, setNode] = useState(initialNode);
  const [choices, setChoices] = useState(initialChoices);
  const [steps, setSteps] = useState(initialSteps);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastEffects, setLastEffects] = useState<ChoiceEffects | null>(null);
  const [showEffects, setShowEffects] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showRelationships, setShowRelationships] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Hide effects toast after 3s
  useEffect(() => {
    if (showEffects) {
      const t = setTimeout(() => setShowEffects(false), 3000);
      return () => clearTimeout(t);
    }
  }, [showEffects]);

  // Scroll to top on node change
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [node.nodeKey]);

  const handleChoice = useCallback(
    async (choiceKey: string) => {
      setLoading(choiceKey);
      setError(null);
      try {
        const res = await fetch(`/api/playthroughs/${pt.id}/choose`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ choiceKey }),
        });
        const data = await res.json();

        if (!res.ok) {
          if (res.status === 402) {
            setError(`Not enough gems. Need 💎 ${data.required}, have 💎 ${data.gemsBalance}.`);
          } else {
            setError(data.error ?? "Something went wrong.");
          }
          return;
        }

        setPt({
          id: data.playthrough.id,
          storyId: data.playthrough.storyId,
          currentNodeKey: data.playthrough.currentNodeKey,
          state: data.playthrough.state,
          isCompleted: data.playthrough.isCompleted,
          endingKey: data.playthrough.endingKey,
          gemsBalance: data.playthrough.gemsBalance,
          gemsSpent: data.playthrough.gemsSpent,
        });
        setNode({
          nodeKey: data.node.nodeKey,
          chapterNumber: data.node.chapterNumber,
          sceneTitle: data.node.sceneTitle,
          content: data.node.content,
          speaker: data.node.speaker,
          speakerDialogue: data.node.speakerDialogue,
          isEnding: data.node.isEnding,
          endingType: data.node.endingType,
          endingTitle: data.node.endingTitle,
          endingContent: data.node.endingContent,
        });
        setChoices(
          (data.choices ?? []).map((c: ChoiceData) => ({
            id: c.id,
            choiceKey: c.choiceKey,
            choiceText: c.choiceText,
            targetNodeKey: c.targetNodeKey,
            isPremium: c.isPremium,
            priceGems: c.priceGems,
            conditions: c.conditions,
            effects: c.effects,
            effectsSummary: c.effectsSummary,
            sortOrder: c.sortOrder,
          }))
        );

        if (data.effectsApplied) {
          const summary = formatEffectsSummary(data.effectsApplied);
          if (summary.length > 0) {
            setLastEffects(data.effectsApplied);
            setShowEffects(true);
          }
        }

        // Append step
        const selectedChoice = choices.find((c) => c.choiceKey === choiceKey);
        if (selectedChoice) {
          setSteps((prev) => [
            ...prev,
            {
              nodeKey: node.nodeKey,
              choiceKey,
              choiceText: selectedChoice.choiceText,
              chapterNumber: node.chapterNumber,
              effectsApplied: data.effectsApplied,
            },
          ]);
        }
      } finally {
        setLoading(null);
      }
    },
    [pt.id, node, choices]
  );

  // ─── Ending screen ────────────────────────────────────────────────────────
  if (pt.isCompleted && node.isEnding) {
    return (
      <EndingScreen
        node={node}
        state={pt.state}
        steps={steps}
        storyId={pt.storyId}
        playthroughId={pt.id}
        gemsSpent={pt.gemsSpent}
      />
    );
  }

  const state = pt.state;
  const availableChoices = choices.filter((c) =>
    checkConditions(state, c.conditions)
  );
  const lockedChoices = choices.filter(
    (c) => !checkConditions(state, c.conditions)
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      {/* Effects Toast */}
      {lastEffects && (
        <EffectsToast effects={lastEffects} visible={showEffects} />
      )}

      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-[#0a0a0f]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-sans text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:block">{story.title}</span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Chapter indicator */}
            <span className="text-xs font-sans text-slate-500 hidden sm:block">
              Ch. {node.chapterNumber}
            </span>

            {/* Gems */}
            <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1">
              <Gem className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-400 font-sans font-semibold text-sm">
                {pt.gemsBalance}
              </span>
            </div>

            {/* Relationship toggle */}
            <button
              onClick={() => setShowRelationships(!showRelationships)}
              className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
              title="Relationships"
            >
              <Heart className="w-4 h-4" />
            </button>

            {/* History toggle */}
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
              title="Choice History"
            >
              <Scroll className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-4xl mx-auto w-full">
        {/* Main story column */}
        <main ref={contentRef} className="flex-1 px-4 md:px-8 py-8">
          {/* Chapter / Scene header */}
          <div className="mb-6 animate-fade-in-up">
            <div className="text-xs font-sans uppercase tracking-widest text-purple-400 mb-1">
              Chapter {node.chapterNumber}
            </div>
            <h1 className="text-2xl font-bold text-white">{node.sceneTitle}</h1>
          </div>

          {/* Narrative content */}
          <div className="story-content text-slate-300 mb-8 animate-fade-in-up space-y-4">
            {node.content.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {/* Speaker dialogue */}
          {node.speaker && node.speakerDialogue && (
            <div className="mb-8 animate-fade-in-up">
              <div className="bg-[#12121a] border border-white/5 rounded-xl p-5">
                <div className="text-xs font-sans font-semibold text-purple-400 uppercase tracking-widest mb-2">
                  {node.speaker}
                </div>
                <p className="text-slate-200 italic leading-relaxed">
                  {node.speakerDialogue}
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-300 font-sans text-sm animate-fade-in-up">
              {error}
            </div>
          )}

          {/* Choices */}
          {availableChoices.length > 0 && (
            <div className="space-y-3 animate-fade-in-up">
              <div className="text-xs font-sans uppercase tracking-widest text-slate-600 mb-4">
                What do you do?
              </div>

              {availableChoices.map((choice) => {
                const effectParts = choice.effectsSummary
                  ? choice.effectsSummary.split(" · ")
                  : formatEffectsSummary(choice.effects);

                return (
                  <button
                    key={choice.choiceKey}
                    onClick={() => handleChoice(choice.choiceKey)}
                    disabled={loading !== null}
                    className={`
                      w-full text-left rounded-xl border transition-all duration-200 p-4
                      ${
                        choice.isPremium
                          ? "bg-amber-500/5 border-amber-500/30 hover:bg-amber-500/10 hover:border-amber-500/50"
                          : "bg-white/2 border-white/5 hover:bg-white/5 hover:border-purple-500/30"
                      }
                      ${loading === choice.choiceKey ? "opacity-60 cursor-wait" : "cursor-pointer"}
                      disabled:opacity-50
                    `}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-slate-200 font-sans leading-snug">
                        {choice.choiceText}
                      </span>
                      {choice.isPremium && (
                        <div className="flex-shrink-0 flex items-center gap-1 bg-amber-500/20 text-amber-400 text-xs font-sans font-semibold px-2 py-0.5 rounded-full border border-amber-500/30">
                          <Gem className="w-3 h-3" />
                          {choice.priceGems}
                        </div>
                      )}
                    </div>
                    {effectParts.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {effectParts.map((part, i) => (
                          <span
                            key={i}
                            className="text-xs font-sans text-slate-500 bg-white/3 px-2 py-0.5 rounded"
                          >
                            {part}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}

              {/* Locked choices */}
              {lockedChoices.length > 0 && (
                <div className="mt-2 space-y-2">
                  {lockedChoices.map((choice) => (
                    <div
                      key={choice.choiceKey}
                      className="w-full text-left rounded-xl border border-white/3 bg-white/1 p-4 opacity-40 cursor-not-allowed"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-slate-500 font-sans text-sm leading-snug line-through">
                          {choice.choiceText}
                        </span>
                        <span className="text-xs font-sans text-slate-600 flex-shrink-0">
                          🔒 Locked
                        </span>
                      </div>
                      {choice.effectsSummary && (
                        <div className="text-xs font-sans text-slate-600 mt-1">
                          {choice.effectsSummary}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Stats */}
          {Object.keys(state.stats).length > 0 && (
            <div className="mt-10 pt-6 border-t border-white/5">
              <div className="text-xs font-sans uppercase tracking-widest text-slate-600 mb-3">
                Your Stats
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(state.stats).map(([stat, val]) => (
                  <StatPill key={stat} stat={stat} value={val} />
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Sidebar panels */}
        <aside className="hidden lg:block w-72 shrink-0 py-8 pr-4">
          <div className="sticky top-20 space-y-4">
            {/* Relationships panel */}
            {Object.keys(state.relationships).length > 0 && (
              <div className="bg-[#12121a] border border-white/5 rounded-xl p-4 space-y-4">
                <div className="text-xs font-sans font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  Relationships
                </div>
                {Object.entries(state.relationships).map(([char, stats]) => (
                  <RelationshipBar key={char} name={char} stats={stats} />
                ))}
              </div>
            )}

            {/* Flags panel */}
            {state.flags.length > 0 && (
              <div className="bg-[#12121a] border border-white/5 rounded-xl p-4">
                <div className="text-xs font-sans font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  Story Flags
                </div>
                <div className="space-y-1.5">
                  {state.flags.map((f) => (
                    <div
                      key={f}
                      className="text-xs font-sans text-emerald-400 flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                      {f.replace(/_/g, " ")}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inventory */}
            {state.inventory.length > 0 && (
              <div className="bg-[#12121a] border border-white/5 rounded-xl p-4">
                <div className="text-xs font-sans font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-400" />
                  Inventory
                </div>
                <div className="space-y-1.5">
                  {state.inventory.map((item) => (
                    <div
                      key={item}
                      className="text-xs font-sans text-amber-400 flex items-center gap-1.5"
                    >
                      <span>📦</span>
                      {item.replace(/_/g, " ")}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Mobile: Relationship panel (drawer) */}
      {showRelationships && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowRelationships(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-[#12121a] border-t border-white/10 rounded-t-2xl p-6 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-sans font-semibold text-white flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400" />
                Relationships & Stats
              </h3>
              <button
                onClick={() => setShowRelationships(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            {Object.entries(state.relationships).map(([char, stats]) => (
              <div key={char} className="mb-5">
                <RelationshipBar name={char} stats={stats} />
              </div>
            ))}
            {Object.keys(state.stats).length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/5">
                <div className="text-xs font-sans text-slate-500 uppercase tracking-wider mb-3">
                  Your Stats
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(state.stats).map(([stat, val]) => (
                    <StatPill key={stat} stat={stat} value={val} />
                  ))}
                </div>
              </div>
            )}
            {state.flags.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/5">
                <div className="text-xs font-sans text-slate-500 uppercase tracking-wider mb-3">
                  Story Flags
                </div>
                <div className="flex flex-wrap gap-2">
                  {state.flags.map((f) => (
                    <span
                      key={f}
                      className="text-xs font-sans text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full"
                    >
                      ✓ {f.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile: History panel (drawer) */}
      {showHistory && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowHistory(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-[#12121a] border-t border-white/10 rounded-t-2xl p-6 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-sans font-semibold text-white flex items-center gap-2">
                <Scroll className="w-4 h-4 text-purple-400" />
                Choice History
              </h3>
              <button
                onClick={() => setShowHistory(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            {steps.length === 0 ? (
              <p className="text-slate-500 font-sans text-sm">No choices yet.</p>
            ) : (
              <div className="space-y-3">
                {steps
                  .filter((s) => s.choiceText)
                  .map((s, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 text-sm font-sans"
                    >
                      <span className="text-purple-400 mt-0.5 flex-shrink-0">✓</span>
                      <div>
                        <span className="text-slate-300">{s.choiceText}</span>
                        <div className="text-xs text-slate-600 mt-0.5">
                          Ch. {s.chapterNumber}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
