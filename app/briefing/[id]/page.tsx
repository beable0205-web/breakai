import { createClient } from "../../../utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, CornerUpLeft } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const supabaseServer = await createClient();
    const { data: summary } = await supabaseServer
        .from('market_summaries')
        .select('title')
        .eq('id', resolvedParams.id)
        .single();

    return {
        title: summary?.title ? `Breakout AI | ${summary.title}` : "Breakout AI | Daily Market Briefing",
        description: "Wall Street prop trader's view on today's core market action and investment insights.",
    };
}

export default async function BriefingDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const supabaseServer = await createClient();

    const { data: summary, error } = await supabaseServer
        .from('market_summaries')
        .select('*')
        .eq('id', resolvedParams.id)
        .single();

    if (error || !summary) {
        return notFound();
    }

    const dateObj = new Date(summary.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });

    const cleanTitle = summary.title.replace(/\*\*/g, '').trim();

    return (
        <div className="min-h-screen bg-black text-slate-200 selection:bg-[#00FF41]/30 font-sans pb-24">
            {/* Minimal Header */}
            <div className="bg-[#0a0a0c] border-b border-[#333] sticky top-0 z-40 backdrop-blur-3xl bg-opacity-70">
                <div className="max-w-4xl mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
                    <Link href="/briefing" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2 font-bold text-sm tracking-widest font-mono">
                        <ArrowLeft className="w-4 h-4" /> BACK TO ARCHIVE
                    </Link>
                    <div className="text-[#00FF41] font-bold font-mono tracking-widest text-xs border border-emerald-900/50 bg-emerald-950/20 px-3 py-1 rounded">
                        MARKET BRIEFING
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 lg:px-6 pt-12">
                {/* Article Header */}
                <header className="mb-12 border-b border-[#222] pb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <Calendar className="text-[#00FF41] w-5 h-5" />
                        <span className="text-sm font-mono font-bold tracking-widest text-zinc-400 uppercase">
                            {formattedDate}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-8 font-serif">
                        {cleanTitle}
                    </h1>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-emerald-950/30 border border-emerald-900/50 flex items-center justify-center">
                                <span className="font-bold font-mono text-[#00FF41]">AI</span>
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500 font-mono tracking-widest uppercase mb-0.5">Written by</p>
                                <p className="text-sm text-zinc-300 font-bold tracking-wider font-sans">O'Neil Matrix Algorithm</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Markdown Content rendered via ReactMarkdown */}
                <article className="prose prose-invert prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-h2:text-white prose-h2:border-b prose-h2:border-[#222] prose-h2:pb-3 prose-p:text-zinc-400 prose-p:leading-relaxed prose-li:text-zinc-400 prose-strong:text-white prose-a:text-[#00FF41] prose-blockquote:border-[#00FF41] prose-blockquote:bg-emerald-950/10 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:not-italic prose-blockquote:font-mono prose-blockquote:text-zinc-300">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {summary.content}
                    </ReactMarkdown>
                </article>

                {/* Footer Navigation Back */}
                <div className="mt-20 pt-8 border-t border-[#222] flex justify-start">
                    <Link href="/briefing" className="inline-flex items-center justify-center bg-black border border-zinc-800 hover:border-[#00FF41]/50 hover:bg-zinc-900 text-white font-bold py-4 px-8 rounded transition-all shadow-lg text-sm font-mono tracking-widest uppercase gap-3 hover:text-[#00FF41]">
                        <CornerUpLeft className="w-5 h-5" /> View All Briefings
                    </Link>
                </div>
            </main>
        </div>
    );
}
