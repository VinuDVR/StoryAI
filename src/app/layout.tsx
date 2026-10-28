import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Playfair_Display } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });

export const metadata: Metadata = {
  title: "Tessera — small choices, bigger pictures",
  description:
    "Step into romance, mystery, fantasy, horror and sci-fi stories where your choices change relationships, unlock secrets and decide the ending.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable + " " + playfair.variable}>
      <body className="min-h-screen antialiased">
        <Header />
        {children}
        <footer className="mx-auto mt-24 max-w-6xl border-t border-white/5 px-6 py-10 text-sm text-zinc-500">
          <p>Tessera. Every decision is a piece of the bigger story.</p>
        </footer>
      </body>
    </html>
  );
}
