"use client";

import { Gift, ExternalLink } from "lucide-react";

interface AffiliateBannerProps {
    brokerName?: string;
    description?: string;
    bonusText?: string;
    affiliateLink?: string;
}

export default function AffiliateBanner({
    brokerName = "Webull",
    description = "Trade this technical setup instantly with zero commission.",
    bonusText = "Get up to 20 FREE fractional shares!",
    affiliateLink = "https://www.webull.com/ko" // PLACEHOLDER: Replace this!
}: AffiliateBannerProps) {
    return (
        <a 
            href={affiliateLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full group mt-8 mb-4"
        >
            <div className="relative overflow-hidden bg-[#050505] border border-zinc-800 hover:border-[#00FF41]/60 rounded-2xl p-6 transition-all duration-300 shadow-xl group-hover:shadow-[0_0_30px_rgba(0,255,65,0.15)] flex flex-col md:flex-row items-center justify-between gap-6">
                
                {/* Background Glow */}
                <div className="absolute -left-20 -top-20 w-40 h-40 bg-[#00FF41]/10 rounded-full blur-[50px] group-hover:bg-[#00FF41]/20 transition-all duration-500 pointer-events-none"></div>

                <div className="flex items-center gap-5 z-10 w-full md:w-auto">
                    <div className="w-14 h-14 bg-emerald-950/40 rounded-xl flex items-center justify-center border border-emerald-900/50 group-hover:scale-110 transition-transform duration-300 shrink-0">
                        <Gift className="w-7 h-7 text-[#00FF41]" />
                    </div>
                    <div className="flex flex-col text-left">
                        <h4 className="text-xl font-bold text-white mb-1 group-hover:text-[#00FF41] transition-colors font-serif">
                            Trade on {brokerName}
                        </h4>
                        <p className="text-zinc-400 text-sm font-mono leading-snug">
                            {description}
                        </p>
                    </div>
                </div>

                <div className="z-10 w-full md:w-auto flex flex-col items-center md:items-end gap-3">
                    <div className="bg-rose-500/10 border border-rose-500/20 px-4 py-1.5 rounded-full">
                        <span className="text-rose-400 text-xs font-black tracking-widest uppercase animate-pulse">
                            🎁 {bonusText}
                        </span>
                    </div>
                    <div className="flex items-center text-sm font-bold text-[#00FF41] uppercase tracking-wider font-mono">
                        Claim Offer <ExternalLink className="w-4 h-4 ml-1.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>
                </div>

            </div>
        </a>
    );
}
