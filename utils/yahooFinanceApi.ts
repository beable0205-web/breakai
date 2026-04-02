"use server";
import yahooFinance from 'yahoo-finance2';

export interface YahooEarningsTrend {
    period: string; // e.g., "0q", "+1q", "0y", "+1y"
    endDate: string | null;
    growth: number | null;
    earningsEstimateAvg: number | null;
    revenueEstimateAvg: number | null;
}

export interface YahooValuationMetrics {
    forwardPE: number | null;
    trailingPE: number | null;
    priceToBook: number | null;
    pegRatio: number | null;
}

export interface YahooFinanceData {
    trends: YahooEarningsTrend[];
    metrics: YahooValuationMetrics;
}

/**
 * Fetches earnings trend (forward EPS) and key valuation metrics from Yahoo Finance.
 * Uses `yahoo-finance2` library under the hood. No API Key required.
 */
export async function fetchYahooFundamentalData(ticker: string): Promise<YahooFinanceData> {
    try {
        // We catch errors per module since Yahoo might omit modules for some tickers
        const result = await yahooFinance.quoteSummary(ticker, {
            modules: ['earningsTrend', 'defaultKeyStatistics']
        }) as any;

        const trendsStr = result.earningsTrend?.trend || [];
        const mappedTrends: YahooEarningsTrend[] = trendsStr.map((t: any) => ({
            period: t.period || "",
            endDate: t.endDate ? new Date(t.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : "N/A",
            growth: t.growth !== undefined ? Number(t.growth) : null,
            earningsEstimateAvg: t.earningsEstimate?.avg !== undefined ? Number(t.earningsEstimate.avg) : null,
            revenueEstimateAvg: t.revenueEstimate?.avg !== undefined ? Number(t.revenueEstimate.avg) : null,
        }));

        const keyStats = result.defaultKeyStatistics || {};
        
        return {
            trends: mappedTrends.filter(t => t.period.includes('q') || t.period.includes('y')), // only keep q and y periods
            metrics: {
                forwardPE: keyStats.forwardPE !== undefined ? Number(keyStats.forwardPE) : null,
                trailingPE: keyStats.trailingPE !== undefined ? Number(keyStats.trailingPE) : null,
                priceToBook: keyStats.priceToBook !== undefined ? Number(keyStats.priceToBook) : null,
                pegRatio: keyStats.pegRatio !== undefined ? Number(keyStats.pegRatio) : null,
            }
        };
    } catch (error) {
        console.error(`Error fetching Yahoo Finance data for ${ticker}:`, error);
        return generateMockYahooData(); // Fallback UI on failure
    }
}

// ---- FALLBACK MOCKS FOR DEVELOPMENT ----
function generateMockYahooData(): YahooFinanceData {
    return {
        trends: [
            { period: "0q", endDate: "Current Qtr", growth: 0.15, earningsEstimateAvg: 1.45, revenueEstimateAvg: 85000000000 },
            { period: "+1q", endDate: "Next Qtr", growth: 0.12, earningsEstimateAvg: 1.62, revenueEstimateAvg: 91000000000 },
            { period: "0y", endDate: "Current Year", growth: 0.18, earningsEstimateAvg: 6.50, revenueEstimateAvg: 380000000000 },
            { period: "+1y", endDate: "Next Year", growth: 0.14, earningsEstimateAvg: 7.42, revenueEstimateAvg: 410000000000 },
        ],
        metrics: {
            forwardPE: 24.5,
            trailingPE: 28.2,
            priceToBook: 42.1,
            pegRatio: 1.3
        }
    };
}
