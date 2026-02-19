"use client";

import { useState } from "react";
import InvestmentGauge from "./InvestmentGauge";
import ReactMarkdown from 'react-markdown';
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import FinancialTable from "./FinancialTable";

interface ReportCardProps {
    report: {
        id: number;
        ticker: string;
        investment_score?: number;
        risk_score?: number;
        verdict: string;
        one_line_summary: string;
        created_at: string;
        bull_case_summary?: string;
        bear_case_summary?: string;
        ceo_claim?: string;
        reality_check?: string;
        detailed_report?: string;
        financial_table?: any;
    };
}

export default function ReportCard({ report }: ReportCardProps) {
    const [expanded, setExpanded] = useState(false);
    const score = report.investment_score ?? (report.risk_score ? 100 - report.risk_score : 50);

    return (
        <div className="bg-[#18181b] border border-[#27272a] rounded-2xl overflow-hidden shadow-2xl font-sans mb-8 transition-all hover:border-[#3f3f46]">
            {/* Header: Ticker & Badges */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-[#27272a]">
                <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-white tracking-tight">{report.ticker}</span>
                    <span className="text-xs font-mono text-zinc-500 bg-zinc-900 px-2 py-1 rounded">
                        {new Date(report.created_at).toLocaleDateString()}
                    </span>
                </div>
                <div className={`px-3 py-1 text-xs font-bold rounded-full tracking-wide ${report.verdict === 'BUY' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                        report.verdict === 'SELL' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
                            'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                    }`}>
                    {report.verdict}
                </div>
            </div>

            {/* Bento Grid Layout */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">

                {/* 1. Top Left: Investment Gauge (Span 4) */}
                <div className="md:col-span-4 bg-[#09090b] rounded-xl border border-[#27272a] p-6 flex flex-col items-center justify-center relative min-h-[200px]">
                    <InvestmentGauge score={score} />
                </div>

                {/* 2. Top Right: Analyst Summary (Span 8) */}
                <div className="md:col-span-8 bg-[#09090b] rounded-xl border border-[#27272a] p-6 flex flex-col justify-center">
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Analyst Verdict</h4>
                    <p className="text-zinc-100 text-lg font-medium leading-relaxed">
                        {report.one_line_summary}
                    </p>
                </div>

                {/* 3. Middle: Chart (Span 12) */}
                <div className="md:col-span-12 h-[350px] bg-[#09090b] rounded-xl border border-[#27272a] overflow-hidden relative">
                    <AdvancedRealTimeChart
                        symbol={report.ticker}
                        theme="dark"
                        autosize
                        hide_top_toolbar
                        hide_side_toolbar
                        interval="D"
                        style="1"
                        backgroundColor="rgba(9, 9, 11, 1)"
                    />
                </div>

                {/* 4. Bottom Split: Bull vs Bear (Span 6 each) */}
                <div className="md:col-span-6 bg-[#09090b] rounded-xl border border-emerald-900/30 p-6 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-transparent opacity-50"></div>
                    <h4 className="text-emerald-500 font-bold mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        THE BULL CASE
                    </h4>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                        {report.bull_case_summary || report.ceo_claim || "No data available."}
                    </p>
                </div>

                <div className="md:col-span-6 bg-[#09090b] rounded-xl border border-rose-900/30 p-6 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-transparent opacity-50"></div>
                    <h4 className="text-rose-500 font-bold mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        THE BEAR CASE
                    </h4>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                        {report.bear_case_summary || report.reality_check || "No data available."}
                    </p>
                </div>

                {/* 5. Financials (Span 12) */}
                {report.financial_table && (
                    <div className="md:col-span-12">
                        <FinancialTable data={report.financial_table} />
                    </div>
                )}

            </div>

            {/* Footer: Expand Button */}
            {report.detailed_report && (
                <div className="border-t border-[#27272a] bg-[#09090b]">
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="w-full py-4 text-xs font-bold text-zinc-500 hover:text-white hover:bg-[#18181b] transition-all uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                        {expanded ? "Collapse Analysis" : "Read Full Investment Memo"}
                        <span className="text-[10px]">{expanded ? "▲" : "▼"}</span>
                    </button>
                    {expanded && (
                        <div className="p-8 md:p-12 prose prose-invert prose-zinc max-w-none border-t border-[#27272a] bg-[#09090b]">
                            <ReactMarkdown>{report.detailed_report}</ReactMarkdown>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
