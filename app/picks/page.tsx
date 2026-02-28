import { createClient } from "../../utils/supabase/server";
import Link from "next/link";
import { ArrowUpRight, Cpu, Activity, TrendingUp, Presentation } from "lucide-react";
import { fetchLiveQuote } from "../../utils/yahooFinance";

export const metadata = {
    title: "Truth of Market | Institutional Grade Stock Screener",
    description: "Our AI scans 1,000+ top US stocks daily to find the single best William O'Neil Cup & Handle setup.",
};

export const dynamic = "force-dynamic";

export default async function PicksPage() {
    const supabaseServer = await createClient();

    // Fetch recent picks from Supabase
    const { data: picks, error } = await supabaseServer
        .from('oneil_picks')
        .select('*')
        .order('pick_date', { ascending: false })
        .limit(20);

    // Fetch live quotes for all picks in parallel
    const picksWithPrices = await Promise.all((picks || []).map(async (pick) => {
        const livePrice = await fetchLiveQuote(pick.ticker);
        let roi = null;
        if (livePrice && pick.picked_price) {
            roi = ((livePrice - pick.picked_price) / pick.picked_price) * 100;
        }
        return { ...pick, livePrice, roi };
    }));

    return (
        <div className="min-h-screen bg-black text-slate-200 selection:bg-[#00FF41]/30 font-sans">
            {/* Hero Section */}
            <div className="relative pt-20 pb-12 border-b border-[#333] bg-[#0a0a0c]">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00FF41]/5 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="inline-flex items-center gap-3 mb-6 bg-emerald-950/30 text-[#00FF41] border border-emerald-900/50 px-4 py-2 rounded font-mono shadow-[0_0_15px_rgba(0,255,65,0.1)]">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF41] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00FF41]"></span>
                        </span>
                        <span className="font-bold text-xs tracking-widest uppercase">Truth of Market Matrix</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter text-white leading-tight font-serif">
                        One Stock. <br className="hidden md:block" />
                        Maximum Asymmetry.
                    </h1>
                    <p className="text-lg md:text-xl text-zinc-400 max-w-3xl leading-relaxed mb-8">
                        Our proprietary algorithm scans the top 1,000 highly liquid US equities daily. We identify the single highest-probability technical breakout, backed by profound fundamental research.
                    </p>
                </div>
            </div>

            {/* List Section */}
            <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">

                {/* Stats / Headers Bar */}
                <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 pb-4 border-b border-[#333] gap-4">
                    <div className="flex items-center gap-3">
                        <Presentation className="w-6 h-6 text-zinc-400" />
                        <h2 className="text-2xl font-black tracking-tighter text-white uppercase">Historical Signals</h2>
                    </div>
                    <div className="text-zinc-500 text-sm font-bold uppercase tracking-widest flex gap-6">
                        <span className="flex items-center gap-1">Universe: Top 1000 US</span>
                    </div>
                </div>

                {error && (
                    <div className="p-6 bg-red-950/30 text-red-500 border border-red-900/50 rounded-sm flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-red-900/50 flex items-center justify-center shrink-0">
                            <span className="text-xl">⚠️</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-1">System Error</h3>
                            <p className="text-red-400/80">Failed to connect to the signal database.</p>
                        </div>
                    </div>
                )}

                {!error && picksWithPrices.length === 0 && (
                    <div className="h-64 border border-dashed border-zinc-800 rounded-sm flex flex-col items-center justify-center bg-[#0a0a0c]">
                        <Activity className="w-12 h-12 text-zinc-700 mb-4" />
                        <h3 className="text-xl font-bold text-zinc-400 mb-2">Awaiting Signals</h3>
                        <p className="text-zinc-600 text-center max-w-md">The algorithm has not detected any verified institutional breakouts today. Quality over quantity.</p>
                    </div>
                )}

                <div className="flex flex-col gap-4">
                    {picksWithPrices.map((pick, i) => {
                        let details = `Score: ${pick.oneil_score}`;
                        if (pick.technical_details && typeof pick.technical_details === 'object') {
                            const msg = (pick.technical_details as any).message;
                            details = msg || details;
                        }

                        // Top card styling
                        const isLatest = i === 0;

                        return (
                            <Link
                                key={pick.id}
                                href={`/picks/${pick.id}`}
                                className={`group flex flex-col md:flex-row items-start md:items-center justify-between p-6 border transition-all duration-300 relative overflow-hidden ${isLatest
                                    ? "bg-zinc-900/50 border-[#00FF41]/30 hover:shadow-[0_0_30px_rgba(0,255,65,0.1)]"
                                    : "bg-black border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900/30"
                                    }`}
                            >
                                {isLatest && <div className="absolute left-0 top-0 w-1 h-full bg-[#00FF41]"></div>}

                                {/* Ticker and Date */}
                                <div className="flex items-center gap-6 md:w-1/4 mb-6 md:mb-0 relative z-10 w-full ml-2">
                                    <div className={`w-16 h-16 flex items-center justify-center rounded font-serif font-black text-2xl shrink-0 ${isLatest ? "bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30" : "bg-zinc-900 text-zinc-500 border border-zinc-800"
                                        }`}>
                                        {pick.ticker.substring(0, 2)}
                                    </div>
                                    <div>
                                        {isLatest && <span className="text-[#00FF41] text-[10px] font-bold tracking-widest uppercase mb-1 flex items-center gap-1 font-mono"><Activity className="w-3 h-3" /> Active Pick</span>}
                                        <h3 className={`text-4xl font-serif font-black tracking-tight leading-none mb-1 ${isLatest ? 'text-white' : 'text-zinc-300'} group-hover:text-white transition-colors`}>
                                            {pick.ticker}
                                        </h3>
                                        <p className={`text-sm font-mono uppercase tracking-widest ${isLatest ? 'text-zinc-400' : 'text-zinc-600'}`}>
                                            {new Date(pick.pick_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>

                                {/* Setup Details */}
                                <div className="md:flex-1 md:px-8 relative z-10 mb-6 md:mb-0 w-full">
                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest font-mono ${isLatest ? "bg-emerald-950/50 text-[#00FF41] border border-[#00FF41]/20" : "bg-zinc-900 text-zinc-500 border border-zinc-800"} rounded`}>
                                            Algo Score: {pick.oneil_score}/100
                                        </span>
                                    </div>
                                    <p className={`text-sm line-clamp-2 md:line-clamp-2 leading-relaxed font-mono ${isLatest ? 'text-zinc-300' : 'text-zinc-500'}`}>
                                        {details}
                                    </p>
                                </div>

                                {/* ROI Display */}
                                <div className={`md:w-auto relative z-10 w-full flex items-center justify-between md:justify-end gap-8 border-t md:border-none pt-4 md:pt-0 ${isLatest ? 'border-zinc-800' : 'border-[#222]'}`}>
                                    <div className="text-left md:text-right hidden sm:block">
                                        <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 font-mono ${isLatest ? 'text-zinc-400' : 'text-zinc-600'}`}>Current Return</p>
                                        <div className="flex items-baseline gap-2 justify-start md:justify-end">
                                            {pick.roi !== null ? (
                                                <>
                                                    <span className={`text-xl font-mono font-bold text-white`}>
                                                        ${pick.livePrice?.toFixed(2)}
                                                    </span>
                                                    <span className={`text-3xl font-mono font-black tracking-tight ${pick.roi >= 0 ? (isLatest ? "text-[#00FF41]" : "text-[#00cc33]") : "text-rose-500"}`}>
                                                        {pick.roi > 0 ? "+" : ""}{pick.roi.toFixed(2)}%
                                                    </span>
                                                </>
                                            ) : (
                                                <span className={`text-xl font-mono font-bold ${isLatest ? 'text-zinc-500' : 'text-zinc-700'}`}>N/A</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className={`flex items-center justify-center w-12 h-12 rounded transition-all duration-300 ${isLatest
                                        ? "bg-[#00FF41] text-black hover:bg-[#00cc33]"
                                        : "bg-zinc-800 text-zinc-500 group-hover:bg-zinc-700 group-hover:text-white"
                                        }`}>
                                        <ArrowUpRight className="w-5 h-5" />
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
