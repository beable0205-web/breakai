import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TopNav from "./components/TopNav";
import DisableCopy from "@/components/DisableCopy";
import PromoBanner from "./components/PromoBanner";
import CookieConsent from "./components/CookieConsent";
import Link from "next/link";

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
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4633321310054654" crossOrigin="anonymous"></script>
        <meta name="google-adsense-account" content="ca-pub-4633321310054654" />
      </head>
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
          <footer className="border-t border-[#333] py-12 bg-[#050505]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center md:items-start gap-8">

              {/* Brand & Copyright */}
              <div className="flex flex-col items-center md:items-start space-y-2">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00FF41] to-emerald-600 tracking-tighter">
                  BREAKOUT AI
                </span>
                <p className="text-xs text-zinc-500 font-semibold uppercase tracking-widest">
                  © {new Date().getFullYear()} Breakout AI. All rights reserved.
                </p>
                <p className="text-xs text-zinc-600 max-w-sm text-center md:text-left mt-2">
                  Institutional Research. Not Financial Advice. Please consult a professional before investing.
                </p>
              </div>

              {/* Legal & Navigation Links */}
              <div className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-4 text-sm font-semibold text-zinc-400">
                <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
                <a href="mailto:contact@breakout.ai" className="hover:text-white transition-colors">Contact</a>
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                <Link href="/disclaimer" className="hover:text-rose-400 transition-colors">Disclaimer</Link>
              </div>
            </div>
          </footer>
          <CookieConsent />
        </div>
      </body>
    </html>
  );
}