import { Shield, BrainCircuit, LineChart } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="min-h-[85vh] flex flex-col items-center justify-center p-6 mb-20 font-sans">

            <div className="max-w-4xl w-full text-center space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-500">

                {/* Header */}
                <div className="space-y-6 pt-12">
                    <h1 className="text-5xl md:text-7xl font-serif font-black tracking-tight text-slate-900">
                        About Breakout AI
                    </h1>
                    <p className="text-xl md:text-2xl text-blue-600 font-semibold tracking-widest uppercase">
                        The "One Stock A Day" Philosophy
                    </p>
                </div>

                {/* Core Message */}
                <div className="bg-white border-2 border-slate-200 p-8 md:p-12 rounded-sm shadow-xl text-left relative overflow-hidden group hover:border-blue-300 transition-colors duration-300">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 group-hover:w-2 transition-all duration-300"></div>

                    <p className="text-lg md:text-xl text-slate-700 leading-relaxed font-serif">
                        Most retail investors drown in noise. They scan thousands of tickers, listen to conflicting opinions, and enter trades based on emotion. <strong>Breakout AI eliminates the noise by delivering exactly one highly asymmetric setup per day.</strong>
                    </p>
                    <p className="mt-6 text-slate-600 font-medium text-base leading-relaxed">
                        Our proprietary screener parses over 1,000 highly liquid, top US equities every 24 hours. We codify William O'Neil's legendary Cup & Handle and CAN SLIM frameworks into our algorithm. When a stock exhibits the exact mathematical signatures of a massive institutional breakout—supported by aggressive volume and profound fundamentals—we flag it. If no stock meets the criteria, we do not force a trade.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mt-16">
                    <div className="bg-slate-50 p-6 rounded-sm border border-slate-200 hover:bg-white hover:shadow-md transition-all">
                        <BrainCircuit className="w-8 h-8 text-blue-600 mb-4" />
                        <h3 className="text-slate-900 font-bold mb-2 font-serif uppercase tracking-wider">Algorithmic Precision</h3>
                        <p className="text-sm text-slate-600">We scan the universe of liquid equities to identify precise entry points (e.g., the pivot point of a deep base or a secondary buy point) without bias.</p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-sm border border-slate-200 hover:bg-white hover:shadow-md transition-all">
                        <LineChart className="w-8 h-8 text-blue-600 mb-4" />
                        <h3 className="text-slate-900 font-bold mb-2 font-serif uppercase tracking-wider">Smart Money Flow</h3>
                        <p className="text-sm text-slate-600">Breakouts only succeed with institutional backing. We filter for abnormal volume surges that confirm mutual fund and sovereign wealth accumulation.</p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-sm border border-slate-200 hover:bg-white hover:shadow-md transition-all">
                        <Shield className="w-8 h-8 text-blue-600 mb-4" />
                        <h3 className="text-slate-900 font-bold mb-2 font-serif uppercase tracking-wider">Deep Forensics</h3>
                        <p className="text-sm text-slate-600">A technical breakout is a trap without fundamental strength. We run deep AI research on 10-Ks to verify the "Truth of Market" before every setup.</p>
                    </div>
                </div>

                {/* CTA */}
                <div className="pt-12">
                    <Link href="/pricing" className="inline-block bg-blue-600 text-white font-bold px-12 py-4 rounded-sm hover:-translate-y-1 transition-transform shadow-lg shadow-blue-600/20 uppercase tracking-widest text-sm">
                        Access Institutional Research
                    </Link>
                </div>

            </div>
        </div>
    );
}
