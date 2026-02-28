"use client"
import React from 'react'
import logo from '@/images/freshcart-logo.svg'
import Image from 'next/image'

export default function PageLoader() {
    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white/80 backdrop-blur-md">
            <div className="relative flex flex-col items-center">
                {/* Animated Rings */}
                <div className="absolute w-32 h-32 border-4 border-emerald-100 rounded-full animate-pulse"></div>
                <div className="absolute w-32 h-32 border-t-4 border-emerald-500 rounded-full animate-spin duration-[1.5s]"></div>

                {/* Central Logo with Float Animation */}
                <div className="relative w-20 h-20 bg-white rounded-3xl shadow-2xl flex items-center justify-center p-4 animate-bounce duration-[2s]">
                    <Image
                        src={logo}
                        alt="Loading..."
                        className="w-full h-full object-contain"
                    />
                </div>

                {/* Text & Progress Bar */}
                <div className="mt-12 text-center space-y-4">
                    <div className="flex items-center gap-1.5 justify-center">
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] animate-pulse">
                            Fresh
                        </span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] animate-pulse delay-75">
                            Experience
                        </span>
                    </div>

                    <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden relative">
                        <div className="absolute inset-0 bg-emerald-500 rounded-full animate-loader-progress"></div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
        @keyframes loader-progress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
        .animate-loader-progress {
          animation: loader-progress 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
        </div>
    )
}
