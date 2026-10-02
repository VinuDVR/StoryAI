import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

type CoverInput = {
  title: string;
  description: string;
  genres: string[];
  fallbackUrl: string;
};

function fileSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function generateCoverImage({
  title,
  description,
  genres,
  fallbackUrl,
}: CoverInput) {
  const prompt = [
    `Create a cinematic illustrated book cover for the story titled "${title}".`,
    `Story premise: ${description}`,
    `Genres: ${genres.join(", ")}.`,
    "Portrait composition, atmospheric lighting, striking focal subject, premium editorial fantasy-fiction cover art.",
    "Do not include any text, letters, logos, borders, watermarks, or typography in the image.",
  ].join(" ");

  if (process.env.IMAGE_PROVIDER === "pollinations") {
    try {
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=768&height=1024&nologo=true&model=flux`;
      const response = await fetch(imageUrl);
      if (!response.ok) {
        console.error("Free cover generation failed:", response.status, await response.text());
        return fallbackUrl;
      }

      const coversDirectory = path.join(process.cwd(), "public", "covers");
      const filename = `${fileSlug(title)}.jpg`;
      await mkdir(coversDirectory, { recursive: true });
      await writeFile(path.join(coversDirectory, filename), Buffer.from(await response.arrayBuffer()));
      return `/covers/${filename}`;
    } catch (error) {
      console.error("Free cover generation error:", error);
      return fallbackUrl;
    }
  }

  const openRouterApiKey = process.env.OPENROUTER_API_KEY;
  const apiKey = openRouterApiKey ?? process.env.OPENAI_API_KEY;
  if (!apiKey) return fallbackUrl;

  try {
    const isOpenRouter = Boolean(openRouterApiKey);
    const response = await fetch(
      isOpenRouter
        ? "https://openrouter.ai/api/v1/chat/completions"
        : "https://api.openai.com/v1/images/generations",
      {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        ...(isOpenRouter && { "HTTP-Referer": "http://localhost:3000", "X-Title": "StoryWeave" }),
      },
      body: JSON.stringify(
        isOpenRouter
          ? {
              model: process.env.OPENROUTER_IMAGE_MODEL ?? "google/gemini-2.5-flash-image",
              messages: [{ role: "user", content: prompt }],
              modalities: ["text", "image"],
              max_tokens: 1024,
            }
          : { model: "gpt-image-1", prompt, size: "1024x1536", quality: "medium" }
      ),
      }
    );

    if (!response.ok) {
      console.error("Cover generation failed:", response.status, await response.text());
      return fallbackUrl;
    }

    const result = (await response.json()) as {
      data?: Array<{ b64_json?: string }>;
      choices?: Array<{ message?: { images?: Array<{ image_url?: { url?: string } }> } }>;
    };
    const openRouterImage = result.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    const imageBase64 = result.data?.[0]?.b64_json ?? openRouterImage?.replace(/^data:image\/\w+;base64,/, "");
    if (!imageBase64) return fallbackUrl;

    const coversDirectory = path.join(process.cwd(), "public", "covers");
    const filename = `${fileSlug(title)}.png`;
    await mkdir(coversDirectory, { recursive: true });
    await writeFile(path.join(coversDirectory, filename), Buffer.from(imageBase64, "base64"));
    return `/covers/${filename}`;
  } catch (error) {
    console.error("Cover generation error:", error);
    return fallbackUrl;
  }
}