"use client"
import React, { createContext, useContext, useEffect, useState } from 'react'
import { getUserWishlist, addToWishlist, removeFromWishlist } from '../_actions/wishlistAction'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import axios from 'axios'

type WishlistContextType = {
    wishlistIds: string[];
    wishlistItems: any[];
    loading: boolean;
    toggleWishlist: (productId: string) => Promise<void>;
    isInWishlist: (productId: string) => boolean;
}

export const WishlistContext = createContext<WishlistContextType | null>(null)

export default function WishlistContextProvider({ children }: { children: React.ReactNode }) {
    const [wishlistIds, setWishlistIds] = useState<string[]>([])
    const [wishlistItems, setWishlistItems] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const { data: session } = useSession()
    const isAuthenticated = !!session

    async function fetchWishlist() {
        if (!isAuthenticated) return;

        const result = await getUserWishlist()
        if (result.success && result.data) {
            setWishlistItems(result.data)
            setWishlistIds(result.data.map((item: any) => item.id || item._id))
        }
    }

    useEffect(() => {
        fetchWishlist()
    }, [isAuthenticated])

    const isInWishlist = (productId: string) => wishlistIds.includes(productId)

    const toggleWishlist = async (productId: string) => {
        if (!isAuthenticated) {
            toast.error("Please login to manage your wishlist")
            return
        }

        const currentlyIn = isInWishlist(productId)

        if (currentlyIn) {
            // Optimistic update
            setWishlistIds(prev => prev.filter(id => id !== productId))
            const result = await removeFromWishlist(productId)
            if (result.success) {
                toast.success("Removed from wishlist")
                fetchWishlist()
            } else {
                setWishlistIds(prev => [...prev, productId])
                toast.error(result.message)
            }
        } else {
            // Optimistic update
            setWishlistIds(prev => [...prev, productId])
            const result = await addToWishlist(productId)
            if (result.success) {
                toast.success("Added to wishlist")
                fetchWishlist()
                // Track behavior
                try {
                    axios.post('/api/activity', { productId, action: 'WISHLIST' });
                } catch (e) { /* silent */ }
            } else {
                setWishlistIds(prev => prev.filter(id => id !== productId))
                toast.error(result.message)
            }
        }
    }

    return (
        <WishlistContext.Provider value={{ wishlistIds, wishlistItems, loading, toggleWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    )
}

export const useWishlist = () => {
    const context = useContext(WishlistContext)
    if (!context) throw new Error("useWishlist must be used within a WishlistContextProvider")
    return context
}
