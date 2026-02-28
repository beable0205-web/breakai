export default function Disclaimer() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-20 text-slate-300 font-sans leading-relaxed">
            <h1 className="text-4xl font-bold text-white mb-8 border-b border-[#333] pb-4">Financial & Legal Disclaimer</h1>
            <p className="text-sm text-zinc-500 mb-8 font-mono">Last Updated: February 2026</p>

            <div className="space-y-8">
                <section>
                    <h2 className="text-2xl font-semibold text-emerald-400 mb-4">1. No Investment Advice</h2>
                    <p>
                        The information provided on this website ("Breakout AI") is for general informational and educational purposes only. All information on the site is provided in good faith. However, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.
                    </p>
                    <div className="mt-6 p-6 bg-rose-500/10 border-l-4 border-rose-500 rounded-r-lg">
                        <p className="text-white font-bold mb-2">CRITICAL NOTICE:</p>
                        <p className="text-rose-200">
                            <strong>We are not financial advisors, nor do we intend to be.</strong> The AI-generated stock picks, analysis, and data presented on this website should not be interpreted as professional financial advice. You must consult a qualified financial professional before making any investment decisions.
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-emerald-400 mb-4">2. Trading Risks</h2>
                    <p>
                        Trading in financial markets, including stocks, options, and cryptocurrencies, involves a high degree of risk and may not be suitable for all investors. You could lose some or all of your initial investment. Any historical performance metrics, Return on Investment (ROI) displays, or simulated algorithms provided on this site are for illustrative purposes only and do not guarantee future results.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-emerald-400 mb-4">3. Algorithmic Processing & AI Limitations</h2>
                    <p>
                        Breakout AI utilizes technical analysis frameworks (specifically variations of the Cup and Handle pattern) combined with Large Language Models (LLMs) to automatically generate fundamental reports.
                    </p>
                    <ul className="list-disc pl-6 mt-4 space-y-2 text-zinc-400">
                        <li>AI models can hallucinate or output factually incorrect statements.</li>
                        <li>Automated screeners may identify false positives due to poor liquidity or temporary market volatility.</li>
                        <li>Financial data is subject to delays and may not reflect real-time market conditions.</li>
                    </ul>
                    <p className="mt-4">You agree not to hold Breakout AI, its creators, or its affiliates liable for any losses incurred resulting from actions taken based on the information provided on this website.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-emerald-400 mb-4">4. External Links Disclaimer</h2>
                    <p>
                        The site may contain (or you may be sent through the site) links to other websites or content belonging to or originating from third parties or links to websites and features in banners or other advertising. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us.
                    </p>
                </section>
            </div>
        </div>
    );
}
