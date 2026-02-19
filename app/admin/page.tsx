"use client";

import { useState } from "react";
import { Search, Upload, AlertTriangle, Loader2 } from "lucide-react";
import Link from "next/link";
import { analyzeTicker } from "../actions"; // 방금 만든 뇌 파일 가져오기
import TerminalLoader from "../components/TerminalLoader";

export default function AdminPage() {
    const [ticker, setTicker] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState("");

    const handleAnalyze = async () => {
        if (!ticker) return;
        setLoading(true);
        setResult(""); // 결과 초기화

        try {
            // 진짜 AI에게 일을 시킴 (서버로 요청)
            const aiResponse = await analyzeTicker(ticker);

            if (aiResponse.startsWith("Error:")) {
                setResult(aiResponse);
            } else {
                setResult(aiResponse + "\n\n[System] Saved to DB ✅");
            }
        } catch (e) {
            setResult("Error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 space-y-8 p-4">
            {/* 헤더 */}
            <div className="flex items-center space-x-4 mb-8">
                <h1 className="text-3xl font-bold text-[#00FF41]">ADMIN_DASHBOARD</h1>
                <span className="bg-gray-800 text-xs px-2 py-1 rounded border border-gray-600">INTERNAL ONLY</span>
            </div>

            {/* 입력창 섹션 */}
            <div className="bg-[#111] p-6 border border-[#333] rounded-lg space-y-6">
                <h2 className="text-xl font-semibold flex items-center">
                    <Upload className="w-5 h-5 mr-2 text-[#00FF41]" />
                    Target Asset
                </h2>

                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Enter Ticker (e.g. TSLA, NVDA, AAPL)"
                        className="flex-1 bg-black border border-[#333] p-3 rounded text-white focus:border-[#00FF41] outline-none font-mono uppercase"
                        value={ticker}
                        onChange={(e) => setTicker(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                    />
                    <button
                        onClick={handleAnalyze}
                        disabled={loading}
                        className="bg-[#00FF41] text-black font-bold px-6 py-3 rounded hover:bg-green-400 disabled:opacity-50 flex items-center min-w-[140px] justify-center"
                    >
                        {loading ? <Loader2 className="animate-spin mr-2" /> : <Search className="w-4 h-4 mr-2" />}
                        {loading ? "ANALYZING..." : "ANALYZE"}
                    </button>
                </div>
            </div>

            {/* 결과 출력창 (터미널 스타일) */}
            <div className="bg-black border border-[#333] rounded-lg p-6 min-h-[300px] font-mono text-sm shadow-inner shadow-gray-900 relative">
                <div className="text-gray-500 border-b border-[#333] pb-2 mb-4 flex justify-between">
                    <span>AI_VERDICT_OUTPUT</span>
                    <span className="text-xs text-[#00FF41]">{loading ? "● LIVE" : "● READY"}</span>
                </div>
                {/* 결과 영역 */}
                {loading ? (
                    <div className="flex justify-center p-12">
                        <TerminalLoader />
                    </div>
                ) : result ? (
                    <div className="w-full max-w-4xl mx-auto">
                        <div className="p-4 bg-[#111] border border-[#333] rounded mb-4">
                            <h3 className="text-[#00FF41] font-bold mb-2">ANALYSIS PREVIEW</h3>
                            {(() => {
                                try {
                                    const analysis = JSON.parse(result);
                                    return (
                                        <div className="space-y-4 text-sm font-mono">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-4 border border-[#333]">
                                                    <strong className="block text-gray-500 mb-1">CEO CLAIM</strong>
                                                    <span className="text-gray-300">"{analysis.ceo_claim}"</span>
                                                </div>
                                                <div className="p-4 border border-[#333]">
                                                    <strong className="block text-[#00FF41] mb-1">REALITY</strong>
                                                    <span className="text-white">{analysis.reality_check}</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center border-t border-[#333] pt-4">
                                                <span>VERDICT: <strong className={analysis.verdict === 'SELL' ? 'text-red-500' : 'text-[#00FF41]'}>{analysis.verdict}</strong></span>
                                                <span>RISK SCORE: {analysis.risk_score}</span>
                                            </div>
                                            <div className="text-gray-400 italic">
                                                "{analysis.one_line_summary}"
                                            </div>
                                        </div>
                                    );
                                } catch (e) {
                                    return <div className="whitespace-pre-line text-gray-200">{result}</div>;
                                }
                            })()}
                        </div>
                        <div className="text-center">
                            <Link href="/" className="text-[#00FF41] hover:underline">
                                View Full Dashboard &rarr;
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-12">
                        <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Enter a ticker to expose the truth.</p>
                    </div>
                )}
            </div>
        </div>
    );
}