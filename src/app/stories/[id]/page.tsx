import { db } from "@/db";
import { stories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, Sparkles, Clock, Users, Star } from "lucide-react";
import StartStoryButton from "./StartStoryButton";

export const dynamic = "force-dynamic";

const genreColors: Record<string, string> = {
  Romance: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  Mystery: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Supernatural: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  Heist: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  Thriller: "bg-red-500/20 text-red-300 border-red-500/30",
  Comedy: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  Fantasy: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  Adventure: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
};

export default async function StoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const storyId = parseInt(id, 10);

  const [story] = await db.select().from(stories).where(eq(stories.id, storyId));
  if (!story) notFound();

  const characters = story.meta.characters as Array<{
    id: string;
    name: string;
    role: string;
    blurb: string;
    rel?: string[];
  }>;

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Back */}
      <div className="max-w-4xl mx-auto px-6 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-sans text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          All Stories
        </Link>
      </div>

      {/* Hero Cover */}
      <div className="relative max-w-4xl mx-auto px-6 pt-6">
        <div className="relative rounded-2xl overflow-hidden h-72 md:h-96">
          {story.coverImageUrl ? (
            <img
              src={story.coverImageUrl}
              alt={story.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-900/50 to-slate-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/40 to-transparent" />

          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex flex-wrap gap-2 mb-3">
              {(story.genres as string[]).map((g) => (
                <span
                  key={g}
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-sans font-medium border ${genreColors[g] ?? "bg-slate-500/20 text-slate-300 border-slate-500/30"}`}
                >
                  {g}
                </span>
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              {story.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="md:col-span-2 space-y-6">
            <p className="text-slate-300 leading-relaxed font-sans">{story.description}</p>

            {/* Characters */}
            {characters.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  Characters
                </h2>
                <div className="space-y-3">
                  {characters.map((char) => (
                    <div
                      key={char.id}
                      className="bg-[#12121a] border border-white/5 rounded-xl p-4"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-white">{char.name}</span>
                        <span className="text-xs font-sans text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
                          {char.role}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 font-sans">{char.blurb}</p>
                      {char.rel && char.rel.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {char.rel.map((s) => (
                            <span key={s} className="text-xs font-sans text-slate-500 bg-white/5 px-2 py-0.5 rounded">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Butterfly Effect Info */}
            <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-5">
              <h3 className="font-semibold text-purple-300 mb-2 font-sans flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Butterfly Effect System
              </h3>
              <p className="text-sm text-slate-400 font-sans leading-relaxed">
                Every choice you make — who you trust, who you lie to, who you save — echoes through the entire story. Relationship stats, hidden flags, and player choices combine to unlock different scenes, alter character behaviour, and determine your ending.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Stats */}
            <div className="bg-[#12121a] border border-white/5 rounded-xl p-4 space-y-3 font-sans">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" /> Chapters
                </span>
                <span className="text-white font-medium">{story.chapterCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5" /> Endings
                </span>
                <span className="text-white font-medium">{story.endingCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Rating
                </span>
                <span className="text-white font-medium">{story.ageRating}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Starting Gems
                </span>
                <span className="text-amber-400 font-medium">💎 50</span>
              </div>
            </div>

            <StartStoryButton storyId={story.id} />

            <p className="text-xs text-slate-600 font-sans text-center">
              You can replay with different choices to discover all endings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
