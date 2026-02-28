"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user already consented
        const consented = localStorage.getItem("cookie_consent");
        if (!consented) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookie_consent", "true");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 w-full z-50 bg-[#09090b] border-t border-[#333] p-4 shadow-2xl animate-in slide-in-from-bottom-5">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-zinc-300 text-center sm:text-left">
                    We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies as described in our <Link href="/privacy" className="text-emerald-400 hover:underline">Privacy Policy</Link>.
                </div>
                <div className="flex gap-4 w-full sm:w-auto">
                    <button
                        onClick={() => setIsVisible(false)}
                        className="flex-1 sm:flex-none px-6 py-2 text-sm text-zinc-400 hover:text-white border border-[#333] hover:border-zinc-500 rounded-md transition-colors"
                    >
                        Decline
                    </button>
                    <button
                        onClick={handleAccept}
                        className="flex-1 sm:flex-none px-8 py-2 text-sm font-bold text-black bg-[#00FF41] hover:bg-emerald-400 rounded-md transition-colors whitespace-nowrap"
                    >
                        Accept All
                    </button>
                </div>
            </div>
        </div>
    );
}
