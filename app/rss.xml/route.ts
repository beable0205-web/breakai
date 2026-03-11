import { supabase } from '../lib/supabase';
import { Feed } from 'feed';

export const revalidate = 0; // Prevent Next.js from caching the RSS feed

export async function GET() {
    const baseUrl = 'https://getbreakai.com';

    const feed = new Feed({
        title: "Breakout AI | Institutional Grade Stock Screener",
        description: "Data-driven financial analysis powered by AI. We scan 1,000+ top US stocks daily.",
        id: baseUrl,
        link: baseUrl,
        language: "en",
        image: `${baseUrl}/logo.png`, // Add an actual logo path if you have one
        favicon: `${baseUrl}/favicon.ico`,
        copyright: `All rights reserved ${new Date().getFullYear()}, Breakout AI`,
        author: {
            name: "Breakout AI Team",
            email: "beable9489@gmail.com",
            link: baseUrl
        }
    });

    // 1. Fetch latest oneil_picks
    const { data: picks } = await supabase
        .from('oneil_picks')
        .select('*')
        .order('pick_date', { ascending: false })
        .limit(20);

    if (picks) {
        picks.forEach(pick => {
            const url = `${baseUrl}/picks/${pick.id}`;
            feed.addItem({
                title: `${pick.ticker} - O'Neil Screener Pick (${pick.oneil_score}/100)`,
                id: url,
                link: url,
                description: `Breakout AI has identified ${pick.ticker} as a potential opportunity with an algorithm score of ${pick.oneil_score}.`,
                content: pick.technical_details ? JSON.stringify(pick.technical_details) : "Detailed technical analysis available on the platform.",
                author: [
                    {
                        name: "Breakout AI Algo",
                        email: "beable9489@gmail.com",
                        link: baseUrl
                    }
                ],
                date: new Date(pick.pick_date)
            });
        });
    }

    // 2. Fetch latest reports for Hubs
    const { data: reports } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

    if (reports) {
        reports.forEach(report => {
            const url = `${baseUrl}/hub/${report.ticker}`;
            feed.addItem({
                title: `${report.ticker} - AI Deep Dive Research`,
                id: url,
                link: url,
                description: report.summary || `Read our latest AI-generated institutional research report for ${report.ticker}.`,
                content: report.long_term_analysis || "Detailed institutional analysis available on the platform.",
                author: [
                    {
                        name: "Breakout AI Research",
                        email: "beable9489@gmail.com",
                        link: baseUrl
                    }
                ],
                date: new Date(report.created_at || new Date())
            });
        });
    }

    // 3. Fetch latest market summaries (Briefings)
    const { data: summaries } = await supabase
        .from('market_summaries')
        .select('*')
        .order('date', { ascending: false })
        .limit(20);

    if (summaries) {
        summaries.forEach(summary => {
            const url = `${baseUrl}/briefing/${summary.id}`;
            feed.addItem({
                title: `${summary.title}`,
                id: url,
                link: url,
                description: summary.content.substring(0, 200) + '...',
                content: summary.content,
                author: [
                    {
                        name: "Breakout AI Market Intelligence",
                        email: "beable9489@gmail.com",
                        link: baseUrl
                    }
                ],
                date: new Date(summary.date || new Date())
            });
        });
    }

    // Sort feed items by date before generating XML to ensure chronological order
    feed.items.sort((a, b) => b.date.getTime() - a.date.getTime());

    return new Response(feed.rss2(), {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
        },
    });
}
