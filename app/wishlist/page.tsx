"use client"
import React from 'react'
import { useWishlist } from '@/app/providers/WishlistContextProvider'
import ProductCard from '../_component/productCard/ProductCard'
import { Heart, ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import PageLoader from '../_component/ui/PageLoader'

export default function WishlistPage() {
    const { wishlistItems, loading } = useWishlist()

    if (loading) {
        return <PageLoader />;
    }

    return (
        <section className="min-h-screen bg-[#fafafa] dark:bg-zinc-950 pb-24 transition-colors duration-500">
            {/* Premium Hero Header */}
            <div className="relative bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 py-20 overflow-hidden mb-12">
                <div className="absolute inset-0 opacity-25">
                    <div className="absolute top-0 -left-1/4 w-1/2 h-full bg-white rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-0 -right-1/4 w-1/2 h-full bg-emerald-300 rounded-full blur-[120px] animate-pulse delay-700"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-white mx-auto mb-6 border border-white/30 shadow-2xl">
                        <Heart className="w-10 h-10 fill-current" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight uppercase">
                        YOUR <span className="text-emerald-100">FAVORITES</span>
                    </h1>
                    <p className="text-emerald-50/80 text-lg font-medium max-w-xl mx-auto">
                        A curated collection of everything you love. Ready to make them yours?
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4">
                {/* Stats Bar */}
                {wishlistItems.length > 0 && (
                    <div className="flex items-center justify-between mb-10 bg-white dark:bg-zinc-900 p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors">
                        <p className="text-gray-400 dark:text-zinc-500 text-xs font-black uppercase tracking-[0.2em] px-4">
                            Collection size: <span className="text-emerald-600 dark:text-emerald-400">{wishlistItems.length}</span> items
                        </p>
                        <Link href="/products">
                            <Button variant="ghost" className="text-gray-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-bold flex items-center gap-2">
                                <ArrowLeft className="w-4 h-4" /> Discover More
                            </Button>
                        </Link>
                    </div>
                )}

                {wishlistItems.length === 0 ? (
                    <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-16 md:p-24 text-center shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-zinc-800 max-w-4xl mx-auto animate-in zoom-in duration-700">
                        <div className="w-28 h-28 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <ShoppingBag className="w-14 h-14 text-emerald-200 dark:text-emerald-700/50" />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-zinc-100 mb-4 tracking-tight">QUIET IN HERE...</h2>
                        <p className="text-gray-500 dark:text-zinc-500 max-w-sm mx-auto mb-12 leading-relaxed font-medium">
                            Your favorites list is waiting to be filled with premium items. Start your exploration today!
                        </p>
                        <Link href="/products">
                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-12 h-16 text-lg font-black shadow-2xl shadow-emerald-200 transition-all active:scale-95 hover:-translate-y-1">
                                Start Exploring Catalog
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {wishlistItems.map((product, idx) => (
                            <div
                                key={product.id || product._id}
                                className="animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
