"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../utils/supabase/client";
import AuthModal from "./AuthModal";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";

export default function TopNav() {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        // Initialize active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        // Listen for Auth changes globally
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                setIsAuthModalOpen(false); // Make sure modal closes if logging in via magic link/other windows
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <>
            <header className="border-b border-[#333] py-4 px-6 flex justify-between items-center bg-[#0a0a0a]">
                <Link href="/" className="text-xl font-bold tracking-tighter text-[#00FF41] hover:opacity-80 transition-opacity">
                    TRUTH_OF_MARKET<span className="animate-pulse">_</span>
                </Link>
                <nav className="flex items-center text-sm text-gray-400 font-medium font-mono gap-6">
                    <Link href="/" className="cursor-pointer hover:text-white transition-colors hidden md:inline">REPORTS</Link>
                    <Link href="/about" className="cursor-pointer hover:text-white transition-colors hidden md:inline">ABOUT</Link>

                    <Link href="/api/checkout" className="border border-[#00FF41] text-[#00FF41] px-3 py-1 rounded hover:bg-[#00FF41] hover:text-black transition cursor-pointer">
                        SUBSCRIBE
                    </Link>

                    <div className="w-px h-4 bg-zinc-700 mx-2 hidden md:block"></div>

                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-zinc-300 hidden sm:inline" title={user.email}>
                                {user.email?.split("@")[0]}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 px-3 py-1 rounded transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsAuthModalOpen(true)}
                            className="bg-white text-black font-bold px-4 py-1.5 rounded hover:bg-zinc-200 transition-colors"
                        >
                            Login
                        </button>
                    )}
                </nav>
            </header>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </>
    );
}
