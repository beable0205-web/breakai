export interface FearAndGreedDataPoint {
    date: string;
    score: number;
    rating: string;
}

/**
 * Fetches historical Fear and Greed Index data using CNN's internal API.
 * Returns the last 30 days of data by default.
 */
export async function fetchHistoricalFearAndGreed(days = 30): Promise<FearAndGreedDataPoint[]> {
    try {
        const response = await fetch('https://production.dataviz.cnn.io/index/fearandgreed/graphdata', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
                'Accept': 'application/json',
                'Referer': 'https://edition.cnn.com/markets/fear-and-greed'
            },
            next: { revalidate: 3600 * 12 } // Cache for 12 hours
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch F&G data: ${response.status}`);
        }

        const json = await response.json();
        const dataArr = json?.fear_and_greed_historical?.data;

        if (!Array.isArray(dataArr)) {
            return [];
        }

        // CNN returns timestamp as 'x' and score as 'y'
        const mapped = dataArr.map((item: any) => {
            const dateObj = new Date(item.x);
            return {
                date: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                timestamp: item.x,
                score: Math.round(item.y),
                rating: item.rating
            };
        });

        // Sort by time ascending
        mapped.sort((a, b) => a.timestamp - b.timestamp);

        // Return only requested trailing days
        return mapped.slice(-days).map(({ date, score, rating }) => ({ date, score, rating }));
    } catch (error) {
        console.error("Error fetching CNN Fear & Greed:", error);
        return generateMockFearAndGreed(days); // Fallback to mock data if API fails
    }
}

function generateMockFearAndGreed(days: number): FearAndGreedDataPoint[] {
    const data: FearAndGreedDataPoint[] = [];
    let currentScore = 50;
    const now = new Date();
    
    for (let i = days; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        
        currentScore = Math.max(0, Math.min(100, currentScore + (Math.random() * 10 - 5)));
        
        let rating = "neutral";
        if (currentScore > 75) rating = "extreme greed";
        else if (currentScore > 55) rating = "greed";
        else if (currentScore < 25) rating = "extreme fear";
        else if (currentScore < 45) rating = "fear";

        data.push({
            date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            score: Math.round(currentScore),
            rating
        });
    }
    return data;
}
