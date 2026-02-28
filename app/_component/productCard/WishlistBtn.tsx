"use client"
import React from 'react'
import { Heart } from 'lucide-react'
import { useWishlist } from '@/app/providers/WishlistContextProvider'
import { cn } from '@/lib/utils'

type WishlistBtnProps = {
    productId: string
}

export default function WishlistBtn({ productId }: WishlistBtnProps) {
    const { toggleWishlist, isInWishlist } = useWishlist()

    const active = isInWishlist(productId)

    return (
        <button
            onClick={(e) => {
                e.preventDefault()
                toggleWishlist(productId)
            }}
            className={cn(
                "flex-1 min-w-[64px] h-14 bg-white border-2 rounded-2xl transition-all flex items-center justify-center group shadow-sm",
                active
                    ? "border-rose-200 bg-rose-50 text-rose-600"
                    : "border-gray-100 hover:border-rose-100 hover:bg-rose-50 text-gray-400 hover:text-rose-500"
            )}
        >
            <Heart
                className={cn(
                    "w-6 h-6 transition-all duration-300 group-hover:scale-125",
                    active ? "fill-rose-600 scale-110" : "group-active:fill-rose-500"
                )}
            />
        </button>
    )
}
