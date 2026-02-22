import { supabase } from "../../lib/supabase";
import Link from "next/link";
import { ArrowLeft, Activity } from "lucide-react";
import TradingViewWidget from "../../../components/TradingViewWidget";
import HubTabs from "../../components/HubTabs";
import ReportCard from "../../components/ReportCard";

// Ensure dynamic fetching so pricing/reports are fresh
export const revalidate = 0;

export default async function CompanyHubPage({ params }: { params: Promise<{ ticker: string }> }) {
    const { ticker: rawTicker } = await params;
    const ticker = decodeURIComponent(rawTicker).toUpperCase();

    // 1. Fetch all reports for this specific ticker (Fetch ALL columns to populate ReportCard)
    const { data: reports, error } = await supabase
        .from('reports')
        .select('*')
        .eq('ticker', ticker)
        .order('created_at', { ascending: false });

    // Separate newest research report from the rest
    const researchReports = (reports || []).filter(r => !r.report_type || r.report_type === "research");
    const earningsReports = (reports || []).filter(r => r.report_type === "earnings");

    const latestResearch = researchReports.length > 0 ? researchReports[0] : null;
    const archivedResearch = researchReports; // Show all reports in the archive tab, including the easiest one
    const archiveReportsForTabs = [...archivedResearch, ...earningsReports];

    // 2. Fetch Live Price Data from Yahoo Finance v8 Chart
    let livePrice = 0;
    let changePercent = 0;
    const queryTicker = ticker === "LNK" ? "LINK-USD" : ticker;
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${queryTicker}?interval=1d&range=1d`;

    try {
        const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, next: { revalidate: 60 } });
        if (res.ok) {
            const data = await res.json();
            const meta = data?.chart?.result?.[0]?.meta;
            if (meta) {
                livePrice = meta.regularMarketPrice;
                const prev = meta.chartPreviousClose;
                changePercent = ((livePrice - prev) / prev) * 100;
            }
        }
    } catch (err) {
        console.error("Failed to fetch yahoo finance data strictly for hub:", err);
    }

    const isPositive = changePercent >= 0;
    const colorClass = isPositive ? "text-emerald-400" : "text-rose-400";
    const logoUrl = `https://logo.clearbit.com/${ticker.toLowerCase()}.com`;

    return (
        <div className="max-w-6xl mx-auto mt-10 p-6 space-y-8 mb-20 font-sans">
            <Link href="/" className="flex items-center text-zinc-500 hover:text-white transition group w-fit font-mono text-sm tracking-widest uppercase">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
            </Link>

            {/* TOP SECTION: Price & Chart Matrix */}
            <div className="bg-[#111] border border-[#333] rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 relative z-10">
                    <div className="flex items-center gap-5">
                        <img
                            src={ticker === 'TSLA' ? 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png' : logoUrl}
                            alt={`${ticker} logo`}
                            className="w-20 h-20 rounded-2xl object-contain bg-white p-2 shadow-lg"
                        />
                        <div>
                            <h1 className="text-5xl font-black tracking-tighter text-white mb-1">
                                {ticker}
                            </h1>
                            <p className="text-emerald-500 flex items-center font-mono text-xs font-bold tracking-widest uppercase mb-1">
                                <Activity className="w-3 h-3 mr-1" /> Verified Company Hub
                            </p>
                        </div>
                    </div>

                    <div className="text-left md:text-right bg-black/50 p-4 rounded-xl border border-zinc-800 backdrop-blur-sm relative overflow-hidden">
                        <div className={`absolute left-0 top-0 w-1 h-full ${isPositive ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                        <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-1 ml-2">Real-Time Market Data</p>
                        <div className="flex items-baseline md:justify-end gap-3 ml-2">
                            <h2 className="text-4xl font-black text-white font-mono">
                                ${livePrice ? livePrice.toFixed(2) : "0.00"}
                            </h2>
                            <span className={`font-mono text-lg font-bold ${colorClass}`}>
                                {isPositive ? "+" : ""}{changePercent ? changePercent.toFixed(2) : "0.00"}%
                            </span>
                        </div>
                    </div>
                </header>
            </div>

            {/* LATEST AI ANALYSIS (PROMINENT DISPLAY) */}
            {latestResearch ? (
                <div className="mt-12">
                    <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-pulse"></span>
                        Latest AI Analysis
                    </h2>
                    {/* Re-use our beautiful ReportCard component! */}
                    <ReportCard report={latestResearch} />
                </div>
            ) : (
                /* Securely Bound TradingView Widget Backup */
                <section className="mt-8 w-full h-[450px] rounded-xl overflow-hidden border border-zinc-800 bg-[#131722] shadow-inner relative z-10">
                    <div className="absolute top-4 left-4 z-20 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-zinc-700 shadow-lg">
                        <span className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase">Live Technical Analysis</span>
                    </div>
                    {/* Render Widget */}
                    <div className="w-full h-full relative z-10">
                        <TradingViewWidget ticker={ticker} />
                    </div>
                </section>
            )}

            {/* MIDDLE SECTION: Interactive Tabs (Archive & Earnings) */}
            <div className="mt-16">
                <h2 className="text-2xl font-black text-white mb-6">Historical Archives & Earnings</h2>
                <HubTabs ticker={ticker} reports={archiveReportsForTabs} />
            </div>
        </div>
    );
}
