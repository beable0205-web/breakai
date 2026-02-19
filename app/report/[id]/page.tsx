import { supabase } from "../../lib/supabase";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

// Force dynamic rendering since we are fetching data that changes
export const dynamic = "force-dynamic";

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Fetch report from Supabase
    const { data: report, error } = await supabase
        .from('reports')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !report) {
        notFound();
    }

    // Determine risk color
    let riskColor = "text-gray-400";
    if (report.risk_score >= 80) riskColor = "text-red-500";
    else if (report.risk_score <= 30) riskColor = "text-[#00FF41]";

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 space-y-8">
            <Link href="/" className="flex items-center text-gray-400 hover:text-white transition group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                BACK TO LIST
            </Link>

            <header className="border-b border-[#333] pb-6">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-6xl font-black tracking-tighter mb-2">{report.ticker}</h1>
                        <p className="text-gray-500 text-sm">
                            ANALYSIS REPORT #{report.id} • {new Date(report.created_at).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-500 mb-1">RISK SCORE</div>
                        <div className={`text-5xl font-mono font-bold ${riskColor}`}>
                            {report.risk_score ?? "N/A"}
                        </div>
                    </div>
                </div>
            </header>

            <div className="prose prose-invert max-w-none">
                <div className="bg-[#111] p-8 rounded-lg border border-[#333] font-mono text-gray-300 leading-relaxed whitespace-pre-wrap shadow-2xl">
                    {report.analysis_text}
                </div>
            </div>
        </div>
    );
}
