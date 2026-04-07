import { ShieldAlert } from "lucide-react";

export default function DisclaimerPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-20 text-slate-300 font-sans leading-relaxed">
            <div className="flex items-center gap-4 mb-8 border-b border-[#333] pb-4">
                <ShieldAlert className="w-10 h-10 text-rose-500" />
                <h1 className="text-4xl font-bold text-white">Financial Disclaimer</h1>
            </div>
            
            <p className="text-sm text-zinc-500 mb-8 font-mono">Last Updated: February 2026</p>

            <div className="space-y-8">
                <section className="bg-rose-950/20 border border-rose-900/50 p-6 rounded-xl">
                    <h2 className="text-xl font-bold text-rose-500 mb-2 font-mono uppercase">Not Investment Advice</h2>
                    <p className="text-zinc-300">
                        The information provided on this website does not constitute investment advice, financial advice, trading advice, or any other sort of advice and you should not treat any of the website's content as such. Breakout AI does not recommend that any stock, cryptocurrency, or other security should be bought, sold, or held by you. Conduct your own due diligence and consult your financial advisor before making any investment decisions.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-emerald-400 mb-4">Accuracy of Information</h2>
                    <p>
                        Breakout AI will strive to ensure accuracy of information listed on this website although it will not hold any responsibility for any missing or wrong information. Breakout AI provides all information as is. You understand that you are using any and all information available here at your own risk. The technical charts and AI analysis are mathematically generated and are prone to errors or misinterpretations of the market state.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-emerald-400 mb-4">Risk of Trading</h2>
                    <p>
                        The trading of stocks, commodities, and digital assets involves significant risk, and can result in the loss of your invested capital. You should not invest more than you can afford to lose and should ensure that you understand the risks involved. Past performance is not necessarily indicative of future performance. The algorithms may flag historical patterns that have succeeded in the past, but there is zero guarantee these patterns will succeed in current market conditions.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-emerald-400 mb-4">Affiliate & Advertising Disclosure</h2>
                    <p>
                        Breakout AI may contain links to affiliate websites, and we receive an affiliate commission for any purchases made by you on the affiliate website using such links. 
                        We also use third-party advertising companies to serve ads when you visit our Website. These companies may use aggregated information (not including your name, address, email address or telephone number) about your visits to this and other Web sites in order to provide advertisements about goods and services of interest to you.
                    </p>
                </section>
            </div>
        </div>
    );
}
