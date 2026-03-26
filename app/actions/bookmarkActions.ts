"use server";
import { createClient } from "../../utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleBookmark(pickId: string) {
    const supabaseServer = await createClient();
    const { data: { session } } = await supabaseServer.auth.getSession();
    
    if (!session?.user?.id) {
        return { success: false, error: "Unauthorized" };
    }
    
    // Check if already bookmarked
    const { data: existing } = await supabaseServer
        .from('user_bookmarks')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('pick_id', pickId)
        .single();
        
    if (existing) {
        // Remove bookmark
        const { error } = await supabaseServer
            .from('user_bookmarks')
            .delete()
            .eq('user_id', session.user.id)
            .eq('pick_id', pickId);
        
        if (error) return { success: false, error: error.message };
        
        revalidatePath('/dashboard');
        revalidatePath('/picks');
        revalidatePath(`/picks/${pickId}`);
        return { success: true, isBookmarked: false };
    } else {
        // Add bookmark
        const { error } = await supabaseServer
            .from('user_bookmarks')
            .insert({
                user_id: session.user.id,
                pick_id: pickId
            });
            
        if (error) return { success: false, error: error.message };
        
        revalidatePath('/dashboard');
        revalidatePath('/picks');
        revalidatePath(`/picks/${pickId}`);
        return { success: true, isBookmarked: true };
    }
}
