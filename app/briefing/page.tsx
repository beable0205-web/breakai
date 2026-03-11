import { createClient } from "../../utils/supabase/server";
import Link from "next/link";
import { ArrowUpRight, Globe, Newspaper, BarChart3, Calendar } from "lucide-react";

export const metadata = {
    title: "Breakout AI | Daily Market Briefing",
    description: "Daily summaries of the US & Global stock markets, market-leading themes, and AI-driven investment insights.",
};

export const dynamic = "force-dynamic";

export default async function BriefingPage() {
    const supabaseServer = await createClient();

    // Fetch recent market summaries from Supabase
    const { data: summaries, error } = await supabaseServer
        .from('market_summaries')
        .select('*')
        .order('date', { ascending: false })
        .limit(30);

    return (
        <div className="min-h-screen bg-black text-slate-200 selection:bg-[#00FF41]/30 font-sans">
            {/* Hero Section */}
            <div className="relative pt-24 pb-16 border-b border-[#333] bg-[#0a0a0c] overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#00FF41]/5 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="inline-flex items-center gap-2 mb-8 bg-emerald-950/30 text-[#00FF41] border border-emerald-900/50 backdrop-blur-md px-4 py-2 rounded font-mono shadow-[0_0_20px_rgba(0,255,65,0.15)]">
                        <Globe className="w-3 h-3" />
                        <span className="font-bold text-xs tracking-widest uppercase">Global Market Intelligence</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black mb-5 tracking-tighter text-white leading-tight font-serif">
                        Daily Market Briefing.<br className="hidden md:block" />
                        Data that Commands the Market.
                    </h1>
                    <p className="text-lg md:text-xl text-zinc-400 max-w-3xl leading-relaxed mb-8">
                        Our Wall Street-grade prop trading AI analyzes key US and global market data daily, providing actionable insights right after the closing bell. Cut the noise and focus on what moves the market.
                    </p>
                </div>
            </div>

            {/* List Section */}
            <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">
                {/* Stats / Headers Bar */}
                <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 pb-4 border-b border-[#333] gap-4">
                    <div className="flex items-center gap-3">
                        <Newspaper className="w-6 h-6 text-zinc-400" />
                        <h2 className="text-2xl font-black tracking-tighter text-white uppercase">Briefing Archive</h2>
                    </div>
                </div>

                {error && (
                    <div className="p-6 bg-red-950/30 text-red-500 border border-red-900/50 rounded-sm flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-red-900/50 flex items-center justify-center shrink-0">
                            <span className="text-xl">⚠️</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-1">System Error</h3>
                            <p className="text-red-400/80">Failed to connect to the market briefing database.</p>
                        </div>
                    </div>
                )}

                {!error && (!summaries || summaries.length === 0) && (
                    <div className="h-64 border border-dashed border-zinc-800 rounded-sm flex flex-col items-center justify-center bg-[#0a0a0c]">
                        <BarChart3 className="w-12 h-12 text-zinc-700 mb-4" />
                        <h3 className="text-xl font-bold text-zinc-400 mb-2">Awaiting Data</h3>
                        <p className="text-zinc-600 text-center max-w-md">No market briefings have been generated yet.</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {summaries && summaries.map((summary, i) => {
                        const isLatest = i === 0;
                        const dateObj = new Date(summary.date);
                        const formattedDate = dateObj.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            weekday: 'short'
                        });

                        const cleanTitle = summary.title.replace(/\*\*/g, '').trim();

                        return (
                            <Link href={`/briefing/${summary.id}`} key={summary.id} className="block group">
                                <div className={`relative flex flex-col h-full bg-[#0a0a0c] border transition-all duration-300 rounded overflow-hidden ${isLatest ? 'border-[#00FF41]/50 shadow-[0_0_30px_rgba(0,255,65,0.1)] hover:border-[#00FF41]' : 'border-zinc-800 hover:border-zinc-600'}`}>
                                    {isLatest && (
                                        <div className="absolute top-0 right-0 max-w-[200px] overflow-hidden z-10">
                                            <div className="bg-[#00FF41] text-black text-[10px] font-bold uppercase tracking-widest py-1 px-8 translate-x-6 translate-y-3 rotate-45 shadow-lg text-center">
                                                LATEST UPDATE
                                            </div>
                                        </div>
                                    )}

                                    {/* Date Header */}
                                    <div className={`p-4 border-b flex items-center gap-2 ${isLatest ? 'bg-emerald-950/20 border-emerald-900/40' : 'bg-black border-zinc-900'}`}>
                                        <Calendar className={`w-4 h-4 ${isLatest ? 'text-[#00FF41]' : 'text-zinc-500'}`} />
                                        <span className={`text-xs font-mono font-bold tracking-widest ${isLatest ? 'text-[#00FF41]' : 'text-zinc-400'}`}>
                                            {formattedDate.toUpperCase()}
                                        </span>
                                    </div>

                                    {/* Body */}
                                    <div className="p-6 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className={`text-xl font-bold mb-3 leading-snug group-hover:text-white transition-colors font-serif line-clamp-3 ${isLatest ? 'text-white' : 'text-zinc-300'}`}>
                                                {cleanTitle}
                                            </h3>

                                            {/* Preview Snippet */}
                                            <p className="text-sm text-zinc-500 line-clamp-4 leading-relaxed mb-6 font-mono">
                                                {summary.content.replace(/[#*]/g, '').substring(0, 150)}...
                                            </p>
                                        </div>

                                        {/* View Button Footer */}
                                        <div className="flex justify-start items-center pt-4 border-t border-[#222]">
                                            <span className={`inline-flex items-center text-xs font-bold tracking-widest uppercase transition-colors ${isLatest ? 'text-[#00FF41]' : 'text-zinc-400 group-hover:text-white'}`}>
                                                Read Report
                                                <ArrowUpRight className="ml-2 w-4 h-4" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
