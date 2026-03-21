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
  metadataBase: new URL("https://getbreakai.com"),
  title: "Breakout AI | Institutional Screener",
  description: "Data-driven financial analysis powered by AI.",
  verification: {
    google: "4jfIIAQMyMe7vlLvtK9VK2tJd1XOoYY8gE53njyfd1A",
  },
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
        <link rel="alternate" type="application/rss+xml" title="Breakout AI RSS Feed" href="https://getbreakai.com/rss.xml" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4633321310054654" crossOrigin="anonymous"></script>
        <meta name="google-adsense-account" content="ca-pub-4633321310054654" />
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "vpuc9rq5pt");
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-PSP7MPZ9');
            `,
          }}
        />
      </head>
      <GoogleTagManager gtmId="GTM-W9538SHJ" />
      <body className={`${inter.className} bg-black text-slate-200 antialiased min-h-screen flex flex-col selection:bg-[#00FF41]/30 font-sans`}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PSP7MPZ9"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
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
                <a href="mailto:beable9489@gmail.com" className="hover:text-white transition-colors">Contact</a>
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