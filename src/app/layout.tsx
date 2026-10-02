import type { Metadata } from "next";
import type { ReactNode } from "react";
import Header from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "StoryWeave — interactive stories where every choice echoes",
  description:
    "Step into romance, mystery, fantasy, horror and sci-fi stories where your choices change relationships, unlock secrets and decide the ending.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <Header />
        {children}
        <footer className="mx-auto mt-24 max-w-6xl border-t border-white/5 px-6 py-10 text-sm text-zinc-500">
          <p>StoryWeave. Your choices are remembered, even when the story doesn&apos;t say so.</p>
        </footer>
      </body>
    </html>
  );
}
