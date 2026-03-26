"use client";
import React, { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { toggleBookmark } from "../actions/bookmarkActions";
import { useRouter } from "next/navigation";

interface BookmarkButtonProps {
    pickId: string;
    initialBookmarked: boolean;
    isLoggedIn: boolean;
    className?: string;
}

export default function BookmarkButton({ pickId, initialBookmarked, isLoggedIn, className = "" }: BookmarkButtonProps) {
    const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    
    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!isLoggedIn) {
            alert("북마크 기능을 사용하려면 로그인이 필요합니다.");
            router.push("/admin"); // The current login flow path according to previous files
            return;
        }
        
        // Optimistic UI update
        setIsBookmarked(!isBookmarked);
        
        startTransition(async () => {
            const res = await toggleBookmark(pickId);
            if (res && res.error) {
                // Revert on error
                setIsBookmarked(isBookmarked);
                console.error("Bookmark Error:", res.error);
                if (res.error === "Unauthorized") {
                    alert("세션이 만료되었습니다. 다시 로그인해주세요.");
                } else {
                    alert("북마크 저장 중 오류가 발생했습니다.");
                }
            }
        });
    };
    
    return (
        <button 
            onClick={handleToggle}
            disabled={isPending}
            className={`p-2 rounded-full transition-all group no-print z-20 relative outline-none ${className} ${isBookmarked ? 'text-yellow-400 hover:text-yellow-500 hover:bg-yellow-400/10' : 'text-zinc-600 hover:text-yellow-400 hover:bg-zinc-800'}`}
            title="관심 종목에 저장하기"
            aria-label="Bookmark"
        >
            <Star className={`w-5 h-5 transition-transform ${isBookmarked ? 'fill-yellow-400 scale-110 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'scale-100 group-hover:scale-110'}`} />
        </button>
    );
}
