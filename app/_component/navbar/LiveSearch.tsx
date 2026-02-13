"use client"
import React, { useState, useEffect, useRef } from 'react'
import { Search, X, Loader2, ArrowRight } from 'lucide-react'
import { Producttype } from '@/app/_types/Product.type'
import { getAllProduct } from '@/app/_services/products.services'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LiveSearch() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<Producttype[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [allProducts, setAllProducts] = useState<Producttype[]>([])
    const searchRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    // Pre-fetch products for fast client-side filtering
    useEffect(() => {
        const fetchAll = async () => {
            const data = await getAllProduct()
            if (data) setAllProducts(data)
        }
        fetchAll()
    }, [])

    // Close search results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Filter products as user types
    useEffect(() => {
        if (query.trim().length > 1) {
            setIsLoading(true)
            const timer = setTimeout(() => {
                const filtered = allProducts.filter(product =>
                    product.title.toLowerCase().includes(query.toLowerCase()) ||
                    product.category.name.toLowerCase().includes(query.toLowerCase())
                ).slice(0, 6) // Limit to 6 results
                setResults(filtered)
                setIsLoading(false)
                setIsOpen(true)
            }, 300)
            return () => clearTimeout(timer)
        } else {
            setResults([])
            setIsOpen(false)
        }
    }, [query, allProducts])

    const handleSelect = (id: string) => {
        setIsOpen(false)
        setQuery('')
        router.push(`/product/${id}`)
    }

    return (
        <div className='relative flex-grow max-w-lg mx-4 hidden md:block' ref={searchRef}>
            <div className='relative group'>
                <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-100/60 group-focus-within:text-white transition-colors' />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length > 1 && setIsOpen(true)}
                    placeholder="Search for products, categories..."
                    className='w-full bg-white/10 hover:bg-white/15 focus:bg-white/20 text-white placeholder:text-emerald-100/50 border border-white/10 focus:border-white/30 rounded-2xl py-2.5 pl-11 pr-10 outline-none transition-all font-medium text-sm backdrop-blur-sm'
                />
                {query && (
                    <button
                        onClick={() => setQuery('')}
                        className='absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-all'
                    >
                        <X className='w-4 h-4' />
                    </button>
                )}
            </div>

            {/* Results Dropdown */}
            {isOpen && (
                <div className='absolute top-full mt-3 left-0 right-0 bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 z-[100] max-h-[450px] overflow-y-auto'>
                    <div className='p-2'>
                        {isLoading ? (
                            <div className='flex flex-col items-center justify-center py-10 gap-3'>
                                <Loader2 className='w-8 h-8 text-emerald-500 animate-spin' />
                                <p className='text-xs font-bold text-gray-400 uppercase tracking-widest'>Searching Store...</p>
                            </div>
                        ) : results.length > 0 ? (
                            <div className='flex flex-col'>
                                <div className='px-4 py-2 border-b border-gray-50 flex items-center justify-between'>
                                    <span className='text-[10px] font-black text-emerald-600 uppercase tracking-widest'>Matching Results</span>
                                    <span className='text-[10px] font-bold text-gray-400'>{results.length} found</span>
                                </div>
                                {results.map((product) => (
                                    <button
                                        key={product.id}
                                        onClick={() => handleSelect(product.id)}
                                        className='flex items-center gap-4 p-3 hover:bg-emerald-50/50 transition-all rounded-2xl text-left group'
                                    >
                                        <div className='relative w-14 h-14 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 group-hover:border-emerald-200 transition-colors'>
                                            <Image
                                                src={product.imageCover}
                                                alt={product.title}
                                                fill
                                                className='object-contain p-2'
                                            />
                                        </div>
                                        <div className='flex-grow min-w-0'>
                                            <h4 className='text-sm font-black text-gray-900 truncate group-hover:text-emerald-600 transition-colors'>{product.title}</h4>
                                            <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1'>{product.category.name}</p>
                                            <div className='flex items-center gap-2'>
                                                <span className='text-sm font-black text-emerald-600'>EGP {product.priceAfterDiscount || product.price}</span>
                                                {product.priceAfterDiscount && (
                                                    <span className='text-[10px] text-gray-300 line-through font-bold'>EGP {product.price}</span>
                                                )}
                                            </div>
                                        </div>
                                        <ArrowRight className='w-4 h-4 text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all mr-2' />
                                    </button>
                                ))}
                                <Link
                                    href={`/products?search=${query}`}
                                    onClick={() => setIsOpen(false)}
                                    className='m-2 p-3 bg-gray-50 hover:bg-emerald-600 hover:text-white text-gray-600 rounded-xl text-center text-xs font-black uppercase tracking-widest transition-all'
                                >
                                    View All Results
                                </Link>
                            </div>
                        ) : (
                            <div className='flex flex-col items-center justify-center py-10 px-6 text-center gap-2'>
                                <div className='w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-2'>
                                    <Search className='w-6 h-6 text-gray-300' />
                                </div>
                                <h4 className='text-sm font-black text-gray-900'>No products found</h4>
                                <p className='text-xs text-gray-400 font-medium'>Adjust your search or try searching for a different category.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
