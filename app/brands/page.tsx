import React from 'react'
import { getAllBrands } from '../_services/brands.service'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Search, Sparkles } from 'lucide-react'

export const metadata = {
    title: 'Shop by Brand | FreshCart',
    description: 'Browse our collection of premium brands and find your favorite products.',
}

export default async function BrandsPage() {
    const brands = await getAllBrands();

    if (!brands) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <h2 className="text-xl font-bold text-gray-700">Loading Brands...</h2>
            </div>
        )
    }

    return (
        <main className="bg-[#fafafa] min-h-screen pb-20 pt-10">
            {/* Header Section */}
            <div className="container mx-auto px-4 mb-16">
                <div className="relative bg-emerald-600 rounded-[2.5rem] overflow-hidden p-12 lg:p-20 shadow-2xl shadow-emerald-200">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-emerald-100 font-bold text-sm mb-6 border border-white/10">
                            <Sparkles className="w-4 h-4" /> Discover Top Labels
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                            Shop Your <span className="text-emerald-200 underline decoration-emerald-400/50 underline-offset-8">Favorite</span> Brands
                        </h1>
                        <p className="text-emerald-50/80 text-lg font-medium leading-relaxed">
                            We collaborate with the world's most trusted brands to bring you premium quality products at the best prices.
                        </p>
                    </div>
                </div>
            </div>

            {/* Brands Grid */}
            <section className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 mb-2">Featured Partners</h2>
                        <p className="text-gray-500 font-medium">Browse through {brands.length} premium brands</p>
                    </div>

                    {/* Search Bar (Static UI for now) */}
                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Find a brand..."
                            className="w-full h-12 pl-12 pr-4 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none shadow-sm font-medium"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {brands.map((brand) => (
                        <Link
                            key={brand._id}
                            href={`/products?brand=${brand._id}`}
                            className="group bg-white rounded-3xl border border-gray-100 p-6 flex flex-col items-center justify-center aspect-square shadow-sm hover:shadow-2xl hover:shadow-emerald-900/5 hover:-translate-y-2 transition-all duration-500"
                        >
                            <div className="relative w-full h-full flex items-center justify-center p-2 mb-4 bg-gray-50/50 rounded-2xl group-hover:bg-white transition-colors duration-500 overflow-hidden">
                                <Image
                                    src={brand.image}
                                    alt={brand.name}
                                    width={150}
                                    height={150}
                                    className="object-contain w-full h-full mix-blend-multiply opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                                />
                            </div>
                            <h3 className="font-bold text-gray-900 text-center text-sm truncate w-full px-2 group-hover:text-emerald-600 transition-colors">
                                {brand.name}
                            </h3>
                            <div className="mt-2 text-[10px] font-bold text-emerald-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-1">
                                View Products <ArrowRight className="w-2.5 h-2.5" />
                            </div>
                        </Link>
                    ))}
                </div>

                {brands.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-2xl text-gray-400 mb-4">
                            <Search className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Brands Found</h3>
                        <p className="text-gray-500">We couldn't find any brands at the moment. Please try again later.</p>
                    </div>
                )}
            </section>

            {/* CTA Section */}
            <div className="container mx-auto px-4 mt-32">
                <div className="bg-gray-900 rounded-[3rem] p-12 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,rgba(16,185,129,0.1)_0%,transparent_100%)]"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Can't find what you're looking for?</h2>
                        <p className="text-gray-400 mb-8 max-w-xl mx-auto font-medium">
                            Browse our full collection of products across all categories and brands.
                        </p>
                        <Link href="/products">
                            <button className="h-14 px-10 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-xl shadow-emerald-500/20 transition-all active:scale-95 group">
                                Explore All Products <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    )
}
