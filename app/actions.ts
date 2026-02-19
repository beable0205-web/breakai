"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "./lib/supabase";

export async function analyzeTicker(ticker: string) {
    // 1. 비밀 금고(.env.local)에서 키 꺼내기
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return "Error: API Key not found. (키를 못 찾겠어요!)";

    // 2. 제미나이 연결
    const genAI = new GoogleGenerativeAI(apiKey);

    // Google Search Grounding 도구 설정
    const tools: any = [
        {
            googleSearch: {} // New standard for 2.5 Flash and newer models
        },
    ];

    // Priority Model List
    const modelsToTry = [
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-1.5-flash",
        "gemini-2.0-flash-lite-001"
    ];

    // Log to capture errors for each model
    let errorLog = [];

    const prompt = `
    You are a legendary "Forensic Accountant" & "Short Seller" (like Muddy Waters or Hindenburg Research).
    Your goal is to assign a "Risk Score" (0-100) to the target company: ${ticker}.

    **STRICT SOURCE REQUIREMENT**:
    - Use \`Google Search\` to find:
      1. Latest 10-K/10-Q Financials (Cash Flow, Debt, Revenue).
      2. Recent CEO/CFO Quotes from Earnings Calls (The "Promise").
      3. Insider Trading Data (Net Buy/Sell last 6 months).
      4. Valuation Metrics (Current P/E vs 5yr Avg).

    **SCORING ALGORITHM (Sum these 4 factors to get 'risk_score'):**
    1. **Divergence (Max 40 pts):**
       - 0 pts: CEO claims match reality.
       - 20 pts: Minor exaggeration.
       - 40 pts: Direct contradiction (The "Lie").
    2. **Solvency (Max 30 pts):**
       - 0 pts: Strong Cash Flow & Low Debt.
       - 15 pts: Flat Cash Flow or Rising Debt.
       - 30 pts: Negative Operating Cash Flow OR spiraling Debt.
    3. **Insider Sentiment (Max 20 pts):**
       - 0 pts: Net Buying or neutral.
       - 20 pts: Significant Net Insider Selling (> $5M recent).
    4. **Valuation (Max 10 pts):**
       - 0 pts: Undervalued/Fair.
       - 10 pts: Overvalued (e.g., P/E > 50 or >2x historical avg).

    **OUTPUT JSON STRUCTURE:**
    {
      "risk_score": 85,
      "verdict": "SELL",
      "score_breakdown": {
        "divergence": 35,
        "solvency": 30,
        "insider": 15,
        "valuation": 5
      },
      "one_line_summary": "CEO promised X, but Cash Flow is Y. Insiders are dumping.",
      "ceo_claim": "CEO stated: '...'",
      "reality_check": "Fact: ...",
      "financial_table": {
        "revenue_trend": "Down 5% YoY",
        "net_income_trend": "Down 12% YoY",
        "cash_flow": "-$200M (Negative)",
        "debt_to_equity": "High (2.5x)"
      },
      "detailed_report": "# Investment Memo: [Ticker] Short Thesis\\n\\n## 1. Executive Summary\\n... (Summarize the 4 factors)\\n\\n## 2. Forensic Analysis\\n... (Deep dive into Divergence & Solvency)\\n\\n## 3. Insider Activity\\n...\\n\\n## 4. Conclusion\\n..."
    }

    **IMPORTANT**: 
    - Output strictly in valid **JSON format**. 
    - 'detailed_report' must be Markdown.
    `;

    for (const modelName of modelsToTry) {
        try {
            console.log(`Trying model: ${modelName}...`);

            // Remove incompatible generationConfig for tools
            const currentModel = genAI.getGenerativeModel({
                model: modelName,
                tools: tools,
            }, { apiVersion: "v1beta" });

            const result = await currentModel.generateContent(prompt);
            const response = await result.response;
            let text = response.text();

            // Debug logging
            console.log(`Model ${modelName} raw response length:`, text.length);

            // Robust JSON Extraction
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error("No JSON found in response");
            }
            const jsonString = jsonMatch[0];

            if (jsonString.includes("SOURCE_DATA_MISSING")) {
                return "Error: SOURCE_DATA_MISSING. (최신 데이터를 찾을 수 없습니다. 티커를 확인해주세요.)";
            }

            let analysis;
            try {
                analysis = JSON.parse(jsonString);
                console.log(`Parsed JSON keys:`, Object.keys(analysis)); // Validating keys
                if (!analysis.detailed_report || !analysis.score_breakdown) {
                    throw new Error("Missing required fields (detailed_report or score_breakdown)");
                }
            } catch (e) {
                console.error(`JSON Parse/Validation Error (${modelName}):`, e);
                console.error("Failed JSON Text snippet:", jsonString.substring(0, 200));
                errorLog.push(`${modelName}: JSON Parse/Validation Error`);
                continue;
            }

            const { error } = await supabase
                .from('reports')
                .insert({
                    ticker: ticker.toUpperCase(),
                    risk_score: analysis.risk_score,
                    verdict: analysis.verdict,
                    ceo_claim: analysis.ceo_claim,
                    reality_check: analysis.reality_check,
                    one_line_summary: analysis.one_line_summary,
                    detailed_report: analysis.detailed_report,
                    score_breakdown: analysis.score_breakdown, // New JSONB field
                    financial_table: analysis.financial_table, // New JSONB field
                    analysis_text: JSON.stringify(analysis),
                });

            if (error) console.error("Supabase Save Error:", error);

            return JSON.stringify(analysis);

        } catch (error: any) {
            console.error(`Model ${modelName} failed:`, error.message);
            errorLog.push(`${modelName}: ${error.message}`);

            if (error.message?.includes("API key")) {
                return "Error: API Key Invalid. (키를 확인해주세요)";
            }

            if (!error.message?.includes("429")) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            continue;
        }
    }

    // Return detailed error log to user
    return `Error: 모든 모델 분석 실패.\n\n[Details]\n${errorLog.join("\n")}`;
}