import { NextResponse } from 'next/server'
import { createClient } from '../../../../utils/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')

    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/admin'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            console.log("Auth Callback Success: Redirecting to", new URL(next, request.url).toString());
            return NextResponse.redirect(new URL(next, request.url))
        } else {
            console.error("Auth Callback Error:", error.message);
        }
    } else {
        console.warn("Auth Callback missing code parameter");
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(new URL('/?error=AuthError', request.url))
}
