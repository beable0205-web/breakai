import { Check, X, Shield, Zap, TrendingUp } from "lucide-react";
import Link from "next/link";

export const metadata = {
    title: "Pricing | Breakout AI",
    description: "Upgrade to Breakout AI Pro for Institutional Level Research.",
};

export default function PricingPage() {
    return (
        <div className="max-w-6xl mx-auto py-24 px-6 font-sans selection:bg-[#00FF41]/30">
            {/* Header Section */}
            <div className="text-center mb-20 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00FF41]/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
                <div className="inline-flex items-center gap-2 mb-6 bg-emerald-950/30 text-[#00FF41] border border-[#00FF41]/30 px-5 py-2 rounded-full shadow-[0_0_15px_rgba(0,255,65,0.15)]">
                    <span className="w-2 h-2 rounded-full bg-[#00FF41] animate-pulse"></span>
                    <span className="font-bold text-xs tracking-widest uppercase font-mono">Select Access Level</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter text-white">
                    Institutional Data, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF41] to-emerald-600">Retail Premium.</span>
                </h1>
                <p className="text-xl text-zinc-400 max-w-2xl mx-auto font-mono leading-relaxed">
                    Access the exact quantitative signals Wall Street relies on.<br />
                    Secure your edge in the global equities market.
                </p>
            </div>

            {/* Pricing Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch relative z-10">

                {/* Tier 1: Daily */}
                <div className="bg-[#0a0a0c] border border-zinc-800 rounded-2xl p-8 relative flex flex-col hover:border-zinc-700 transition-colors group">
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/10 to-transparent rounded-2xl pointer-events-none"></div>
                    <h3 className="text-2xl font-bold text-white mb-3 tracking-tight font-mono uppercase">Daily Terminal</h3>
                    <p className="text-zinc-500 text-sm mb-8 font-mono">24-hour access to today's #1 asymmetrical breakout setup.</p>
                    <div className="mb-8 flex items-baseline">
                        <span className="text-5xl font-black text-white font-mono">$9.99</span>
                        <span className="text-zinc-500 ml-2 font-mono uppercase tracking-widest text-xs">/ Day</span>
                    </div>
                    <Link href="/api/checkout/daily" className="block w-full text-center bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 hover:border-zinc-500 text-white font-bold py-4 rounded-xl transition-all mb-10 text-xs uppercase tracking-[0.2em] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                        Request 24h Access
                    </Link>
                    <ul className="space-y-5 text-sm text-zinc-400 font-mono mt-auto pt-8 border-t border-zinc-900">
                        <li className="flex items-start gap-3"><Check className="text-[#00FF41] w-5 h-5 shrink-0 mt-0.5" /> <span className="leading-snug">Today's #1 Institutional Pick</span></li>
                        <li className="flex items-start gap-3"><Check className="text-[#00FF41] w-5 h-5 shrink-0 mt-0.5" /> <span className="leading-snug">Deep Fundamental Analysis Report</span></li>
                        <li className="flex items-start gap-3"><Check className="text-[#00FF41] w-5 h-5 shrink-0 mt-0.5" /> <span className="leading-snug">Technical DMA Breakout Levels</span></li>
                        <li className="flex items-start gap-3 text-zinc-700"><X className="w-5 h-5 shrink-0 mt-0.5" /> <span className="leading-snug line-through">Historical Pick Archive</span></li>
                        <li className="flex items-start gap-3 text-zinc-700"><X className="w-5 h-5 shrink-0 mt-0.5" /> <span className="leading-snug line-through">Pre-Market SMS Alerts</span></li>
                    </ul>
                </div>

                {/* Tier 2: Monthly (Highlighted) */}
                <div className="bg-[#050505] border-2 border-[#00FF41]/40 rounded-2xl p-8 relative flex flex-col transform lg:-translate-y-6 shadow-[0_0_50px_rgba(0,255,65,0.05)] hover:shadow-[0_0_80px_rgba(0,255,65,0.1)] transition-shadow">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#00FF41] text-black px-6 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-[0_0_20px_rgba(0,255,65,0.4)] whitespace-nowrap">
                        <Zap className="w-3 h-3 inline-block mr-1.5 -mt-0.5" /> Institutional Standard
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-b from-[#00FF41]/5 to-transparent rounded-2xl pointer-events-none"></div>

                    <h3 className="text-3xl font-black text-[#00FF41] mb-3 tracking-tight uppercase font-mono mt-2">Pro Monthly</h3>
                    <p className="text-zinc-400 text-sm mb-8 font-mono">Continuous daily signals. Less than $1 a day to hedge your portfolio risk.</p>
                    <div className="mb-8 flex items-baseline">
                        <span className="text-6xl font-black text-white font-mono">$29.99</span>
                        <span className="text-zinc-500 ml-2 font-mono uppercase tracking-widest text-xs">/ Month</span>
                    </div>
                    <Link href="/api/checkout/monthly" className="block w-full text-center bg-[#00FF41] hover:bg-[#00FF41]/80 text-black font-black py-4 rounded-xl transition-all mb-10 shadow-[0_0_20px_rgba(0,255,65,0.2)] hover:shadow-[0_0_30px_rgba(0,255,65,0.4)] text-xs uppercase tracking-[0.2em]">
                        Activate Monthly
                    </Link>
                    <ul className="space-y-5 text-sm font-mono mt-auto pt-8 border-t border-zinc-800">
                        <li className="flex items-start gap-3 text-white"><Check className="text-[#00FF41] w-5 h-5 shrink-0 mt-0.5 drop-shadow-[0_0_8px_rgba(0,255,65,0.8)]" /> <span className="leading-snug font-bold">All Daily Terminal Features</span></li>
                        <li className="flex items-start gap-3 text-zinc-300"><Check className="text-[#00FF41] w-5 h-5 shrink-0 mt-0.5" /> <span className="leading-snug">Unrestricted Historical Archive Access</span></li>
                        <li className="flex items-start gap-3 text-zinc-300"><Check className="text-[#00FF41] w-5 h-5 shrink-0 mt-0.5" /> <span className="leading-snug">Automated Live ROI Tracking</span></li>
                        <li className="flex items-start gap-3 text-white"><Check className="text-[#00FF41] w-5 h-5 shrink-0 mt-0.5 drop-shadow-[0_0_8px_rgba(0,255,65,0.8)]" /> <span className="leading-snug font-bold">Pre-Market Email & SMS Alerts</span></li>
                        <li className="flex items-start gap-3 text-white"><Check className="text-[#00FF41] w-5 h-5 shrink-0 mt-0.5 drop-shadow-[0_0_8px_rgba(0,255,65,0.8)]" /> <span className="leading-snug font-bold">Priority Algorithmic Execution Ideas</span></li>
                    </ul>
                </div>

                {/* Tier 3: Yearly */}
                <div className="bg-[#0a0a0c] border border-zinc-800 rounded-2xl p-8 relative flex flex-col hover:border-zinc-700 transition-colors group">
                    <div className="absolute top-4 right-4 bg-emerald-950/40 text-[#00FF41] px-4 py-1.5 rounded-full text-[10px] font-black border border-[#00FF41]/20 uppercase tracking-widest shadow-lg">
                        Save 16%
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-bl from-zinc-800/10 to-transparent rounded-2xl pointer-events-none"></div>

                    <h3 className="text-2xl font-bold text-white mb-3 tracking-tight uppercase font-mono">Pro Yearly</h3>
                    <p className="text-zinc-500 text-sm mb-8 font-mono pr-12">The logical choice for long-term capital allocators. Save 2 months.</p>
                    <div className="mb-8 flex flex-col justify-center h-[72px]">
                        <span className="text-zinc-600 line-through text-xs mb-1 font-mono tracking-widest inline-block">$359.88</span>
                        <div className="flex items-baseline">
                            <span className="text-5xl font-black text-white font-mono">$299.99</span>
                            <span className="text-zinc-500 ml-2 font-mono uppercase tracking-widest text-xs">/ Year</span>
                        </div>
                    </div>
                    <Link href="/api/checkout/yearly" className="block w-full text-center bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 hover:border-zinc-500 text-white font-bold py-4 rounded-xl transition-all mb-10 text-xs uppercase tracking-[0.2em] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                        Commit Annually
                    </Link>
                    <ul className="space-y-5 text-sm text-zinc-400 font-mono mt-auto pt-8 border-t border-zinc-900">
                        <li className="flex items-start gap-3 text-white"><Check className="text-[#00FF41] w-5 h-5 shrink-0 mt-0.5" /> <span className="leading-snug font-bold">All Pro Monthly Features</span></li>
                        <li className="flex items-start gap-3"><Check className="text-[#00FF41] w-5 h-5 shrink-0 mt-0.5" /> <span className="leading-snug">Downloadable PDF Research Briefs</span></li>
                        <li className="flex items-start gap-3"><Check className="text-[#00FF41] w-5 h-5 shrink-0 mt-0.5" /> <span className="leading-snug">Direct Premium Support Line</span></li>
                        <li className="flex items-start gap-3 opacity-0 hidden lg:block"><Check className="w-5 h-5 shrink-0 mt-0.5" /> <span className="leading-snug">Spacer</span></li>
                    </ul>
                </div>

            </div>

            {/* Security & Support Footer */}
            <div className="mt-32 text-center pt-8 border-t border-zinc-900">
                <p className="text-zinc-500 text-xs flex items-center justify-center gap-3 font-mono uppercase tracking-widest">
                    <Shield className="w-4 h-4 text-[#00FF41]/70" /> Encrypted Institutional Transactions Processed by <strong className="text-white hover:text-[#00FF41] transition-colors cursor-pointer">Lemon Squeezy</strong>.
                </p>
            </div>
        </div>
    );
}
