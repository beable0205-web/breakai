import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fetch from 'cross-fetch';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!supabaseUrl || !supabaseKey || !geminiApiKey) {
    console.error("Missing required environment variables.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
    global: { fetch: fetch }
});
const genAI = new GoogleGenerativeAI(geminiApiKey);

// A robust list of top high-volume, high-quality US stocks (S&P 500 & NASDAQ 100 leaders)
// In production, this can be expanded to 1000+ stocks via an external JSON file.
const TARGET_TICKERS = [
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NVDA', 'AMD', 'INTC', 'TSM',
    'AVGO', 'QCOM', 'CRWD', 'PLTR', 'SNOW', 'MDB', 'SOFI', 'PFE', 'JNJ', 'JPM',
    'V', 'MA', 'DIS', 'NFLX', 'CMCSA', 'PEP', 'KO', 'MCD', 'SBUX', 'NKE',
    'ADBE', 'CRM', 'ORCL', 'CSCO', 'IBM', 'NOW', 'UBER', 'ABNB', 'SHOP', 'SQ',
    'PYPL', 'HOOD', 'COIN', 'RBLX', 'U', 'DKNG', 'PENN', 'LVS', 'MGM', 'WYNN',
    'MAR', 'HLT', 'DAL', 'UAL', 'AAL', 'LUV', 'BA', 'LMT', 'NOC', 'GD'
];

/**
 * Fetch ~2 years (500+ trading days) of daily historical prices for MA calculation
 */
async function fetchHistoricalData(ticker) {
    // 2 years back is roughly 504 trading days, let's fetch '2y' interval '1d'
    const url = `https://query2.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=2y`;
    const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!response.ok) {
        throw new Error(`Failed to fetch historical data for ${ticker}: ${response.statusText}`);
    }
    const data = await response.json();
    const result = data.chart?.result?.[0];
    if (!result || !result.timestamp || !result.indicators.quote[0].close) {
        return [];
    }

    // Combine timestamp and close prices
    const prices = [];
    const closes = result.indicators.quote[0].close;
    for (let i = 0; i < result.timestamp.length; i++) {
        if (closes[i] !== null) {
            prices.push({
                date: new Date(result.timestamp[i] * 1000),
                close: closes[i],
                volume: result.indicators.quote[0].volume[i] || 0
            });
        }
    }
    return prices.sort((a, b) => a.date - b.date);
}

/**
 * Calculates a simple moving average for the given period
 */
function calculateMA(prices, period) {
    if (prices.length < period) return null;
    const subset = prices.slice(prices.length - period);
    const sum = subset.reduce((acc, val) => acc + val.close, 0);
    return sum / period;
}

/**
 * William O'Neil 'Cup and Handle' Technical Analysis Logic applied to Moving Averages
 * Looks for stocks where price recently broke above the 224-day MA after a long 'Cup' consolidation, 
 * forming a 'Handle' near the MA prior to breakout.
 */
function analyzeONeilPattern(prices) {
    if (prices.length < 448) {
        return { isPick: false, reason: "Not enough historical data for 448-day MA (requires ~2 years)." };
    }

    const ma112 = calculateMA(prices, 112);
    const ma224 = calculateMA(prices, 224);
    const ma448 = calculateMA(prices, 448);
    const currentPrice = prices[prices.length - 1].close;
    const currentVolume = prices[prices.length - 1].volume;

    // Average volume over last 20 days
    const avgVol20 = prices.slice(-20).reduce((acc, val) => acc + val.volume, 0) / 20;

    if (!ma224 || !ma112 || !ma448) return { isPick: false, reason: "MA calculation failed." };

    const distanceTo224 = (currentPrice - ma224) / ma224;

    // Cup and Handle Breakout: Price is above 224MA by a small margin (0% to 10%) -> Good entry point
    if (distanceTo224 > 0 && distanceTo224 < 0.10) {
        // Did it break out recently from the handle?
        const price20DaysAgo = prices[prices.length - 21].close;
        const ma224_20DaysAgo = calculateMA(prices.slice(0, prices.length - 20), 224);

        const wasBelowOrNear = (price20DaysAgo < ma224_20DaysAgo * 1.02);
        const volumeSurge = currentVolume > (avgVol20 * 1.5); // 50% above average volume is an excellent breakout signal

        if (wasBelowOrNear) {
            let score = 85;
            if (volumeSurge) score += 10; // Bonus for high volume breakout

            return {
                isPick: true,
                score: score,
                details: {
                    ma112, ma224, ma448, currentPrice, volume: currentVolume,
                    message: "Broke above 224-day MA recently. Classic 'Cup and Handle' breakout entry." + (volumeSurge ? " Accompanied by massive volume surge." : "")
                }
            };
        } else {
            return { isPick: false, reason: "Already trending above 224MA for too long." };
        }
    }

    // Deep Base pattern: deeply oversold below 448MA, forming the bottom of a massive cup
    const distanceTo448 = (currentPrice - ma448) / ma448;
    if (distanceTo448 < -0.30) {
        return {
            isPick: true,
            score: 75,
            details: {
                ma112, ma224, ma448, currentPrice, volume: currentVolume,
                message: "Price is 30%+ below 448-day MA. Potential Deep Cup bottoming process."
            }
        }
    }

    return { isPick: false, reason: "No specific William O'Neil pattern found." };
}

