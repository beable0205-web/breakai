"use client";
import React, { useEffect, useState } from "react";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Legend, Cell } from 'recharts';
import { Activity, TrendingUp, BarChart2, DollarSign } from "lucide-react";
import { fetchHistoricalFearAndGreed, FearAndGreedDataPoint } from "../../utils/fearAndGreed";
import { fetchYahooFundamentalData, YahooFinanceData } from "../../utils/yahooFinanceApi";

interface FundamentalTrendsProps {
    ticker: string;
}

export default function FundamentalTrends({ ticker }: FundamentalTrendsProps) {
    const [fgData, setFgData] = useState<FearAndGreedDataPoint[]>([]);
    const [yData, setYData] = useState<YahooFinanceData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const [fg, yahoo] = await Promise.all([
                    fetchHistoricalFearAndGreed(30),
                    fetchYahooFundamentalData(ticker)
                ]);
                setFgData(fg);
                setYData(yahoo);
            } catch (e) {
                console.error("Error loading fundamental trends", e);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [ticker]);

    if (loading) {
        return (
            <div className="w-full h-64 flex flex-col items-center justify-center border border-zinc-800 bg-zinc-900/50 rounded-xl my-6">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-zinc-500 font-mono tracking-widest text-xs uppercase">Loading Yahoo Finance Data...</p>
            </div>
        );
    }

    // Process Yahoo EPS Data for the Bar Chart
    // We filter valid estimates and separate current vs forward growth intuitively.
    const epsChartData = (yData?.trends || [])
        .filter(t => t.earningsEstimateAvg !== null)
        .map(t => {
            const isYearly = t.period.includes('y');
            const label = t.period === "0q" ? "This Qtr" : 
                          t.period === "+1q" ? "Next Qtr" : 
                          t.period === "0y" ? "This Year" : 
                          t.period === "+1y" ? "Next Year" : t.period;
            
            return {
                name: label,
                eps: t.earningsEstimateAvg,
                growth: t.growth ? (t.growth * 100).toFixed(1) : 0,
                isYearly
            };
        });

    return (
        <div className="space-y-8 my-8 print:space-y-4">
            
            {/* Fear and Greed Market Sentiment Trend */}
            <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 print:bg-white print:border-gray-300">
                <h3 className="text-zinc-300 font-bold mb-6 flex items-center gap-2 text-sm tracking-widest uppercase font-mono print:text-black">
                    <Activity className="w-4 h-4 text-blue-500" />
                    Macro Sentiment (Fear & Greed - 30D Trend)
                </h3>
                <div className="w-full h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={fgData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis dataKey="date" stroke="#666" fontSize={10} tickMargin={10} />
                            <YAxis domain={[0, 100]} stroke="#666" fontSize={10} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#111', border: '1px solid #333', fontSize: '12px', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" name="F&G Score" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:grid-cols-2 print:gap-4">
                
                {/* 1. Yahoo Finance Forward EPS Estimate (Bar Chart) */}
                <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 print:bg-white print:border-gray-300 print:break-inside-avoid shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#00FF41]"></div>
                    <h3 className="text-zinc-300 font-bold mb-6 flex items-center gap-2 text-sm tracking-widest uppercase font-mono print:text-black">
                        <TrendingUp className="w-4 h-4 text-[#00FF41]" />
                        Consensus EPS Estimates
                    </h3>
                    <div className="w-full h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={epsChartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis dataKey="name" stroke="#666" fontSize={11} tickMargin={10} />
                                <YAxis stroke="#666" fontSize={10} />
                                <Tooltip 
                                    cursor={{fill: '#222'}}
                                    contentStyle={{ backgroundColor: '#111', border: '1px solid #333', fontSize: '12px', borderRadius: '8px' }}
                                    formatter={(value: any, name: any, props: any) => {
                                        if (name === 'EPS') return [`$${value}`, 'Consensus EPS'];
                                        return [value, name];
                                    }}
                                />
                                <Bar dataKey="eps" name="EPS" radius={[6, 6, 0, 0]} maxBarSize={60}>
                                    {epsChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.isYearly ? "#00FF41" : "#10b981"} fillOpacity={entry.isYearly ? 0.9 : 0.6} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. Yahoo Finance Valuation Breakdown */}
                <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 print:bg-white print:border-gray-300 print:break-inside-avoid shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                    <h3 className="text-zinc-300 font-bold mb-6 flex items-center gap-2 text-sm tracking-widest uppercase font-mono print:text-black">
                        <BarChart2 className="w-4 h-4 text-purple-500" />
                        Valuation Multiples
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4 h-[calc(100%-3rem)] content-center">
                        <div className="bg-black/50 p-4 rounded-lg border border-zinc-800 flex flex-col items-center justify-center">
                            <span className="text-zinc-500 text-xs font-mono tracking-widest uppercase mb-1">Trailing P/E</span>
                            <span className="text-3xl font-black text-white">{yData?.metrics?.trailingPE?.toFixed(1) || 'N/A'}</span>
                            <span className="text-zinc-600 text-[10px] mt-1 uppercase">Past 12 Months</span>
                        </div>
                        <div className="bg-purple-950/20 p-4 rounded-lg border border-purple-900/50 flex flex-col items-center justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span className="text-purple-400 text-xs font-mono tracking-widest uppercase mb-1 flex items-center gap-1">
                                <DollarSign className="w-3 h-3" /> Fwd P/E
                            </span>
                            <span className="text-3xl font-black text-purple-400">{yData?.metrics?.forwardPE?.toFixed(1) || 'N/A'}</span>
                            <span className="text-purple-500/50 text-[10px] mt-1 uppercase">Next 12 Months</span>
                        </div>
                        <div className="bg-black/50 p-4 rounded-lg border border-zinc-800 flex flex-col items-center justify-center">
                            <span className="text-zinc-500 text-xs font-mono tracking-widest uppercase mb-1">P/B Ratio</span>
                            <span className="text-xl font-bold text-zinc-300">{yData?.metrics?.priceToBook?.toFixed(1) || 'N/A'}</span>
                        </div>
                        <div className="bg-black/50 p-4 rounded-lg border border-zinc-800 flex flex-col items-center justify-center">
                            <span className="text-zinc-500 text-xs font-mono tracking-widest uppercase mb-1">PEG Ratio</span>
                            <span className={`text-xl font-bold ${yData?.metrics?.pegRatio && yData.metrics.pegRatio <= 1 ? 'text-[#00FF41]' : 'text-zinc-300'}`}>
                                {yData?.metrics?.pegRatio?.toFixed(2) || 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>

            </div>

            <div className="text-right">
                <span className="text-[10px] text-zinc-600 font-mono tracking-widest uppercase">Data verified via Yahoo Finance API</span>
            </div>
        </div>
    );
}
