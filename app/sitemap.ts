import { MetadataRoute } from 'next';
import { supabase } from './lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://getbreakai.com';

    // 1. Fetch distinct tickers from reports to populate /hub/[ticker]
    const { data: reports } = await supabase
        .from('reports')
        .select('ticker, created_at')
        .order('created_at', { ascending: false });

    // Deduplicate tickers to keep only the latest date for each hub
    const hubMap = new Map<string, Date>();
    if (reports) {
        reports.forEach(report => {
            if (report.ticker && report.created_at) {
                const date = new Date(report.created_at);
                if (!hubMap.has(report.ticker)) {
                    hubMap.set(report.ticker, date);
                }
            }
        });
    }

    const hubRoutes: MetadataRoute.Sitemap = Array.from(hubMap.entries()).map(([ticker, date]) => ({
        url: `${baseUrl}/hub/${ticker}`,
        lastModified: date,
        changeFrequency: 'weekly',
        priority: 0.7,
    }));

    // 2. Fetch all oneil_picks
    const { data: picks } = await supabase
        .from('oneil_picks')
        .select('id, pick_date')
        .order('pick_date', { ascending: false });

    const pickRoutes: MetadataRoute.Sitemap = (picks || []).map(pick => ({
        url: `${baseUrl}/picks/${pick.id}`,
        lastModified: new Date(pick.pick_date),
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    // 3. Static routes
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/pricing`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/disclaimer`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/picks`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        }
    ];

    return [...staticRoutes, ...hubRoutes, ...pickRoutes];
}
