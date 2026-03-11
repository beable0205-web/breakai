import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface DailyBriefingProps {
    summary: {
        date: string;
        title: string;
        content: string;
    } | null;
}

export default function DailyBriefing({ summary }: DailyBriefingProps) {
    if (!summary) return null;

    return (
        <section className="mb-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <h3 className="text-2xl font-bold text-white flex flex-wrap items-center gap-2">
                    <span className="text-xl">🌎</span> Daily Market Briefing <span className="text-xs bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold ml-2 animate-pulse whitespace-nowrap">FREE TODAY</span>
                </h3>
                <Link href="/briefing" className="inline-flex items-center text-sm font-bold text-zinc-400 hover:text-[#00FF41] transition-colors font-mono tracking-widest uppercase">
                    View Archive <ArrowUpRight className="ml-1 w-4 h-4" />
                </Link>
            </div>
            <div className="bg-[#111] border border-[#333] rounded-2xl p-8 hover:border-zinc-700 transition-colors shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>

                <h4 className="text-xl font-black text-white mb-4 tracking-tight">
                    {summary.title}
                </h4>

                <div className="prose prose-invert prose-emerald prose-sm max-w-none prose-p:leading-relaxed prose-p:text-zinc-300 prose-headings:text-white prose-strong:text-white">
                    <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                        {summary.content}
                    </ReactMarkdown>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-between items-center text-xs font-mono text-zinc-500">
                    <span className="flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span>
                        AI Generated Intelligence
                    </span>
                    <span>{summary.date}</span>
                </div>
            </div>
        </section>
    );
}
