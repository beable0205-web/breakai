import { createClient } from "../../../utils/supabase/server";
import Link from "next/link";
import { ArrowLeft, Lock, TrendingUp, Cpu, Activity, ShieldAlert, BarChart, FileText } from "lucide-react";
import { notFound } from "next/navigation";
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import { fetchLiveQuote } from "../../../utils/yahooFinance";

export const dynamic = "force-dynamic";

export default async function PickDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabaseServer = await createClient();

    // Fetch pick from Supabase
    const { data: pick, error } = await supabaseServer
        .from('oneil_picks')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !pick) {
        notFound();
    }

    // Check if the current user is the admin to bypass the paywall
    const { data: { session } } = await supabaseServer.auth.getSession();
    const isAdmin = session?.user?.email === "beable9489@gmail.com";

    // Query profiles table for matching user
    let isDbPro = false;
    if (session?.user?.id) {
        const { data: profile } = await supabaseServer
            .from('profiles')
            .select('is_pro')
            .eq('id', session.user.id)
            .single();
        if (profile?.is_pro) isDbPro = true;
    }

    // Regular Paywall logic + Admin Bypass
    const isProUser = isAdmin || isDbPro || false;

    // Fetch live quote for ROI
    const livePrice = await fetchLiveQuote(pick.ticker);
    let roi = null;
    if (livePrice && pick.picked_price) {
        roi = ((livePrice - pick.picked_price) / pick.picked_price) * 100;
    }

    let details = pick.technical_details;
    if (typeof details === 'string') {
        try { details = JSON.parse(details); } catch (e) { }
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 space-y-8 mb-20 font-sans selection:bg-blue-500/30 text-slate-900">
            <Link href="/picks" className="flex items-center text-slate-500 hover:text-blue-600 font-semibold text-xs tracking-widest uppercase transition group w-fit">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                RETURN TO TERMINAL
            </Link>

            <header className="border-b-2 border-slate-800 pb-8 mt-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <BarChart className="text-blue-600 w-8 h-8" />
                            <h1 className="text-6xl md:text-7xl font-serif font-black tracking-tight text-slate-900">
                                {isProUser ? pick.ticker : "******"}
                            </h1>
                        </div>
                        <p className="text-slate-500 font-semibold text-sm tracking-widest uppercase">
                            INSTITUTIONAL SIGNAL #{pick.id.split('-')[0]} • {new Date(pick.pick_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                    </div>

                    {/* ROI Display */}
                    <div className="bg-white border border-slate-200 rounded-sm p-5 min-w-[200px] shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-1 bg-blue-500 h-full"></div>
                        <p className="text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-1">Live Premium</p>
                        {roi !== null ? (
                            <div className="flex flex-col">
                                <span className={`text-4xl font-serif font-black tracking-tight ${roi >= 0 ? "text-green-600" : "text-red-600"}`}>
                                    {roi > 0 ? "+" : ""}{roi.toFixed(2)}%
                                </span>
                                <span className="text-slate-400 text-xs mt-1 font-medium">
                                    Base Entry: ${Number(pick.picked_price).toFixed(2)}
                                </span>
                            </div>
                        ) : (
                            <span className="text-2xl font-bold text-slate-400">Yielding...</span>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-sm">
                        <Activity className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Algo Confidence: {pick.oneil_score}/100</span>
                    </div>
                    {details?.currentPrice && (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-sm">
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">224 DMA Floor: ${(details.ma224).toFixed(2)}</span>
                        </div>
                    )}
                </div>
            </header>

            {/* Always Visible: Technical Context Summary */}
            <section className="bg-slate-50 p-6 md:p-8 rounded-sm border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute left-0 top-0 w-1 h-full bg-slate-800"></div>
                <h3 className="text-slate-800 font-semibold text-xs mb-3 flex items-center tracking-widest uppercase">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 animate-pulse"></span>
                    Terminal Output Summary
                </h3>
                <p className="text-lg text-slate-700 leading-relaxed font-serif">
                    {details?.message || "Technical details aggregated in full AI report."}
                </p>
            </section>

            {/* The Paywall Logic */}
            <section className="mt-12">
                {!isProUser ? (
                    // FREE USER STATE
                    <div className="relative w-full bg-white border border-slate-200 rounded-sm shadow-xl overflow-hidden mt-8">
                        {/* Fake Blurred Content Background */}
                        <div className="absolute inset-0 pointer-events-none select-none blur-md opacity-20 px-10 py-12">
                            <div className="prose prose-slate prose-lg max-w-none">
                                <h1>Breakout AI: Institutional Analysis</h1>
                                <h2>1. Technical Setup Confirmation</h2>
                                <p>Our algorithm detected a massive volume surge right at the 224-day moving average, creating a textbook asymmetrical entry point...</p>
                                <div className="w-full h-40 bg-slate-200 rounded-sm animate-pulse my-6"></div>
                                <h2>2. Intrinsic Value Assessment</h2>
                                <p>Scouring the latest 10-K, the company maintains a dominant 68% market share in its primary segment with extreme pricing power...</p>
                            </div>
                        </div>

                        {/* Top CTA Overlay */}
                        <div className="relative z-10 w-full flex flex-col items-center justify-center p-8 md:p-16 min-h-[600px] bg-gradient-to-b from-transparent via-slate-50/95 to-slate-100">
                            <div className="bg-white border border-slate-200 p-8 md:p-12 rounded-sm max-w-xl text-center shadow-2xl w-full">
                                <div className="w-20 h-20 bg-slate-900 rounded-full mx-auto flex items-center justify-center mb-6 shadow-lg">
                                    <Lock className="w-8 h-8 text-white" />
                                </div>

                                <h3 className="text-3xl md:text-4xl font-serif font-black text-slate-900 mb-4 tracking-tight">
                                    Access Institutional Research
                                </h3>

                                <p className="text-slate-600 mb-8 text-lg leading-relaxed">
                                    Elevate your trading. Let our AI uncover the single highest-probability breakout setup from the top 1,000 equities daily.
                                </p>

                                <Link href="/pricing" className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-sm shadow-md transition-all md:text-lg mb-4 hover:-translate-y-0.5 transform uppercase tracking-widest text-sm">
                                    View PRO Plans (From $9.99)
                                </Link>
                                <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Secure Payments via Lemon Squeezy</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    // PRO USER STATE: Render beautiful markdown
                    <div className="bg-white rounded-sm border border-slate-200 p-8 md:p-12 shadow-xl">
                        <div className="flex items-center gap-3 mb-8 pb-6 border-b-2 border-slate-800">
                            <FileText className="w-6 h-6 text-blue-600" />
                            <h3 className="text-2xl font-serif font-black tracking-tight text-slate-900 uppercase">Institutional Research Report</h3>
                        </div>

                        <div className="prose prose-slate prose-lg max-w-none 
                            prose-headings:mt-12 prose-headings:font-serif prose-headings:font-black prose-headings:tracking-tight
                            prose-h1:text-4xl prose-h1:text-slate-900 prose-h1:mb-8
                            prose-h2:text-2xl prose-h2:text-blue-800 prose-h2:border-b-2 prose-h2:border-slate-100 prose-h2:pb-3 prose-h2:uppercase prose-h2:tracking-wider
                            prose-h3:text-xl prose-h3:text-slate-800
                            prose-p:leading-relaxed prose-p:text-slate-700 prose-p:mb-6 
                            prose-strong:text-slate-900 prose-strong:font-bold
                            prose-li:text-slate-700 prose-li:mb-2
                            prose-ul:my-6
                            prose-hr:border-slate-200
                            ">
                            {pick.ai_report ? (
                                <ReactMarkdown remarkPlugins={[remarkBreaks]}>{pick.ai_report}</ReactMarkdown>
                            ) : (
                                <p className="text-slate-500 italic font-serif">Research aggregation in progress. Please check back shortly.</p>
                            )}
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}
