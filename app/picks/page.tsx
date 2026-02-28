import { createClient } from "../../utils/supabase/server";
import Link from "next/link";
import { ArrowUpRight, Cpu, Activity, TrendingUp, Presentation } from "lucide-react";
import { fetchLiveQuote } from "../../utils/yahooFinance";

export const metadata = {
    title: "Breakout AI | Institutional Grade Stock Screener",
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
        <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-500/30 font-sans">
            {/* Hero Section */}
            <div className="relative pt-20 pb-12 border-b border-slate-200 bg-white">
                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="inline-flex items-center gap-2 mb-6 bg-blue-50 text-blue-700 border border-blue-200 px-4 py-1.5 rounded-sm">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
                        </span>
                        <span className="font-semibold text-xs tracking-widest uppercase">Institutional AI Screener</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-serif font-black mb-4 tracking-tight text-slate-900 leading-tight">
                        One Stock. <br className="hidden md:block" />
                        Maximum Asymmetry.
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 max-w-3xl leading-relaxed mb-8">
                        Our proprietary algorithm scans the top 1,000 highly liquid US equities daily. We identify the single highest-probability technical breakout, backed by profound fundamental research.
                    </p>
                </div>
            </div>

            {/* List Section */}
            <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">

                {/* Stats / Headers Bar */}
                <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 pb-4 border-b-2 border-slate-800 gap-4">
                    <div className="flex items-center gap-3">
                        <Presentation className="w-6 h-6 text-slate-800" />
                        <h2 className="text-2xl font-serif font-bold tracking-tight text-slate-900">Historical Signals</h2>
                    </div>
                    <div className="text-slate-500 text-sm font-semibold uppercase tracking-widest flex gap-6">
                        <span className="flex items-center gap-1">Universe: Top 1000 US</span>
                    </div>
                </div>

                {error && (
                    <div className="p-6 bg-red-50 text-red-700 border border-red-200 rounded-sm flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                            <span className="text-xl">⚠️</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-1">System Error</h3>
                            <p className="text-red-600/80">Failed to connect to the signal database.</p>
                        </div>
                    </div>
                )}

                {!error && picksWithPrices.length === 0 && (
                    <div className="h-64 border-2 border-dashed border-slate-300 rounded-sm flex flex-col items-center justify-center bg-white">
                        <Activity className="w-12 h-12 text-slate-400 mb-4" />
                        <h3 className="text-xl font-bold text-slate-700 mb-2">Awaiting Signals</h3>
                        <p className="text-slate-500 text-center max-w-md">The algorithm has not detected any verified institutional breakouts today. Quality over quantity.</p>
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
                                className={`group flex flex-col md:flex-row items-start md:items-center justify-between p-6 border transition-all duration-200 hover:shadow-lg relative overflow-hidden ${isLatest
                                        ? "bg-slate-900 text-white border-slate-900"
                                        : "bg-white border-slate-200 hover:border-blue-300"
                                    }`}
                            >
                                {/* Ticker and Date */}
                                <div className="flex items-center gap-6 md:w-1/4 mb-6 md:mb-0 relative z-10 w-full">
                                    <div className={`w-16 h-16 flex items-center justify-center rounded-sm font-serif font-black text-2xl shrink-0 ${isLatest ? "bg-white text-slate-900" : "bg-slate-100 text-slate-800"
                                        }`}>
                                        {pick.ticker.substring(0, 2)}
                                    </div>
                                    <div>
                                        {isLatest && <span className="text-blue-400 text-[10px] font-bold tracking-widest uppercase mb-1 block">📌 Today's Pick</span>}
                                        <h3 className={`text-3xl font-serif font-black tracking-tight leading-none mb-1 ${isLatest ? 'text-white' : 'text-slate-900'} group-hover:text-blue-500 transition-colors`}>
                                            {pick.ticker}
                                        </h3>
                                        <p className={`text-sm font-medium ${isLatest ? 'text-slate-400' : 'text-slate-500'}`}>
                                            {new Date(pick.pick_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>

                                {/* Setup Details */}
                                <div className="md:flex-1 md:px-8 relative z-10 mb-6 md:mb-0 w-full">
                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${isLatest ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"} rounded-sm border ${isLatest ? "border-slate-700" : "border-slate-200"}`}>
                                            Algo Score: {pick.oneil_score}/100
                                        </span>
                                    </div>
                                    <p className={`text-sm line-clamp-2 md:line-clamp-2 leading-relaxed ${isLatest ? 'text-slate-300' : 'text-slate-600'}`}>
                                        {details}
                                    </p>
                                </div>

                                {/* ROI Display */}
                                <div className={`md:w-auto relative z-10 w-full flex items-center justify-between md:justify-end gap-8 border-t md:border-none pt-4 md:pt-0 ${isLatest ? 'border-slate-800' : 'border-slate-100'}`}>
                                    <div className="text-left md:text-right hidden sm:block">
                                        <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isLatest ? 'text-slate-500' : 'text-slate-400'}`}>Live Return</p>
                                        <div className="flex items-baseline gap-2 justify-start md:justify-end">
                                            {pick.roi !== null ? (
                                                <span className={`text-2xl font-serif font-black tracking-tight ${pick.roi >= 0 ? (isLatest ? "text-green-400" : "text-green-600") : (isLatest ? "text-red-400" : "text-red-600")}`}>
                                                    {pick.roi > 0 ? "+" : ""}{pick.roi.toFixed(2)}%
                                                </span>
                                            ) : (
                                                <span className={`text-xl font-bold ${isLatest ? 'text-slate-600' : 'text-slate-300'}`}>N/A</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className={`flex items-center justify-center w-12 h-12 rounded-sm transition-all duration-300 ${isLatest
                                            ? "bg-blue-600 text-white hover:bg-blue-500"
                                            : "bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600"
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
