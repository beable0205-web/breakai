import { NextResponse } from 'next/server';
import { runScreener } from '../../../lib/oneil_screener'; // Use the Next.js compatible exported function

export const dynamic = 'force-dynamic';

export async function POST() {
    try {
        console.log("Admin triggering O'Neil Screener Action...");

        // Execute the native library function instead of child_process
        const result = await runScreener(true); // force run

        console.log("Screener Execution Log:\n", result.log);

        if (!result.success) {
            return NextResponse.json({
                success: false,
                error: (result.message || "Screener failed to run.") + "\n\n=== EXECUTION LOGS ===\n" + result.log,
                stdout: result.log
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: (result.message || "Screener Execution Complete.") + "\n\n=== EXECUTION LOGS ===\n" + result.log,
            stdout: result.log,
            stderr: ""
        });

    } catch (error) {
        console.error("Failed to run screener:", error);
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}
