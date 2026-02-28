import { Check, X } from "lucide-react";
import Link from "next/link";

export const metadata = {
    title: "Pricing | Breakout AI",
    description: "Upgrade to Breakout AI Pro for Institutional Level Research.",
};

export default function PricingPage() {
    return (
        <div className="max-w-6xl mx-auto py-20 px-6 font-sans">
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 mb-6 bg-blue-50 text-blue-700 border border-blue-200 px-4 py-1.5 rounded-sm">
                    <span className="font-semibold text-xs tracking-widest uppercase">Select Access Level</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 font-serif tracking-tight text-slate-900">
                    Institutional Data, <span className="text-blue-600">Retail Premium.</span>
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                    Access the exact quantitative signals Wall Street relies on. <br />
                    Secure your edge in the global equities market.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">

                {/* Tier 1: Daily */}
                <div className="bg-white border border-slate-200 rounded-sm p-8 relative shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 font-serif">Daily Terminal</h3>
                    <p className="text-slate-500 text-sm mb-6 h-10">24-hour access to today's #1 asymmetrical breakout setup.</p>
                    <div className="mb-6">
                        <span className="text-4xl font-extrabold text-slate-900">$9.99</span>
                        <span className="text-slate-400">/day</span>
                    </div>
                    <Link href="/api/checkout/daily" className="block w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 rounded-sm transition-colors mb-8 text-sm uppercase tracking-wider">
                        Request 24h Access
                    </Link>
                    <ul className="space-y-4 text-sm text-slate-600">
                        <li className="flex gap-3"><Check className="text-blue-600 w-5 h-5 shrink-0" /> Today's #1 Institutional Pick</li>
                        <li className="flex gap-3"><Check className="text-blue-600 w-5 h-5 shrink-0" /> Deep Fundamental Analysis Report</li>
                        <li className="flex gap-3"><Check className="text-blue-600 w-5 h-5 shrink-0" /> Technical DMA Breakout Levels</li>
                        <li className="flex gap-3 text-slate-400"><X className="w-5 h-5 shrink-0" /> Historical Pick Archive</li>
                        <li className="flex gap-3 text-slate-400"><X className="w-5 h-5 shrink-0" /> Pre-Market SMS Alerts</li>
                    </ul>
                </div>

                {/* Tier 2: Monthly (Highlighted - Decoy Effect) */}
                <div className="bg-slate-900 border-2 border-slate-900 rounded-sm p-8 relative transform md:-translate-y-4 shadow-xl">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-sm text-xs font-bold tracking-widest uppercase">
                        Institutional Standard
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 font-serif">Pro Monthly</h3>
                    <p className="text-slate-400 text-sm mb-6 h-10">Continuous daily signals. Less than $1 a day to hedge your portfolio risk.</p>
                    <div className="mb-6">
                        <span className="text-5xl font-extrabold text-white">$29.99</span>
                        <span className="text-slate-400">/mo</span>
                    </div>
                    <Link href="/api/checkout/monthly" className="block w-full text-center bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-sm transition-colors mb-8 shadow-lg shadow-blue-600/20 text-sm uppercase tracking-widest">
                        Activate Monthly
                    </Link>
                    <ul className="space-y-4 text-sm text-slate-300 font-medium">
                        <li className="flex gap-3"><Check className="text-blue-400 w-5 h-5 shrink-0" /> <strong>All Daily Terminal Features</strong></li>
                        <li className="flex gap-3"><Check className="text-blue-400 w-5 h-5 shrink-0" /> Unrestricted Historical Archive Access</li>
                        <li className="flex gap-3"><Check className="text-blue-400 w-5 h-5 shrink-0" /> Automated Live ROI Tracking</li>
                        <li className="flex gap-3 font-bold text-white"><Check className="text-blue-400 w-5 h-5 shrink-0" /> Pre-Market Email & SMS Alerts</li>
                        <li className="flex gap-3 font-bold text-white"><Check className="text-blue-400 w-5 h-5 shrink-0" /> Priority Algorithmic Execution Ideas</li>
                    </ul>
                </div>

                {/* Tier 3: Yearly */}
                <div className="bg-white border border-slate-200 rounded-sm p-8 relative shadow-sm hover:shadow-md transition-shadow">
                    <div className="absolute top-4 right-4 bg-green-100 text-green-700 px-3 py-1 rounded-sm text-xs font-bold border border-green-200 uppercase tracking-wider">
                        Save 16%
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 font-serif">Pro Yearly</h3>
                    <p className="text-slate-500 text-sm mb-6 h-10">The logical choice for long-term capital allocators. Save 2 months.</p>
                    <div className="mb-6 flex flex-col">
                        <span className="text-slate-400 line-through text-sm mb-1">$359.88</span>
                        <div>
                            <span className="text-4xl font-extrabold text-slate-900">$299.99</span>
                            <span className="text-slate-400">/yr</span>
                        </div>
                    </div>
                    <Link href="/api/checkout/yearly" className="block w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 rounded-sm transition-colors mb-8 text-sm uppercase tracking-wider">
                        Commit Annually
                    </Link>
                    <ul className="space-y-4 text-sm text-slate-600">
                        <li className="flex gap-3"><Check className="text-blue-600 w-5 h-5 shrink-0" /> <strong>All Pro Monthly Features</strong></li>
                        <li className="flex gap-3"><Check className="text-blue-600 w-5 h-5 shrink-0" /> Downloadable PDF Research Briefs</li>
                        <li className="flex gap-3"><Check className="text-blue-600 w-5 h-5 shrink-0" /> Direct Premium Support Line</li>
                        <li className="flex gap-3 opacity-0 hidden md:block"><Check className="w-5 h-5 shrink-0" /> Spacer</li>
                    </ul>
                </div>

            </div>

            {/* Security & Support Footer */}
            <div className="mt-20 text-center border-t border-slate-200 pt-10">
                <p className="text-slate-500 text-sm flex items-center justify-center gap-2 font-medium">
                    🔒 Encrypted Institutional Transactions Processed by <strong className="text-slate-800">Lemon Squeezy</strong>.
                </p>
            </div>
        </div>
    );
}
