"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Producttype } from '@/app/_types/Product.type'
import ProductCard from '../productCard/ProductCard'
import ProductSkeleton from '../productCard/ProductSkeleton'
import { Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function Recommendations() {
    const [products, setProducts] = useState<Producttype[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchRecs = async () => {
            try {
                const res = await axios.get('/api/recommendations')
                setProducts(res.data.data)
            } catch (error) {
                console.error("Recs fetch error", error)
            } finally {
                setLoading(false)
            }
        }
        fetchRecs()
    }, [])

    if (!loading && products.length === 0) return null;

    return (
        <section className="py-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div className="space-y-2">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                        <Sparkles className="w-3 h-3" /> Intelligent Picks
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-zinc-100 tracking-tight uppercase">
                        FOR <span className="text-emerald-500">YOU</span>
                    </h2>
                </div>
                <Link href="/products" className="hidden md:flex items-center gap-2 text-gray-400 dark:text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 font-bold transition-all group">
                    View Catalog <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {loading ? (
                    [1, 2, 3, 4, 5, 6].map(i => <ProductSkeleton key={i} />)
                ) : (
                    products.slice(0, 6).map((product, idx) => (
                        <div
                            key={product.id}
                            className="animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            <ProductCard product={product} />
                        </div>
                    ))
                )}
            </div>
        </section>
    )
}
