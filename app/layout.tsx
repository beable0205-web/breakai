import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google"; // Changed font
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] }); // Initialize font

export const metadata: Metadata = {
  title: "Truth of Market | Wall Street Lies Exposed",
  description: "Data-driven financial analysis powered by AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${jetbrainsMono.className} bg-black text-white antialiased`}>
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="border-b border-[#333] py-4 px-6 flex justify-between items-center bg-[#0a0a0a]">
            <h1 className="text-xl font-bold tracking-tighter text-[#00FF41]">
              TRUTH_OF_MARKET<span className="animate-pulse">_</span>
            </h1>
            <nav className="flex items-center text-sm text-gray-400 font-medium font-mono" style={{ display: 'flex', alignItems: 'center' }}>
              <span className="cursor-pointer hover:text-white" style={{ marginRight: '2rem' }}>REPORTS</span>
              <span className="cursor-pointer hover:text-white" style={{ marginRight: '2rem' }}>ABOUT</span>
              <span className="border border-[#00FF41] text-[#00FF41] px-3 py-1 rounded hover:bg-[#00FF41] hover:text-black transition cursor-pointer">
                SUBSCRIBE
              </span>
            </nav>
          </header>

          {/* Main Content */}
          <main className="flex-grow p-6">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t border-[#333] py-6 text-center text-xs text-gray-500">
            © 2026 Truth of Market. Not Financial Advice.
          </footer>
        </div>
      </body>
    </html>
  );
}