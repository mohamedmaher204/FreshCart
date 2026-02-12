"use client"
import React from 'react'
import { useWishlist } from '@/app/providers/WishlistContextProvider'
import ProductCard from '../_component/productCard/ProductCard'
import { Heart, ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function WishlistPage() {
    const { wishlistItems, loading } = useWishlist()

    if (loading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-8">
                <Loader2 className="w-16 h-16 text-rose-500 animate-spin" />
                <h2 className="text-2xl font-bold text-gray-900 mt-6">Loading your favorites...</h2>
            </div>
        )
    }

    return (
        <section className="min-h-screen bg-[#fafafa] py-16 md:py-24">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500 shadow-inner">
                            <Heart className="w-10 h-10 fill-current" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight">MY <span className="text-rose-500">WISHLIST</span></h1>
                            <p className="text-gray-500 font-medium">You have {wishlistItems.length} products saved in your wishlist</p>
                        </div>
                    </div>
                    <Link href="/products">
                        <Button variant="outline" className="rounded-full px-8 h-14 border-2 hover:bg-gray-50 flex items-center gap-2 font-bold">
                            <ArrowLeft className="w-4 h-4" /> Continue Shopping
                        </Button>
                    </Link>
                </div>

                {wishlistItems.length === 0 ? (
                    <div className="bg-white rounded-[3rem] p-20 text-center shadow-sm border border-gray-100 max-w-4xl mx-auto">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
                            <ShoppingBag className="w-12 h-12 text-gray-200" />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-4">Your wishlist is empty</h2>
                        <p className="text-gray-500 max-w-sm mx-auto mb-10 leading-relaxed text-lg font-medium">
                            Looks like you haven't added anything to your wishlist yet. Explore our catalog and find something you love!
                        </p>
                        <Link href="/products">
                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-12 h-16 text-lg font-black shadow-xl shadow-emerald-200 transition-transform active:scale-95">
                                Start Shopping Now
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {wishlistItems.map((product) => (
                            <div key={product.id || product._id} className="animate-in fade-in zoom-in duration-500">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
