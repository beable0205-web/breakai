import Link from 'next/link';
import { ArrowRight, BarChart2, Shield, Activity, Fingerprint, Lock, Zap, Target } from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen bg-[#020202] text-slate-300 font-sans selection:bg-[#00FF41]/30 pb-20">
            {/* Hero Section */}
            <div className="relative pt-32 pb-24 border-b border-[#111] overflow-hidden">
                <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-[#00FF41]/5 rounded-full blur-[150px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-emerald-900/10 rounded-full blur-[120px] pointer-events-none"></div>
                
                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="inline-flex items-center gap-3 mb-8 bg-emerald-950/40 text-[#00FF41] border border-[#00FF41]/20 px-5 py-2.5 rounded-full font-mono shadow-[0_0_20px_rgba(0,255,65,0.15)] backdrop-blur-md">
                        <Activity className="w-4 h-4 animate-pulse" />
                        <span className="font-bold text-xs tracking-[0.2em] uppercase">Algorithmic Trading Screener</span>
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter text-white leading-[1.1] font-serif">
                        Institutional Grade <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF41] to-emerald-700">
                            Market Intelligence
                        </span>
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl leading-relaxed mb-12 font-mono">
                        Breakout AI is an advanced quantitative screener that distills the volatility 
                        out of the market. Our proprietary neural engine analyzes thousands of equities 
                        to pinpoint the exact moment institutional capital triggers a mathematical breakout.
                    </p>

                    <div className="flex flex-wrap items-center gap-6">
                        <Link href="/picks" className="group inline-flex items-center gap-3 bg-[#00FF41] text-black font-black font-mono uppercase tracking-widest px-8 py-4 rounded hover:bg-[#00cc33] transition-all shadow-[0_0_30px_rgba(0,255,65,0.3)]">
                            Enter Terminal
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 sm:transition-transform" />
                        </Link>
                        <Link href="/about" className="inline-flex items-center gap-3 bg-transparent text-white border border-zinc-700 font-bold font-mono uppercase tracking-widest px-8 py-4 rounded hover:bg-zinc-800 transition-all">
                            View Methodology
                        </Link>
                    </div>
                </div>
            </div>

            {/* Content Section for AdSense (Thick Content) */}
            <div className="max-w-6xl mx-auto px-6 py-24 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tighter font-serif">The Architecture of an Alpha Signal</h2>
                    <p className="text-zinc-400 text-lg leading-relaxed font-mono">
                        Trading based on emotion or social sentiment guarantees failure. At Breakout AI, we have codified the legendary CAN SLIM methodology and William O'Neil's technical patterns into a massive, daily scanning pipeline.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="p-8 bg-[#0a0a0c] border border-zinc-800 rounded-2xl hover:border-[#00FF41]/30 transition-all leading-relaxed relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-800 to-zinc-800 group-hover:from-[#00FF41] group-hover:to-emerald-900 transition-colors"></div>
                        <Target className="w-8 h-8 text-[#00FF41] mb-6" />
                        <h3 className="text-xl font-bold text-white mb-4 font-mono">Deep Fundamental Screens</h3>
                        <p className="text-zinc-500 text-sm">
                            A perfect chart configuration is a trap if the underlying company is rapidly declining. Our algorithm systematically audits the latest quarterly earnings reports against street estimates, strictly prioritizing companies demonstrating triple-digit earnings growth, expanding gross profit margins, and dominant sector leadership. We immediately discard low-quality, speculative pennies.
                        </p>
                    </div>

                    <div className="p-8 bg-[#0a0a0c] border border-zinc-800 rounded-2xl hover:border-[#00FF41]/30 transition-all leading-relaxed relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-800 to-zinc-800 group-hover:from-[#00FF41] group-hover:to-emerald-900 transition-colors"></div>
                        <BarChart2 className="w-8 h-8 text-[#00FF41] mb-6" />
                        <h3 className="text-xl font-bold text-white mb-4 font-mono">224-Day MA Anchor</h3>
                        <p className="text-zinc-500 text-sm">
                            The backbone of our technical screening relies on the 224-day and 448-day moving averages. By evaluating nearly two years of historical closing data, we calculate the long-term institutional cost basis. We look for the exact "Cup and Handle" consolidation bases that allow smart money to aggressively accumulate shares without spiking the price prematurely.
                        </p>
                    </div>

                    <div className="p-8 bg-[#0a0a0c] border border-zinc-800 rounded-2xl hover:border-[#00FF41]/30 transition-all leading-relaxed relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-800 to-zinc-800 group-hover:from-[#00FF41] group-hover:to-emerald-900 transition-colors"></div>
                        <Zap className="w-8 h-8 text-[#00FF41] mb-6" />
                        <h3 className="text-xl font-bold text-white mb-4 font-mono">Volume Forensic Analysis</h3>
                        <p className="text-zinc-500 text-sm">
                            Our system actively parses the daily volume against a 50-day rolling average. When a stock breaks its pivot point on volume that is 50% to 150% above normal, it reveals mutual fund and hedge fund participation. The algorithm rejects all low-volume breakouts, minimizing the risk of devastating retail bull-traps.
                        </p>
                    </div>
                </div>
            </div>

            {/* Disclaimer Bar */}
            <div className="max-w-6xl mx-auto px-6">
                <div className="bg-blue-950/20 border border-blue-900/50 p-6 rounded-xl flex items-start gap-4">
                    <Shield className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
                    <div>
                        <h4 className="text-blue-400 font-bold mb-2 font-mono uppercase text-sm tracking-widest">Educational & Research Only</h4>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                            The content provided on Breakout AI is strictly for informational and educational purposes. We are not a registered financial advisor or broker-dealer. The algorithmic signals, technical breakdowns, and fundamental summaries do not constitute investment advice, solicitations, or recommendations to buy or sell any security. All systemic stock trading involves substantial risk of loss. Visitors should consult a licensed professional and conduct their own due diligence before executing any trades based on automated data platforms. By utilizing this site, you acknowledge that Breakout AI assumes no responsibility for financial losses or damages incurred.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}