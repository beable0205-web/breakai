require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function test() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error("Missing Supabase variables in .env.local");
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const dateStr = new Date().toISOString().split('T')[0];
    console.log("Testing insert into market_summaries...", dateStr);

    const { data, error } = await supabase
        .from('market_summaries')
        .upsert(
            {
                date: dateStr,
                title: "Test Title",
                content: "Test Content"
            },
            { onConflict: 'date' }
        );

    if (error) {
        console.error("SUPABASE ERROR:", error);
    } else {
        console.log("SUCCESS!", data);
    }
}

test();
