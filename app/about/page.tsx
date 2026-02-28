import { Shield, BrainCircuit, LineChart, Cpu, Fingerprint, Activity } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="min-h-[85vh] flex flex-col items-center justify-center p-6 mb-20 font-sans selection:bg-[#00FF41]/30">

            <div className="max-w-4xl w-full text-center space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 relative z-10">
                {/* Background Ambient Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#00FF41]/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>

                {/* Header */}
                <div className="space-y-6 pt-12">
                    <div className="inline-flex items-center gap-2 mb-2 bg-emerald-950/30 text-[#00FF41] border border-[#00FF41]/30 px-5 py-2 rounded-full shadow-[0_0_15px_rgba(0,255,65,0.15)]">
                        <Activity className="w-4 h-4 animate-pulse" />
                        <span className="font-bold text-xs tracking-widest uppercase font-mono">System Architecture</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white">
                        About <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF41] to-emerald-600">Breakout AI</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-zinc-400 font-mono tracking-widest uppercase mt-4">
                        The "One Setup A Day" Protocol
                    </p>
                </div>

                {/* Core Message */}
                <div className="bg-[#050505] border-l-4 border-l-[#00FF41] border-t border-b border-r border-zinc-800 p-8 md:p-12 rounded-r-2xl shadow-[0_0_40px_rgba(0,255,65,0.05)] text-left relative overflow-hidden group hover:border-[#00FF41]/50 transition-colors duration-500">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#00FF41]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                    <p className="text-lg md:text-xl text-zinc-300 leading-relaxed font-mono relative z-10">
                        Most retail investors drown in noise. They scan thousands of tickers, listen to conflicting opinions, and enter trades based on emotion. <strong className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">Breakout AI eliminates the noise by delivering exactly one highly asymmetric, institutionally-backed setup per day.</strong>
                    </p>
                    <p className="mt-8 text-zinc-500 font-medium text-sm md:text-base leading-relaxed font-mono relative z-10">
                        Our proprietary quantitative screener parses over 4,000 highly liquid US equities every 24 hours. We strictly codify William O'Neil's <span className="text-[#00FF41]">CAN SLIM</span> framework and volatility contraction patterns into our neural engine. When a stock exhibits the exact mathematical signatures of a massive institutional breakout—supported by aggressive volume and profound fundamentals—we flag it. If no stock meets the extreme technical criteria, <span className="text-rose-500 font-bold border-b border-rose-500/50">we do not force a trade.</span>
                    </p>
                </div>

            </div>

            {/* Universe Criteria Breakdown - Added for Trust */}
            <div className="text-left mt-24 mb-8">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-zinc-800"></div>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase font-mono text-center">
                        The Universe Criteria
                    </h2>
                    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-zinc-800"></div>
                </div>

                <p className="text-zinc-400 font-mono text-center max-w-2xl mx-auto mb-12">
                    Before a stock is even evaluated for a technical setup, it must pass our uncompromising liquidity and quality filters to ensure institutional-grade execution.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                    {/* Criterion 1 */}
                    <div className="relative pl-6 border-l border-zinc-800 hover:border-[#00FF41]/50 transition-colors group">
                        <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-zinc-800 group-hover:bg-[#00FF41] group-hover:shadow-[0_0_10px_rgba(0,255,65,0.8)] transition-all"></div>
                        <h4 className="text-[#00FF41] font-black uppercase font-mono text-sm tracking-widest mb-2">01. Enterprise Valuation</h4>
                        <p className="text-white font-bold mb-1 font-mono text-sm">Market Capitalization &gt; $2 Billion</p>
                        <p className="text-zinc-500 text-sm font-mono leading-relaxed">We strictly exclude micro-cap and penny stocks where price action is easily manipulated by retail noise. Our algorithm only targets established mid, large, and mega-cap companies capable of absorbing institutional capital inflows.</p>
                    </div>

                    {/* Criterion 2 */}
                    <div className="relative pl-6 border-l border-zinc-800 hover:border-[#00FF41]/50 transition-colors group">
                        <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-zinc-800 group-hover:bg-[#00FF41] group-hover:shadow-[0_0_10px_rgba(0,255,65,0.8)] transition-all"></div>
                        <h4 className="text-[#00FF41] font-black uppercase font-mono text-sm tracking-widest mb-2">02. Deep Liquidity</h4>
                        <p className="text-white font-bold mb-1 font-mono text-sm">Average Daily Volume (50-Day) &gt; 500,000</p>
                        <p className="text-zinc-500 text-sm font-mono leading-relaxed">To prevent slippage and guarantee seamless entry/exit execution, we require massive daily average trading volume. A legitimate breakout must be supported by heavy, unmistakable institutional buying pressure.</p>
                    </div>

                    {/* Criterion 3 */}
                    <div className="relative pl-6 border-l border-zinc-800 hover:border-[#00FF41]/50 transition-colors group">
                        <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-zinc-800 group-hover:bg-[#00FF41] group-hover:shadow-[0_0_10px_rgba(0,255,65,0.8)] transition-all"></div>
                        <h4 className="text-[#00FF41] font-black uppercase font-mono text-sm tracking-widest mb-2">03. Minimum Viable Price</h4>
                        <p className="text-white font-bold mb-1 font-mono text-sm">Share Price &gt; $15.00</p>
                        <p className="text-zinc-500 text-sm font-mono leading-relaxed">Many institutional charters (mutual funds, pensions) are legally prohibited from buying stocks under $10 or $15. We align our screener with these mandates to ensure the setups we flag can actually be bought by the "Smart Money."</p>
                    </div>

                    {/* Criterion 4 */}
                    <div className="relative pl-6 border-l border-zinc-800 hover:border-[#00FF41]/50 transition-colors group">
                        <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-zinc-800 group-hover:bg-[#00FF41] group-hover:shadow-[0_0_10px_rgba(0,255,65,0.8)] transition-all"></div>
                        <h4 className="text-[#00FF41] font-black uppercase font-mono text-sm tracking-widest mb-2">04. Fundamental Baseline</h4>
                        <p className="text-white font-bold mb-1 font-mono text-sm">Revenue/EPS Growth Triggers</p>
                        <p className="text-zinc-500 text-sm font-mono leading-relaxed">A perfect chart is meaningless on a dying company. We pre-screen for positive fundamental catalysts—such as recent earnings beats, accelerating sales growth, or expanding margins—before allowing technical patterns to be evaluated.</p>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mt-16">
                <div className="bg-[#0a0a0c] p-8 rounded-2xl border border-zinc-800 hover:border-[#00FF41]/40 hover:shadow-[0_0_30px_rgba(0,255,65,0.1)] transition-all group">
                    <div className="bg-emerald-950/30 w-14 h-14 rounded-xl flex items-center justify-center mb-6 border border-[#00FF41]/20 group-hover:bg-[#00FF41]/20 transition-colors">
                        <Cpu className="w-7 h-7 text-[#00FF41]" />
                    </div>
                    <h3 className="text-white font-black mb-3 font-mono uppercase tracking-widest text-sm">Algorithmic Precision</h3>
                    <p className="text-sm text-zinc-500 font-mono leading-relaxed">We scan the universe of liquid equities to identify precise mathematical entry points, mapping the exact pivot of a deep base or secondary buy zone without human bias.</p>
                </div>

                <div className="bg-[#0a0a0c] p-8 rounded-2xl border border-zinc-800 hover:border-[#00FF41]/40 hover:shadow-[0_0_30px_rgba(0,255,65,0.1)] transition-all group">
                    <div className="bg-emerald-950/30 w-14 h-14 rounded-xl flex items-center justify-center mb-6 border border-[#00FF41]/20 group-hover:bg-[#00FF41]/20 transition-colors">
                        <LineChart className="w-7 h-7 text-[#00FF41]" />
                    </div>
                    <h3 className="text-white font-black mb-3 font-mono uppercase tracking-widest text-sm">Smart Money Flow</h3>
                    <p className="text-sm text-zinc-500 font-mono leading-relaxed">Breakouts only succeed with institutional backing. We filter for abnormal block volume surges that confirm mutual fund and sovereign wealth accumulation.</p>
                </div>

                <div className="bg-[#0a0a0c] p-8 rounded-2xl border border-zinc-800 hover:border-[#00FF41]/40 hover:shadow-[0_0_30px_rgba(0,255,65,0.1)] transition-all group">
                    <div className="bg-emerald-950/30 w-14 h-14 rounded-xl flex items-center justify-center mb-6 border border-[#00FF41]/20 group-hover:bg-[#00FF41]/20 transition-colors">
                        <Fingerprint className="w-7 h-7 text-[#00FF41]" />
                    </div>
                    <h3 className="text-white font-black mb-3 font-mono uppercase tracking-widest text-sm">Deep Forensics</h3>
                    <p className="text-sm text-zinc-500 font-mono leading-relaxed">A technical breakout is a trap without fundamental validity. We run deep AI research on 10-Ks to verify the "Truth of Market" narrative before greenlighting every setup.</p>
                </div>
            </div>


        </div>
    );
}
