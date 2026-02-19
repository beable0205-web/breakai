import Link from "next/link";
import { supabase } from "./lib/supabase";
import ReportCard from "./components/ReportCard";

// 30초마다 데이터 갱신 (ISR)evalidate every 60 seconds (or 0 for real-time)
export const revalidate = 0;

export default async function Home() {
  // 1. Fetch reports from Supabase
  const { data: reports, error } = await supabase
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching reports:", JSON.stringify(error, null, 2));
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 mt-10 p-4 font-mono text-gray-100">
      {/* Hero Section */}
      <section className="text-center space-y-4 mb-16">
        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-2">
          Market<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Truth</span>
        </h2>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
          Institutional-grade forensic analysis driven by AI.
        </p>
        <div className="flex justify-center gap-4 mt-8">
          <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-500 flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
            SYSTEM ONLINE
          </span>
          <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-500">
            {reports?.length || 0} REPORTS FILED
          </span>
        </div>
      </section>

      {/* Report Grid */}
      <div className="max-w-7xl mx-auto">
        {reports?.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>

      {reports?.length === 0 && (
        <div className="text-center py-24 text-zinc-600 border border-zinc-800 rounded-2xl border-dashed bg-[#09090b]">
          <p className="text-xl mb-6 font-medium">No Analysis Reports Found</p>
          <Link href="/admin" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-emerald-900 bg-emerald-100 hover:bg-emerald-200 transition-all">
            Initialize Analysis Protocol
          </Link>
        </div>
      )}
    </div>
  );
}