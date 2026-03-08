import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Instantiate clients dynamically to ensure process.env is read at runtime
let supabase: any;
let genAI: any;

function initClients(env: { supabaseUrl: string, supabaseKey: string, geminiApiKey: string }) {
    if (!env || !env.supabaseUrl || !env.supabaseKey || !env.geminiApiKey) {
        console.error("Missing required environment variables.");
        return false;
    }

    if (!supabase) {
        supabase = createClient(env.supabaseUrl, env.supabaseKey, {
            auth: { persistSession: false }
        });
    }
    if (!genAI) {
        genAI = new GoogleGenerativeAI(env.geminiApiKey);
    }
    return true;
}

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
async function fetchHistoricalData(ticker: string) {
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
    const prices: any[] = [];
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
    return prices.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * Calculates a simple moving average for the given period
 */
function calculateMA(prices: any[], period: number) {
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
function analyzeONeilPattern(prices: any[]) {
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

        const wasBelowOrNear = ma224_20DaysAgo ? (price20DaysAgo < ma224_20DaysAgo * 1.02) : false;
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

    // Fallback scoring for ranking if no perfect setup is found
    let fallbackScore = 50;
    if (currentPrice > ma224) fallbackScore += 10;
    if (currentPrice > ma112) fallbackScore += 10;
    if (currentVolume > avgVol20) fallbackScore += 5;

    // Closer to 224MA is better (pullback or consolidation)
    if (Math.abs(distanceTo224) < 0.15) fallbackScore += 15;

    return {
        isPick: false,
        score: fallbackScore,
        reason: "No specific William O'Neil pattern found, but ranked for relative strength.",
        details: {
            ma112, ma224, ma448, currentPrice, volume: currentVolume,
            message: "Solid technical baseline, evaluating as an alternate pick."
        }
    };
}

/**
 * Generate Gemini Corporate Report
 */
async function generateAIReport(ticker: string, technicalDetails: any) {
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        tools: [{ googleSearch: {} } as any]
    }, { apiVersion: "v1beta" });

    const today = new Date().toISOString().split('T')[0];

    const prompt = `
You are an elite financial analyst for 'Breakout AI', combining William O'Neil's CAN SLIM breakout strategies with profound, Warren Buffett-style fundamental analysis.

**STRICT TEMPORAL ANCHOR (CRITICAL)**:
**CURRENT DATE: ${today}. YOU ARE IN THE YEAR 2026.**
All data, financial analysis, and market conditions MUST be calculated up to ${today}. Use the Google Search tool to pull the absolute latest data for ${ticker}.

We have identified the stock ticker ${ticker} as today's #1 breakout pick.
Technical Details: Current Price: $${technicalDetails.currentPrice.toFixed(2)}, 224-day MA: $${technicalDetails.ma224.toFixed(2)}, Pattern: ${technicalDetails.message}.

Please generate a professional, highly detailed "One Stock A Day" Deep Dive Report.

**OUTPUT FORMAT (CRITICAL)**:
You MUST structure your response exactly as follows. Do NOT deviate.

1. First, provide the scores strictly in valid JSON wrapped in a \`\`\`json block.
2. Second, output the EXACT marker \`<!-- FUNDAMENTAL_REPORT -->\`
3. Third, output the Fundamental Report in Markdown.
4. Fourth, output the EXACT marker \`<!-- TECHNICAL_REPORT -->\`
5. Fifth, output the Technical Report in Markdown.

\`\`\`json
{
  "investment_score": {
    "total": 85,
    "breakdown": [
      { "category": "Valuation (vs Peers)", "score": 22, "max_score": 30, "reason": "P/E is expanding but justified by EPS growth." },
      { "category": "Fundamental Health & FCF", "score": 28, "max_score": 30, "reason": "Debt-to-equity below 0.5, expanding gross margins, robust FCF." },
      { "category": "Technical Trend & Smart Money", "score": 18, "max_score": 20, "reason": "Consistent volume accumulation above 224-day MA." },
      { "category": "Catalysts & Market Sentiment", "score": 17, "max_score": 20, "reason": "Upcoming product cycle driving institutional upgrades." }
    ]
  },
  "verdict": "STRONG BUY",
  "executive_summary": "4 high-impact bullet points summarizing the core fundamental thesis.",
  "bull_case_summary": "2 sharp sentences on why this stock will explode upwards.",
  "bear_case_summary": "2 sharp sentences on the existential threat that could crush this stock."
}
\`\`\`
<!-- FUNDAMENTAL_REPORT -->

## PROLOGUE: WELCOME TO THE INSTITUTIONAL EDGE
(Write a profound introduction. No table of contents.)

## WHY THIS COMPANY RIGHT NOW?
(Summarize the immediate catalyst)

## CHAPTER 1. FINANCIAL HEALTH CHECKUP: THE NUMBERS DON'T LIE
(Analyze turnaround, margins, and financial stability. Write in profound, engaging English.)

## CHAPTER 2. INDUSTRY ANALYSIS: THE MACRO ENVIRONMENT
(Analyze the massive paradigm shift in the industry and TAM)

## CHAPTER 3. ALPHA SELECTION: WHY THIS SPECIFIC STOCK?
(Analyze Economic Moat and Turnaround potential)

## CHAPTER 4. 10-K AUTOPSY: READING BETWEEN THE LINES
(Analyze revenue breakdown, outsourcing, or on-demand traits)

## CHAPTER 5. BUSINESS MODEL (BM): THE PROFIT ENGINE
(P x Q - C analysis, direct sales vs distributors)

## CHAPTER 6. THE ULTIMATE CATALYST: CORE COMPETENCY
(Analyze core technologies and patents)

## CHAPTER 7. INSTITUTIONAL TRIGGERS: WHY BUY NOW?
(Analyze catalysts, new products, mega deals)

## CHAPTER 8. RISK ASSESSMENT: THE INVALIDATING FACTORS
(Analyze legal, overhang, or subsidiary risks)

## CHAPTER 9. VALUATION MATRIX: EXPLORING THE UPSIDE
(Relative valuation vs peers and upside potential)

<!-- TECHNICAL_REPORT -->

## PROLOGUE: THE ART OF TIMING
(Introduction to the technical setup)

## CHAPTER 1. MOVING AVERAGES: THE INSTITUTIONAL FOOTPRINT
(Analyze the 224-day MA bounce and what it means for long-term trend reversal)

## CHAPTER 2. VOLUME PROFILING: DECODING THE SMART MONEY
(Analyze accumulation days vs distribution days in the recent base)

## CHAPTER 3. PATTERN RECOGNITION: THE O'NEIL SETUP
(Analyze the Cup and Handle, Double Bottom, or Flat Base pattern forming)

## CHAPTER 4. RISK / REWARD: ASYMMETRICAL ENTRY POINT
(Analyze where to set the stop-loss and the immediate upside target)
`;

    try {
        const result = await model.generateContent(prompt);
        let text = result.response.text();

        let jsonString = "";
        let finalMarkdown = "";

        const jsonMatch = text.match(/\`\`\`(?:json)?\\s*(\\{[\\s\\S]*?\\})\\s*\`\`\`/);
        if (jsonMatch) {
            jsonString = jsonMatch[1];
            finalMarkdown = text.replace(jsonMatch[0], '').trim();
        } else {
            finalMarkdown = text; // Fallback
        }

        return JSON.stringify({
            json_data: jsonString ? JSON.parse(jsonString) : null,
            markdown: finalMarkdown
        });

    } catch (err) {
        console.error("Gemini failed for", ticker, err);
        return null;
    }
}

export async function runScreener(isForceRun = false, env: { supabaseUrl: string, supabaseKey: string, geminiApiKey: string }) {
    console.log("Starting Breakout AI Screener...");

    let outputLogs: string[] = [];
    const log = (msg: string) => {
        console.log(msg);
        outputLogs.push(msg);
    };

    if (!initClients(env)) {
        log("Error: Missing API Keys. Make sure GEMINI_API_KEY is set in Vercel.");
        return { success: false, message: "Error: Missing API Keys. Make sure GEMINI_API_KEY is set in Vercel.", log: outputLogs.join('\n') };
    }

    // Check if we already picked today to save Gemini API calls
    const today = new Date().toISOString().split('T')[0];
    const { data: existing } = await supabase
        .from('oneil_picks')
        .select('id')
        .gte('pick_date', today);

    if (!isForceRun && existing && existing.length > 0) {
        log("Already found today's pick. Exiting to prevent duplicates.");
        return { success: true, message: "Skipped: Today's pick already exists.", log: outputLogs.join('\n') };
    }

    // [ANTI-DUPLICATION] Fetch tickers picked in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const { data: recentPicks } = await supabase
        .from('oneil_picks')
        .select('ticker')
        .gte('pick_date', thirtyDaysAgo.toISOString().split('T')[0]);

    const recentTickers = new Set((recentPicks || []).map((p: any) => p.ticker));
    if (recentTickers.size > 0) {
        log(`Skipping recently picked tickers (last 30 days): ${Array.from(recentTickers).join(', ')}`);
    }

    let candidates: any[] = [];
    let fallbackCandidates: any[] = [];

    // Batched concurrent fetching to reduce total scan time (Vercel 10s limit)
    const chunkSize = 15;
    for (let i = 0; i < TARGET_TICKERS.length; i += chunkSize) {
        const batch = TARGET_TICKERS.slice(i, i + chunkSize);

        await Promise.all(batch.map(async (ticker) => {
            if (recentTickers.has(ticker)) return;
            try {
                const prices = await fetchHistoricalData(ticker);
                const analysis = analyzeONeilPattern(prices);

                if (analysis.isPick) {
                    log(`  🟡 Potential Match: ${ticker} (Score: ${analysis.score}) - ${analysis.details?.message}`);
                    candidates.push({
                        ticker: ticker,
                        score: analysis.score,
                        details: analysis.details
                    });
                } else if (analysis.score && analysis.details) {
                    fallbackCandidates.push({
                        ticker: ticker,
                        score: analysis.score,
                        details: analysis.details
                    });
                }
            } catch (err: any) {
                console.error(`Error analyzing ${ticker}:`, err.message);
            }
        }));

        // Wait briefly after a batch of 15 API requests
        await new Promise(r => setTimeout(r, 100));
    }

    if (candidates.length === 0 && fallbackCandidates.length > 0) {
        log("\n⚪ No strict O'Neil setups found. Falling back to next best ranked companies...");
        fallbackCandidates.sort((a, b) => b.score - a.score);
        // Take top 3 fallback candidates just in case
        candidates = fallbackCandidates.slice(0, 3);
        candidates.forEach(c => {
            log(`  🟢 Alternate Pick: ${c.ticker} (Score: ${c.score}) - ${c.details?.message}`);
        });
    }

    if (candidates.length > 0) {
        // Sort descending by score
        candidates.sort((a, b) => b.score - a.score);
        log(`\nFound ${candidates.length} candidates today. Attempting to generate report...`);

        let success = false;

        for (const candidate of candidates) {
            if (success) break;

            log(`\n🏆 ATTEMPTING CANDIDATE: ${candidate.ticker} with Score ${candidate.score}`);
            log(`   Generating profound AI Report for ${candidate.ticker}...`);

            const reportMd = await generateAIReport(candidate.ticker, candidate.details);

            if (reportMd) {
                const { error } = await supabase
                    .from('oneil_picks')
                    .insert({
                        ticker: candidate.ticker,
                        oneil_score: candidate.score,
                        picked_price: candidate.details.currentPrice, // Save for ROI calculation
                        technical_details: candidate.details,
                        ai_report: reportMd
                    });
                if (error) {
                    log(`   Supabase Insert Error (might be duplicate): ${error.message}`);
                    log("   --> Moving to next alternate candidate...");
                } else {
                    log(`   ✅ Successfully saved today's pick (${candidate.ticker}) to database!`);
                    success = true;
                }
            } else {
                log(`   ❌ AI Report generation failed for ${candidate.ticker}. Moving to next...`);
            }
        }

        if (!success) {
            log("\n⚪ Screener finished. Failed to generate and save any reports today.");
            return { success: false, message: "Failed to generate AI reports for matches.", log: outputLogs.join('\n') };
        } else {
            return { success: true, message: "Screener ran successfully. Check the Picks dashboard.", log: outputLogs.join('\n') };
        }

    } else {
        log("\n⚪ Screener finished. No high-probability setups found today.");
        return { success: true, message: "Screener finished. No high-probability setups found today.", log: outputLogs.join('\n') };
    }
}
