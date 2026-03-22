import dotenv from 'dotenv';
import path from 'path';
import { runScreener } from '../app/lib/oneil_screener';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function main() {
    console.log("Starting Wrapper Script for O'Neil Screener...");
    
    const env = {
        supabaseUrl: (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim(),
        supabaseKey: (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim(),
        geminiApiKey: (process.env.GEMINI_API_KEY || '').trim()
    };

    if (!env.supabaseUrl || !env.geminiApiKey) {
        console.error("Missing environment variables.");
        process.exit(1);
    }

    try {
        const isForce = process.argv.includes('--force');
        const result = await runScreener(isForce, env);
        console.log("Execution Message: ", result.message);
        if (!result.success) {
            console.error("Screener failed or did not pick any stock.");
            process.exit(1);
        } else {
            console.log("Screener successfully ran.");
        }
    } catch (err) {
        console.error("Error running screener:", err);
        process.exit(1);
    }
}

main();
