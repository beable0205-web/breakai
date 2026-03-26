"use client";
import React from "react";
import { useRouter, useSearchParams } from 'next/navigation';

export default function ScoreFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentScore = searchParams.get('score') || 'all';

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        if (val === 'all') {
            router.push('/picks');
        } else {
            router.push(`/picks?score=${val}`);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest font-bold">Min Score:</span>
            <div className="relative">
                <select 
                    value={currentScore} 
                    onChange={handleChange}
                    className="bg-zinc-900 border border-zinc-800 text-[#00FF41] text-xs font-mono py-1 pl-3 pr-8 rounded hover:border-zinc-700 focus:outline-none focus:border-[#00FF41] transition-colors appearance-none cursor-pointer font-bold"
                >
                    <option value="all">Any Score</option>
                    <option value="80">80+ (Strong)</option>
                    <option value="90">90+ (Elite)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                </div>
            </div>
        </div>
    );
}
