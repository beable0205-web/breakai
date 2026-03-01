import { NextResponse } from 'next/server';
import { createClient } from "@supabase/supabase-js"

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json({ error: 'Supabase env variables are missing' }, { status: 500 });
        }

        const supabaseAdmin = createClient(supabaseUrl, supabaseKey);
        const { data: users, error } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase Profiles Fetch Error:', error);
            throw error;
        }

        return NextResponse.json({ users });
    } catch (error) {
        console.error('API /admin/users Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
