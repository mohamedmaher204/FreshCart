"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Producttype } from '@/app/_types/Product.type'
import ProductCard from '../productCard/ProductCard'
import ProductSkeleton from '../productCard/ProductSkeleton'
import { LayoutGrid, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface RelatedProductsProps {
    category: string;
    currentProductId: string;
}

export default function RelatedProducts({ category, currentProductId }: RelatedProductsProps) {
    const [products, setProducts] = useState<Producttype[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchRelated = async () => {
            try {
                // Use the products API with category filter
                const res = await axios.get(`/api/products?category=${category}&limit=6`)
                // Filter out the current product
                const filtered = res.data.data.filter((p: Producttype) => p.id !== currentProductId)
                setProducts(filtered.slice(0, 4)) // Show top 4 related
            } catch (error) {
                console.error("Related products fetch error", error)
            } finally {
                setLoading(false)
            }
        }

        if (category) {
            fetchRelated()
        }
    }, [category, currentProductId])

    if (!loading && products.length === 0) return null;

    return (
        <section className="mt-20 pt-20 border-t border-gray-100">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                <div className="space-y-2">
                    <span className="text-emerald-600 font-bold uppercase tracking-[0.2em] text-[10px] mb-2 block">Discovery</span>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">
                        RELATED <span className="text-emerald-500">PRODUCTS</span>
                    </h2>
                </div>
                <Link href={`/products?category=${category}`} className="flex items-center gap-2 text-gray-400 hover:text-emerald-600 font-bold transition-all group text-sm">
                    View more in {category} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {loading ? (
                    [1, 2, 3, 4].map(i => <ProductSkeleton key={i} />)
                ) : (
                    products.map((product, idx) => (
                        <div
                            key={product.id}
                            className="animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both"
                            style={{ animationDelay: `${idx * 150}ms` }}
                        >
                            <ProductCard product={product} />
                        </div>
                    ))
                )}
            </div>
        </section>
    )
}
