"use client"
import React from 'react'
import { useWishlist } from '@/app/providers/WishlistContextProvider'
import ProductCard from '../productCard/ProductCard'
import { Heart, ArrowRight, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function UserWishlistSection() {
    const { wishlistItems } = useWishlist()

    if (!wishlistItems || wishlistItems.length === 0) return null

    return (
        <section className="bg-rose-50/30 py-20 border-y border-rose-100/50">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-rose-600 font-bold uppercase tracking-widest text-sm">
                            <Heart className="w-4 h-4 fill-current" />
                            Saved For Later
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900">
                            YOUR <span className="text-rose-600">FAVORITES</span>
                        </h2>
                    </div>
                    <Link href="/wishlist" className="group flex items-center gap-2 text-gray-500 hover:text-rose-600 font-bold transition-colors">
                        Manage Wishlist <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {wishlistItems.slice(0, 4).map((product) => (
                        <div key={product.id || product._id} className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>

                {wishlistItems.length > 4 && (
                    <div className="mt-12 text-center">
                        <Button variant="ghost" className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-bold">
                            View All {wishlistItems.length} Favorites
                        </Button>
                    </div>
                )}
            </div>
        </section>
    )
}
