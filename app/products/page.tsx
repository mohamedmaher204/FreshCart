"use client"
import React, { useEffect, useState, useMemo } from 'react'
import { getAllProduct } from '../_services/products.services'
import { getAllCategories } from '../_services/categoriec.service'
import { Producttype, CategoryType } from '../_types/Product.type'
import ProductCard from '../_component/productCard/ProductCard'
import { Search, SlidersHorizontal, LayoutGrid, List, SortAsc, SortDesc, Loader2, Sparkles, ShoppingBag, Percent } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSearchParams } from 'next/navigation'

export default function ProductsPage() {
    const searchParams = useSearchParams()
    const initialOfferFilter = searchParams.get('filter') === 'offers'

    const [products, setProducts] = useState<Producttype[]>([])
    const [categories, setCategories] = useState<CategoryType[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [sortBy, setSortBy] = useState<string>('default')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [showOffersOnly, setShowOffersOnly] = useState(initialOfferFilter)

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            try {
                const [productsData, categoriesData] = await Promise.all([
                    getAllProduct(),
                    getAllCategories()
                ])
                if (productsData) setProducts(productsData)
                if (categoriesData) setCategories(categoriesData)
            } catch (error) {
                console.error("Error fetching data:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const filteredAndSortedProducts = useMemo(() => {
        let result = [...products]

        // Filter by Search
        if (searchTerm) {
            result = result.filter(p =>
                p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.category.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Filter by Category
        if (selectedCategory !== 'all') {
            result = result.filter(p => p.category._id === selectedCategory)
        }

        // Filter by Offers
        if (showOffersOnly) {
            result = result.filter(p => p.priceAfterDiscount && p.priceAfterDiscount < p.price)
        }

        // Sort
        if (sortBy === 'price-low') {
            result.sort((a, b) => (a.priceAfterDiscount || a.price) - (b.priceAfterDiscount || b.price))
        } else if (sortBy === 'price-high') {
            result.sort((a, b) => (b.priceAfterDiscount || b.price) - (a.priceAfterDiscount || a.price))
        } else if (sortBy === 'rating') {
            result.sort((a, b) => b.ratingsAverage - a.ratingsAverage)
        }

        return result
    }, [products, searchTerm, selectedCategory, sortBy, showOffersOnly])

    if (loading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-8">
                <div className="relative">
                    <Loader2 className="w-16 h-16 text-emerald-500 animate-spin" />
                    <Sparkles className="w-6 h-6 text-emerald-400 absolute -top-2 -right-2 animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mt-6">
                    Discovering Extraordinary Products...
                </h2>
                <p className="text-gray-500 mt-2 animate-pulse">Wait a moment while we curate our collection for you</p>
            </div>
        )
    }

    return (
        <section className="min-h-screen bg-[#fafafa]">
            {/* Hero Header */}
            <div className="relative bg-emerald-950 py-16 md:py-24 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 -left-1/4 w-1/2 h-full bg-emerald-500 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-0 -right-1/4 w-1/2 h-full bg-teal-500 rounded-full blur-[120px] animate-pulse delay-700"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                        OUR <span className="text-emerald-400">COLLECTION</span>
                    </h1>
                    <p className="text-emerald-100/80 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
                        Explore our premium selection of quality products ranging from latest electronics to fashion essentials.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-10 mb-16 relative z-20">
                {/* Control Bar */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 md:p-6 mb-10 flex flex-col lg:flex-row gap-6 items-center justify-between">

                    {/* Search */}
                    <div className="relative w-full lg:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="What are you looking for today?"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-gray-700"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                        {/* Offers Toggle */}
                        <button
                            onClick={() => setShowOffersOnly(!showOffersOnly)}
                            className={`flex items-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm transition-all border-2 ${showOffersOnly
                                ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-200'
                                : 'bg-white border-gray-100 text-gray-500 hover:border-emerald-200 hover:text-emerald-600'
                                }`}
                        >
                            <Percent className={`w-4 h-4 ${showOffersOnly ? 'animate-bounce' : ''}`} />
                            Offers
                        </button>

                        {/* Category Filter */}
                        <div className="flex-1 min-w-[160px]">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-4 py-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-gray-700 font-medium cursor-pointer"
                            >
                                <option value="all">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Sort */}
                        <div className="flex-1 min-w-[160px]">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full px-4 py-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-gray-700 font-medium cursor-pointer"
                            >
                                <option value="default">Sort by: Featured</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Best Rating</option>
                            </select>
                        </div>

                        {/* View Mode Toggle */}
                        <div className="hidden md:flex p-1 bg-gray-100 rounded-xl">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <LayoutGrid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Count & Active Filters */}
                <div className="flex items-center justify-between mb-8">
                    <p className="text-gray-500 font-medium tracking-wide">
                        Showing <span className="text-gray-900 font-bold">{filteredAndSortedProducts.length}</span> Results
                    </p>
                    {(searchTerm || selectedCategory !== 'all' || showOffersOnly) && (
                        <button
                            onClick={() => { setSearchTerm(''); setSelectedCategory('all'); setShowOffersOnly(false) }}
                            className="text-sm font-bold text-red-500 hover:text-red-600 transition-colors uppercase tracking-widest"
                        >
                            Reset Filters
                        </button>
                    )}
                </div>

                {/* Products Grid */}
                {filteredAndSortedProducts.length === 0 ? (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 rounded-full mb-6">
                            <ShoppingBag className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No products match your criteria</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">Try adjusting your filters or search terms to find what you're looking for.</p>
                        <Button
                            onClick={() => { setSearchTerm(''); setSelectedCategory('all'); setShowOffersOnly(false) }}
                            variant="outline"
                            className="mt-8 rounded-full px-8"
                        >
                            View All Products
                        </Button>
                    </div>
                ) : (
                    <div className={
                        viewMode === 'grid'
                            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                            : "flex flex-col gap-6"
                    }>
                        {filteredAndSortedProducts.map(product => (
                            <div key={product.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '100ms' }}>
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Newsletter or Decorative Bottom Section */}
            <div className="bg-emerald-50 py-20 mt-20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-emerald-900 mb-4">Quality Guaranteed</h2>
                    <p className="text-emerald-700/70 max-w-md mx-auto mb-8 font-light">
                        We take pride in delivering the absolute best products directly to your doorstep with care and precision.
                    </p>
                    <div className="flex justify-center gap-12 flex-wrap text-emerald-800 font-bold text-sm uppercase tracking-widest">
                        <div className="flex flex-col items-center">
                            <span className="text-2xl mb-2">🚚</span>
                            Fast Delivery
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl mb-2">🛡️</span>
                            Secure Payments
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl mb-2">⭐</span>
                            Premium Quality
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
