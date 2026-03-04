import { NextResponse } from 'next/server';
import { supabase } from "../../../lib/supabase";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        console.log("[Admin] Starting Manual Daily Market Summary Generation...");

        // 1. Fetch Live Market Tickers from Yahoo Finance
        const indices = ['^GSPC', '^IXIC', '^DJI'];

        const fetchPromises = indices.map(async (ticker) => {
            const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1d`;
            try {
                const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, cache: 'no-store' });
                const data = await res.json();
                const meta = data?.chart?.result?.[0]?.meta;
                if (meta) {
                    const price = meta.regularMarketPrice;
                    const prevClose = meta.chartPreviousClose;
                    const changePercent = ((price - prevClose) / prevClose) * 100;
                    const name = ticker === '^GSPC' ? 'S&P 500' : ticker === '^IXIC' ? 'NASDAQ' : 'Dow Jones';
                    return `${name}: ${price.toFixed(2)} (${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%)\n`;
                }
            } catch (e) {
                console.error(`Failed to fetch index ${ticker}`, e);
            }
            return "";
        });

        const results = await Promise.all(fetchPromises);
        let marketDataStr = results.join('');

        if (!marketDataStr.trim()) {
            marketDataStr = "Market data unavailable today.";
        }

        const dateStr = new Date().toISOString().split('T')[0];

        // 2. Prompt Gemini AI with "Truth of Market" English parameters
        const prompt = `
You are a highly analytical, objective, and professional Wall Street algorithmic analyst.
Your job is to write a short, punchy, engaging "Daily Market Briefing" in a style similar to "Truth of Market" newsletters, but entirely in English.
This is for the end of the US trading day on ${dateStr}.

Here is the raw closing data for the major indices:
${marketDataStr}

Instructions:
1. Write exactly 3 sections. Use relevant emojis for headings and bullet points to make it visually engaging.
2. Section 1 (Executive Summary & Indices): Summarize if the market went up or down, the overall sentiment, AND explicitly list the 1-day percentage change for the S&P 500, NASDAQ, and Dow Jones using the raw data provided above.
3. Section 2 (Key Market Drivers): Identify and list the 3 most important news headlines, macro events, or sector shifts that drove the US market today. Use bullet points for these 3 items.
4. Section 3 (The AI Verdict): Give a 1-sentence forward-looking thought or technical warning.
5. Format the text nicely in Markdown. Use bolding for key terms.
6. Write entirely in English, keeping the tone highly readable, sharp, and structured.

Title Requirement:
The very first line of your response MUST BE the title formatted strictly like this:
TITLE: 💎 Market Briefing (${dateStr})
Content begins on the next line.
`;

        const customGoogle = createGoogleGenerativeAI({
            apiKey: process.env.GEMINI_API_KEY || '',
        });
        const model = customGoogle("gemini-1.5-pro");

        const { text } = await generateText({
            model: model,
            prompt: prompt,
            temperature: 0.7,
        });

        // 3. Parse the Title and Content
        let title = `💎 Market Briefing (${dateStr})`;
        let content = text;

        if (text.startsWith("TITLE:")) {
            const lines = text.split('\n');
            title = lines[0].replace("TITLE:", "").trim();
            content = lines.slice(1).join('\n').trim();
        }

        // 4. Save to Supabase
        const { error } = await supabase
            .from('market_summaries')
            .upsert(
                {
                    date: dateStr,
                    title: title,
                    content: content
                },
                { onConflict: 'date' }
            );

        if (error) {
            console.error("[Admin DB Error]:", error);
            return NextResponse.json({ success: false, error: 'Failed to save summary to database' }, { status: 500 });
        }

        console.log(`[Admin] Successfully generated and saved summary for ${dateStr}`);
        return NextResponse.json({ success: true, message: `Market briefing for ${dateStr} generated successfully!`, date: dateStr, title });

    } catch (error) {
        console.error('[Admin] Fatal error generating daily summary:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
