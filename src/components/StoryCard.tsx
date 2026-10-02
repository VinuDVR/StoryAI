import Link from "next/link";

export interface StoryCardData {
  slug: string;
  title: string;
  tagline: string;
  genres: string[];
  ageRating: string;
  coverFrom: string;
  coverTo: string;
  coverEmoji: string;
  coverImageUrl: string | null;
  chapterCount: number;
  endingCount: number;
  isPremium: boolean;
}

export function Cover({
  from,
  to,
  emoji,
  image,
  className = "",
}: {
  from: string;
  to: string;
  emoji: string;
  image: string | null;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: `linear-gradient(145deg, ${from}, ${to})` }}
    >
      <span className="absolute inset-0 grid place-items-center text-6xl opacity-40">{emoji}</span>
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      )}
    </div>
  );
}

export default function StoryCard({ story, found = 0 }: { story: StoryCardData; found?: number }) {
  return (
    <Link
      href={`/story/${story.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:border-white/25"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <Cover
          from={story.coverFrom}
          to={story.coverTo}
          emoji={story.coverEmoji}
          image={story.coverImageUrl}
          className="h-full w-full transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0a12] via-[#0b0a12]/40 to-transparent" />
        <div className="absolute left-3 top-3 flex gap-2">
          <span className="rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-zinc-200 backdrop-blur">
            {story.ageRating}
          </span>
          {story.isPremium && (
            <span className="rounded-full bg-amber-400/20 px-2.5 py-1 text-xs font-medium text-amber-200 backdrop-blur">
              💎 Secret choices
            </span>
          )}
        </div>
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h3 className="font-story text-2xl font-semibold leading-tight text-white">{story.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-zinc-300">{story.tagline}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-1.5 px-5 py-4">
        {story.genres.map((g) => (
          <span key={g} className="rounded-full border border-white/10 px-2.5 py-0.5 text-xs text-zinc-300">
            {g}
          </span>
        ))}
        <span className="ml-auto text-xs text-zinc-500">
          {found > 0 ? `${found}/${story.endingCount} endings` : `${story.endingCount} endings`}
        </span>
      </div>
    </Link>
  );
}
