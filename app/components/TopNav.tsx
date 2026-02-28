"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../utils/supabase/client";
import AuthModal from "./AuthModal";
import RequestCompanyModal from "./RequestCompanyModal";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";

export default function TopNav() {
    const [user, setUser] = useState<User | null>(null);
    const [isPro, setIsPro] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

    const supabase = createClient();

    const fetchProfile = async (user: User) => {
        if (user.email === "beable9489@gmail.com") {
            setIsPro(true);
            return;
        }
        const { data } = await supabase.from('profiles').select('is_pro').eq('id', user.id).single();
        setIsPro(!!data?.is_pro);
    };

    useEffect(() => {
        // Automatically open modal if redirected from checkout
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.get('login') === 'true') {
                setIsAuthModalOpen(true);
            }
        }
    }, []);

    useEffect(() => {
        // Initialize active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            if (currentUser) fetchProfile(currentUser);
        });

        // Listen for Auth changes globally
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            if (currentUser) {
                fetchProfile(currentUser);
                setIsAuthModalOpen(false); // Make sure modal closes if logging in via magic link/other windows
            } else {
                setIsPro(false);
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
                <Link href="/" className="text-2xl font-serif font-black tracking-tight text-white hover:text-blue-400 transition-colors">
                    BREAKOUT<span className="text-blue-500">_AI</span>
                </Link>
                <nav className="flex items-center text-sm text-slate-400 font-semibold uppercase tracking-widest gap-8">
                    <Link href="/picks" className="cursor-pointer text-white hover:text-blue-400 transition-colors hidden md:inline flex items-center gap-2">TODAY'S PICK <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-sm">LIVE</span></Link>
                    <Link href="/pricing" className="cursor-pointer hover:text-white transition-colors hidden md:inline">PRICING</Link>
                    <Link href="/about" className="cursor-pointer hover:text-white transition-colors hidden md:inline">ABOUT</Link>

                    {isPro ? (
                        <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                            <span className="text-lg leading-none">👑</span> PRO ACTIVE
                        </div>
                    ) : (
                        <Link href="/pricing" className="bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-bold px-4 py-1.5 rounded-full hover:shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-all flex items-center gap-1">
                            <span className="text-lg leading-none">👑</span> UPGRADE TO PRO
                        </Link>
                    )}

                    <div className="w-px h-4 bg-zinc-700 mx-2 hidden md:block"></div>

                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-zinc-300 hidden sm:inline" title={user.email}>
                                {user.email?.split("@")[0]}
                            </span>
                            <button
                                onClick={() => setIsRequestModalOpen(true)}
                                className="text-zinc-400 hover:text-white transition-colors text-sm font-bold"
                            >
                                Request Analysis
                            </button>
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

            <RequestCompanyModal
                isOpen={isRequestModalOpen}
                onClose={() => setIsRequestModalOpen(false)}
            />
        </>
    );
}