/**
 * Generate Gemini Corporate Report
 */
async function generateAIReport(ticker, technicalDetails) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `
You are an elite financial analyst for 'Breakout AI'. You combine William O'Neil's CAN SLIM breakout strategies with profound, Warren Buffett-style fundamental analysis to find the absolute best stock of the day.

We have identified the stock ticker ${ticker} as today's #1 breakout pick.
Technical Details: Current Price: $${technicalDetails.currentPrice.toFixed(2)}, 224-day MA: $${technicalDetails.ma224.toFixed(2)}, Pattern: ${technicalDetails.message}.

Please generate a professional, highly detailed "One Stock A Day" Deep Dive Report.
IMPORTANT: You must structure the report EXACTLY with these sections, emphasizing the profound fundamental approach of 'Truth of Market':

# Breakout AI: Daily Top Pick Analysis for ${ticker}

## 1. Technical Analysis Rationale (Why this stock?)
Explain in detail *why* this stock was recommended today based on the technical details provided. Describe the William O'Neil Cup and Handle (or Deep Base) pattern taking place. Explain the psychological battle between buyers and sellers at the 224-day MA, volume implications, and why this is a highly asymmetric entry point right now.

## 2. Intrinsic Value & Economic Moat
Conduct a profound fundamental analysis. What is the core business model? Do they possess a durable competitive advantage (network effects, switching costs, brand power, IP)? How does their return on invested capital (ROIC) scale?

## 3. CAN SLIM Catalysts
Are there any recent earnings surprises? Major institutional sponsorship (mutual funds buying in)? Is the general sector/industry currently leading the market? Highlight the fundamental catalysts that are fundamentally driving this technical breakout.

## 4. Risk Factors & Downside Protection
What are the macroeconomic, regulatory, or competitive threats that could destroy this company's moat over the next 5 years? Technically, where is the invalidation point (e.g., if it drops back below the 112/224-day MA)?

## 5. Strategic Conclusion
A final wrap-up of why this is the #1 pick today.

Format the output entirely in clean Markdown (no HTML). Make it sound authoritative, incredibly insightful, and elite.
`;

    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (err) {
        console.error("Gemini failed for", ticker, err);
        return null;
    }
}

async function main() {
    console.log("Starting Breakout AI Screener...");

    // Check if we already picked a stock today
    const todayStr = new Date().toISOString().split('T')[0];
    const { data: existing } = await supabase
        .from('oneil_picks')
        .select('id, ticker')
        .gte('pick_date', `${todayStr}T00:00:00Z`)
        .limit(1);

    if (existing && existing.length > 0) {
        console.log(`Already found today's pick (${existing[0].ticker}). Exiting to prevent duplicates.`);
        return;
    }

    let bestPick = null;
    let highestScore = 0;

    // Scan all tickers to find the absolute best setup
    for (const ticker of TARGET_TICKERS) {
        try {
            const prices = await fetchHistoricalData(ticker);
            const analysis = analyzeONeilPattern(prices);

            if (analysis.isPick) {
                console.log(`  🟡 Potential Match: ${ticker} (Score: ${analysis.score}) - ${analysis.details.message}`);

                if (analysis.score > highestScore) {
                    highestScore = analysis.score;
                    bestPick = {
                        ticker: ticker,
                        score: analysis.score,
                        details: analysis.details
                    };
                }
            }
            // Wait to avoid rate limits
            await new Promise(r => setTimeout(r, 200));
        } catch (err) {
            console.error(`Error analyzing ${ticker}:`, err.message);
        }
    }

    if (bestPick) {
        console.log(`\n🏆 TODAY'S WINNER: ${bestPick.ticker} with Score ${bestPick.score}`);
        console.log(`   Generating profound AI Report for ${bestPick.ticker}...`);

        const reportMd = await generateAIReport(bestPick.ticker, bestPick.details);

        if (reportMd) {
            const { error } = await supabase
                .from('oneil_picks')
                .insert({
                    ticker: bestPick.ticker,
                    oneil_score: bestPick.score,
                    picked_price: bestPick.details.currentPrice, // Save for ROI calculation
                    technical_details: bestPick.details,
                    ai_report: reportMd
                });
            if (error) {
                console.error("   Supabase Insert Error:", error.message);
            } else {
                console.log(`   ✅ Successfully saved today's #1 pick (${bestPick.ticker}) to database!`);
            }
        }
    } else {
        console.log("\n⚪ Screener finished. No high-probability setups found today.");
    }
}

main();
