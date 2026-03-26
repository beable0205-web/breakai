import { createClient } from "../../utils/supabase/server";
import Link from "next/link";
import { ArrowUpRight, Activity, Presentation, FolderHeart } from "lucide-react";
import { fetchLiveQuote } from "../../utils/yahooFinance";
import BookmarkButton from "../components/BookmarkButton";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Breakout AI | My Saved Signals",
    description: "Your bookmarked institutional breakout signals.",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const supabaseServer = await createClient();
    const { data: { session } } = await supabaseServer.auth.getSession();
    
    if (!session?.user?.id) {
        redirect('/admin');
    }

    // Fetch user bookmarks
    const { data: bookmarks, error: bookmarkError } = await supabaseServer
        .from('user_bookmarks')
        .select('pick_id, created_at')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

    const pickIds = bookmarks ? bookmarks.map(b => b.pick_id) : [];

    // Fetch the actual picks
    let picksWithPrices: any[] = [];
    if (pickIds.length > 0) {
        const { data: picks, error } = await supabaseServer
            .from('oneil_picks')
            .select('*')
            .in('id', pickIds);

        // Fetch prices (this is inefficient for huge lists, but fine for bookmarks)
        picksWithPrices = await Promise.all((picks || []).map(async (pick) => {
            const quoteData = await fetchLiveQuote(pick.ticker);
            let livePrice = null;
            let roi = null;
            if (quoteData) {
                livePrice = quoteData.price;
                roi = quoteData.changePercent;
            }
            // Sort to match bookmark order
            const bookmarkInfo = bookmarks?.find(b => b.pick_id === pick.id);
            return { ...pick, livePrice, roi, bookmarked_at: bookmarkInfo?.created_at };
        }));

        picksWithPrices.sort((a, b) => new Date(b.bookmarked_at).getTime() - new Date(a.bookmarked_at).getTime());
    }

    return (
        <div className="min-h-screen bg-black text-slate-200 selection:bg-[#00FF41]/30 font-sans">
            {/* Hero Section */}
            <div className="relative pt-20 pb-12 border-b border-[#333] bg-[#0a0a0c]">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter text-white font-serif flex items-center gap-4">
                        <FolderHeart className="w-10 h-10 text-yellow-400" />
                        Saved Signals
                    </h1>
                    <p className="text-lg md:text-xl text-zinc-400 max-w-3xl leading-relaxed mb-4">
                        Your personalized dashboard of tracked institutional breakouts.
                    </p>
                </div>
            </div>

            {/* List Section */}
            <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
                {picksWithPrices.length === 0 ? (
                    <div className="h-64 border border-dashed border-zinc-800 rounded-sm flex flex-col items-center justify-center bg-[#0a0a0c]">
                        <Activity className="w-12 h-12 text-zinc-700 mb-4" />
                        <h3 className="text-xl font-bold text-zinc-400 mb-2">No Saved Signals</h3>
                        <p className="text-zinc-600 text-center max-w-md mb-6">You haven't bookmarked any signals yet.</p>
                        <Link href="/picks" className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded font-mono text-sm tracking-widest uppercase transition">
                            Browse Market
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {picksWithPrices.map((pick, i) => {
                            let details = `Score: ${pick.oneil_score}`;
                            if (pick.technical_details && typeof pick.technical_details === 'object') {
                                const msg = (pick.technical_details as any).message;
                                details = msg || details;
                            }

                            return (
                                <Link
                                    key={pick.id}
                                    href={`/picks/${pick.id}`}
                                    className={`group flex flex-col md:flex-row items-start md:items-center justify-between p-6 border transition-all duration-300 relative overflow-hidden bg-black border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900/30`}
                                >
                                    <div className="absolute top-4 right-4 z-20">
                                        <BookmarkButton pickId={pick.id} initialBookmarked={true} isLoggedIn={true} />
                                    </div>

                                    {/* Ticker and Date */}
                                    <div className="flex items-center gap-6 md:w-1/4 mb-6 md:mb-0 relative z-10 w-full ml-2">
                                        <div className={`w-16 h-16 flex items-center justify-center rounded font-serif font-black text-2xl shrink-0 bg-zinc-900 text-zinc-500 border border-zinc-800`}>
                                            {pick.ticker.substring(0, 2)}
                                        </div>
                                        <div>
                                            <h3 className={`text-4xl font-serif font-black tracking-tight leading-none mb-1 text-zinc-300 group-hover:text-white transition-colors`}>
                                                {pick.ticker}
                                            </h3>
                                            <p className={`text-sm font-mono uppercase tracking-widest text-zinc-600`}>
                                                {new Date(pick.pick_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Setup Details */}
                                    <div className="md:flex-1 md:px-8 relative z-10 mb-6 md:mb-0 w-full">
                                        <div className="flex flex-wrap items-center gap-2 mb-3">
                                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest font-mono bg-zinc-900 text-zinc-500 border border-zinc-800 rounded`}>
                                                Algo Score: {pick.oneil_score}/100
                                            </span>
                                        </div>
                                        <p className={`text-sm line-clamp-2 md:line-clamp-2 leading-relaxed font-mono text-zinc-500`}>
                                            {details}
                                        </p>
                                    </div>

                                    {/* ROI Display */}
                                    <div className={`md:w-auto relative z-10 w-full flex items-center justify-between md:justify-end gap-8 border-t md:border-none pt-4 md:pt-0 border-[#222]`}>
                                        <div className="text-left md:text-right hidden sm:block">
                                            <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 font-mono text-zinc-600`}>Daily Return</p>
                                            <div className="flex items-baseline gap-2 justify-start md:justify-end">
                                                {pick.roi !== null ? (
                                                    <>
                                                        <span className={`text-xl font-mono font-bold text-white`}>
                                                            ${pick.livePrice?.toFixed(2)}
                                                        </span>
                                                        <span className={`text-3xl font-mono font-black tracking-tight ${pick.roi >= 0 ? "text-[#00cc33]" : "text-rose-500"}`}>
                                                            {pick.roi > 0 ? "+" : ""}{pick.roi.toFixed(2)}%
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className={`text-xl font-mono font-bold text-zinc-700`}>N/A</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <div className={`flex items-center justify-center w-12 h-12 rounded transition-all duration-300 bg-zinc-800 text-zinc-500 group-hover:bg-zinc-700 group-hover:text-white`}>
                                            <ArrowUpRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
