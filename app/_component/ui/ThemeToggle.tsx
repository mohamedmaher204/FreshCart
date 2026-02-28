"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="w-10 h-10 rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 animate-pulse" />
        );
    }

    const isDark = theme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="relative w-11 h-11 flex items-center justify-center rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 cursor-pointer overflow-hidden group transition-all duration-500 active:scale-95 hover:shadow-xl hover:shadow-emerald-500/10"
            aria-label="Toggle Theme"
        >
            <div className="relative w-5 h-5">
                {/* Sun Icon */}
                <div
                    className={`absolute inset-0 transition-all duration-700 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] ${isDark ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"
                        } text-amber-500`}
                >
                    <Sun className="w-5 h-5 fill-amber-500/20" />
                </div>

                {/* Moon Icon */}
                <div
                    className={`absolute inset-0 transition-all duration-700 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] ${isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"
                        } text-emerald-400`}
                >
                    <Moon className="w-5 h-5 fill-emerald-400/20" />
                </div>
            </div>

            {/* Background Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
    );
}
