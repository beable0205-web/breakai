import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TopNav from "./components/TopNav";
import DisableCopy from "@/components/DisableCopy";
import PromoBanner from "./components/PromoBanner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Breakout AI | Institutional Screener",
  description: "Data-driven financial analysis powered by AI.",
};

import { GoogleTagManager } from '@next/third-parties/google';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId="GTM-W9538SHJ" />
      <body className={`${inter.className} bg-black text-slate-200 antialiased min-h-screen flex flex-col selection:bg-[#00FF41]/30 font-sans`}>
        <DisableCopy />
        <div className="flex-grow flex flex-col">
          <PromoBanner />
          {/* Header */}
          <TopNav />

          {/* Main Content */}
          <main className="flex-grow">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t border-[#333] py-8 text-center text-xs text-zinc-500 font-semibold uppercase tracking-widest bg-[#0a0a0c]">
            © 2026 Breakout AI. Institutional Research. Not Financial Advice.
          </footer>
        </div>
      </body>
    </html>
  );
}