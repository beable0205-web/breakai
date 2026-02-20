"use client";
import Link from "next/link";
import React, { useState } from "react";

interface StockCardProps {
    ticker: string;
    name: string;
    price: string | number;
    changePercent: number;
    logoUrl: string;
}

export default function StockCard({ ticker, name, price, changePercent, logoUrl }: StockCardProps) {
    const isPositive = changePercent >= 0;
    const colorClass = isPositive ? "text-emerald-400" : "text-rose-400";
    const sign = isPositive ? "+" : "";

    // Bulletproof Fallback state
    const [imgSrc, setImgSrc] = useState(logoUrl || `https://logo.clearbit.com/${ticker.toLowerCase()}.com`);

    return (
        <Link href={`/hub/${ticker}`}>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:scale-105 transition-transform duration-300 hover:border-zinc-600 cursor-pointer shadow-lg flex justify-between items-center group">
                <div className="flex items-center gap-4">
                    <img
                        src={imgSrc}
                        alt={`${ticker} logo`}
                        className="w-12 h-12 rounded-full object-contain bg-white p-1"
                        onError={() => {
                            setImgSrc(`https://ui-avatars.com/api/?name=${ticker}&background=27272a&color=fff&bold=true&rounded=true`);
                        }}
                    />
                    <div>
                        <h3 className="font-bold text-white text-lg tracking-tight group-hover:text-amber-400 transition-colors">{name}</h3>
                        <p className="text-zinc-500 font-mono text-sm">{ticker}</p>
                    </div>
                </div>

                <div className="text-right">
                    <p className="font-mono text-xl font-bold text-white">{typeof price === 'number' ? `$${price.toFixed(2)}` : price}</p>
                    <p className={`font-mono text-sm font-medium ${colorClass}`}>
                        {sign}{typeof changePercent === 'number' ? changePercent.toFixed(2) : changePercent}%
                    </p>
                </div>
            </div>
        </Link>
    );
}
