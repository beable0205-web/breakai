const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
    const { data, error } = await supabase.from('reports').select('*').eq('ticker', 'META');
    console.log("META data:", JSON.stringify(data, null, 2));
}
run();
