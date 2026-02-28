"use client"
import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { Producttype, CategoryType } from '../_types/Product.type'
import ProductCard from '../_component/productCard/ProductCard'
import ProductSkeleton from '../_component/productCard/ProductSkeleton'
import { Search, LayoutGrid, List, Loader2, Sparkles, ShoppingBag, Percent, SlidersHorizontal, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSearchParams, useRouter } from 'next/navigation'
import { getAllCategories } from '../_services/categoriec.service'

export default function ProductsPage() {
    const searchParams = useSearchParams()
    const router = useRouter()

    // States
    const [products, setProducts] = useState<Producttype[]>([])
    const [categories, setCategories] = useState<CategoryType[]>([])
    const [loading, setLoading] = useState(true)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    // Filters (Sync with URL params for better UX)
    const keyword = searchParams.get('keyword') || ''
    const selectedCategory = searchParams.get('category') || 'all'
    const sortBy = searchParams.get('sort') || 'newest'
    const showOffersOnly = searchParams.get('offers') === 'true'

    // Fetch Categories once
    useEffect(() => {
        getAllCategories().then(data => {
            if (data) setCategories(data)
        })
    }, [])

    // Fetch Products based on Filters (Backend Search)
    const fetchProducts = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (keyword) params.append('keyword', keyword)
            if (selectedCategory !== 'all') params.append('category', selectedCategory)
            if (sortBy) params.append('sort', sortBy)

            const res = await axios.get(`/api/products?${params.toString()}`)
            let data = res.data.data

            if (showOffersOnly) {
                data = data.filter((p: any) => p.priceAfterDiscount && p.priceAfterDiscount < p.price)
            }

            setProducts(data)
        } catch (error) {
            console.error("Error fetching products:", error)
        } finally {
            setLoading(false)
        }
    }, [keyword, selectedCategory, sortBy, showOffersOnly])

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchProducts()
        }, 300) // Debounce search

        return () => clearTimeout(delayDebounceFn)
    }, [fetchProducts])

    // Update URL Params
    const updateFilters = (updates: Record<string, string | boolean | null>) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()))

        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === 'all' || value === false || value === '') {
                current.delete(key)
            } else {
                current.set(key, String(value))
            }
        })

        const search = current.toString()
        const query = search ? `?${search}` : ""
        router.push(`/products${query}`)
    }

    return (
        <section className="min-h-screen bg-[#fafafa] dark:bg-zinc-950 transition-colors duration-500">
            {/* Hero Header */}
            <div className="relative bg-emerald-950 py-16 md:py-24 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 -left-1/4 w-1/2 h-full bg-emerald-500 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-0 -right-1/4 w-1/2 h-full bg-teal-500 rounded-full blur-[120px] animate-pulse delay-700"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest mb-6 backdrop-blur-md border border-emerald-500/30">
                        <Sparkles className="w-3 h-3" /> Premium Catalog
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight uppercase">
                        Elite <span className="text-emerald-400">Collection</span>
                    </h1>
                    <p className="text-emerald-100/60 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
                        Discover our curated selection of high-end products, carefully chosen for those who demand the absolute best in quality and design.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-10 mb-16 relative z-20">
                {/* Control Bar - Premium Design */}
                <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-zinc-800 p-4 md:p-6 mb-10 transition-colors">
                    <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">

                        {/* Search Input */}
                        <div className="relative w-full lg:w-96 group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search catalog..."
                                value={keyword}
                                onChange={(e) => updateFilters({ keyword: e.target.value })}
                                className="w-full pl-14 pr-4 py-4 bg-gray-50 dark:bg-zinc-800/50 border-2 border-transparent rounded-[1.5rem] focus:bg-white dark:focus:bg-zinc-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-gray-800 dark:text-zinc-100 font-bold placeholder:text-gray-400 placeholder:font-medium shadow-inner"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                            {/* Offers Filter */}
                            <button
                                onClick={() => updateFilters({ offers: !showOffersOnly })}
                                className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border-2 ${showOffersOnly
                                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-xl shadow-emerald-500/20'
                                    : 'bg-white dark:bg-zinc-800 border-gray-100 dark:border-zinc-700 text-gray-500 dark:text-zinc-400 hover:border-emerald-500 hover:text-emerald-600'
                                    }`}
                            >
                                <Percent className={`w-4 h-4 ${showOffersOnly ? 'animate-bounce' : ''}`} />
                                Offers Only
                            </button>

                            {/* Category Filter */}
                            <div className="relative flex-1 min-w-[180px]">
                                <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 pointer-events-none" />
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => updateFilters({ category: e.target.value })}
                                    className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-zinc-800/50 border-2 border-transparent rounded-2xl focus:bg-white dark:focus:bg-zinc-800 focus:border-emerald-500 outline-none transition-all text-gray-900 dark:text-zinc-100 font-black text-xs uppercase tracking-widest cursor-pointer appearance-none shadow-inner"
                                >
                                    <option value="all">All Departments</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat.name}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Sort Filter */}
                            <div className="relative flex-1 min-w-[180px]">
                                <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 pointer-events-none" />
                                <select
                                    value={sortBy}
                                    onChange={(e) => updateFilters({ sort: e.target.value })}
                                    className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-zinc-800/50 border-2 border-transparent rounded-2xl focus:bg-white dark:focus:bg-zinc-800 focus:border-emerald-500 outline-none transition-all text-gray-900 dark:text-zinc-100 font-black text-xs uppercase tracking-widest cursor-pointer appearance-none shadow-inner"
                                >
                                    <option value="newest">Newest Arrivals</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                    <option value="rating">Top Rated</option>
                                    <option value="sold">Best Selling</option>
                                </select>
                            </div>

                            {/* View Switcher */}
                            <div className="hidden md:flex p-1.5 bg-gray-100 dark:bg-zinc-800 rounded-2xl border border-gray-200 dark:border-zinc-700">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2.5 rounded-[0.8rem] transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-zinc-700 shadow-xl text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300'}`}
                                >
                                    <LayoutGrid className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2.5 rounded-[0.8rem] transition-all ${viewMode === 'list' ? 'bg-white shadow-xl text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    <List className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="flex items-center justify-between mb-8 px-4">
                    <p className="text-gray-400 dark:text-zinc-500 text-xs font-black uppercase tracking-[0.2em]">
                        Found <span className="text-emerald-600 dark:text-emerald-400">{products.length}</span> Premium Items
                    </p>
                    {(keyword || selectedCategory !== 'all' || showOffersOnly) && (
                        <button
                            onClick={() => router.push('/products')}
                            className="text-[10px] font-black text-amber-600 hover:text-red-500 transition-colors uppercase tracking-[0.2em] bg-amber-50 px-4 py-2 rounded-full border border-amber-100"
                        >
                            × Clear All Filters
                        </button>
                    )}
                </div>

                {/* Products Display */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <ProductSkeleton key={i} />)}
                    </div>
                ) : products.length === 0 ? (
                    <div className="bg-white dark:bg-zinc-900 rounded-[3rem] shadow-sm border border-gray-100 dark:border-zinc-800 p-20 text-center animate-in zoom-in duration-500">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-50 dark:bg-emerald-500/10 rounded-full mb-8">
                            <ShoppingBag className="w-12 h-12 text-emerald-200 dark:text-emerald-700/50" />
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 dark:text-zinc-100 mb-4">NO MATCH FOUND</h3>
                        <p className="text-gray-500 dark:text-zinc-500 max-w-sm mx-auto font-medium">We couldn't find any products matching your current filters. Try resetting search or categories.</p>
                        <Button
                            onClick={() => router.push('/products')}
                            className="mt-10 rounded-2xl px-10 h-14 bg-gray-900 text-white font-bold"
                        >
                            Reset All Explorer
                        </Button>
                    </div>
                ) : (
                    <div className={
                        viewMode === 'grid'
                            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-2"
                            : "flex flex-col gap-6"
                    }>
                        {products.map((product, idx) => (
                            <div
                                key={product.id}
                                className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
                                style={{ animationDelay: `${idx * 50}ms` }}
                            >
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Bottom Section */}
            <div className="bg-[#111] py-24 mt-20 text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-20"></div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl font-black mb-6 tracking-tight uppercase">Quality <span className="text-emerald-500">Uncompromised</span></h2>
                    <p className="text-gray-500 max-w-xl mx-auto mb-12 font-medium leading-relaxed">
                        Each item in our catalog undergoes rigorous quality testing to ensure it meets our elite standards.
                    </p>
                    <div className="flex justify-center gap-16 flex-wrap">
                        <div className="flex flex-col items-center">
                            <span className="text-4xl mb-4 bg-white/5 w-16 h-16 flex items-center justify-center rounded-2xl border border-white/10">🚚</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">EXPEDITED</span>
                            <span className="font-bold">Shipping</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-4xl mb-4 bg-white/5 w-16 h-16 flex items-center justify-center rounded-2xl border border-white/10">🛡️</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">SECURE</span>
                            <span className="font-bold">Payments</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-4xl mb-4 bg-white/5 w-16 h-16 flex items-center justify-center rounded-2xl border border-white/10">⭐</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">VERIFIED</span>
                            <span className="font-bold">Materials</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
