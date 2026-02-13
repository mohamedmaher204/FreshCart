import { getProduct } from '@/app/_services/products.services';
import React from 'react';
import { ShoppingCart, Heart, ShieldCheck, Truck, RefreshCw, Star, ArrowRight, Share2, Info } from 'lucide-react';
import Link from 'next/link';
import ProductGallery from './ProductGallery';
import AddToCartBtn from '@/app/_component/productCard/AddToCartBtn';

type ProductDetailsProps = {
    params: {
        id: string
    }
}

export default async function page({ params }: ProductDetailsProps) {
    const { id } = await params;
    const productData = await getProduct(id);

    if (!productData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh]">
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <h2 className="text-xl font-bold text-gray-700">Finding your product...</h2>
            </div>
        );
    }

    return (
        <div className="bg-[#fafafa] min-h-screen">
            <div className="container mx-auto px-4 py-8">

                {/* Breadcrumbs */}
                <nav className="mb-8 overflow-x-auto no-scrollbar">
                    <ul className="flex items-center gap-2 text-xs md:text-sm font-semibold text-gray-400 whitespace-nowrap">
                        <li><Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link></li>
                        <li><ArrowRight className="w-3 h-3" /></li>
                        <li><Link href="/products" className="hover:text-emerald-600 transition-colors">All Products</Link></li>
                        <li><ArrowRight className="w-3 h-3" /></li>
                        <li><Link href={`/products?category=${productData.category._id}`} className="hover:text-emerald-600 transition-colors font-bold text-gray-600">{productData.category.name}</Link></li>
                        <li><ArrowRight className="w-3 h-3" /></li>
                        <li className="text-emerald-600 truncate max-w-[150px] md:max-w-xs">{productData.title}</li>
                    </ul>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">

                    {/* Gallery Section */}
                    <div className="lg:col-span-5 xl:col-span-6">
                        <div className="sticky top-24">
                            <ProductGallery
                                images={productData.images}
                                title={productData.title}
                                imageCover={productData.imageCover}
                            />
                        </div>
                    </div>

                    {/* Information Section */}
                    <div className="lg:col-span-7 xl:col-span-6">
                        <div className="max-w-2xl">
                            {/* Header */}
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-lg uppercase tracking-wider">
                                    {productData.category.name}
                                </span>
                                <div className="h-4 w-px bg-gray-200"></div>
                                <span className="text-gray-500 font-bold text-sm">
                                    {productData.brand.name}
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-4xl xl:text-5xl font-black text-gray-900 mb-6 leading-tight">
                                {productData.title}
                            </h1>

                            {/* Ratings & Social */}
                            <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1 bg-white border border-gray-100 px-3 py-1.5 rounded-full shadow-sm">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span className="text-gray-900 font-black">{productData.ratingsAverage || 0}</span>
                                    </div>
                                    <span className="text-gray-400 font-bold text-xs md:text-sm">
                                        Based on <span className="text-gray-900">{productData.ratingsQuantity}</span> authentic reviews
                                    </span>
                                </div>
                                <button className="p-2.5 bg-white border border-gray-100 rounded-full text-gray-400 hover:text-emerald-600 hover:border-emerald-100 transition-all shadow-sm">
                                    <Share2 className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Price Section */}
                            <div className="mb-10 flex items-center justify-between gap-6 flex-wrap">
                                <div>
                                    <div className="flex items-center gap-4 mb-1">
                                        {productData.priceAfterDiscount ? (
                                            <>
                                                <span className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                                                    EGP {productData.priceAfterDiscount}
                                                </span>
                                                <span className="text-xl font-bold text-gray-300 line-through decoration-red-500/40">
                                                    {productData.price}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                                                EGP {productData.price}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-emerald-600 text-sm font-bold flex items-center gap-1.5">
                                        <ShieldCheck className="w-4 h-4" /> Best Price Guaranteed
                                    </p>
                                </div>
                                {productData.quantity > 0 && productData.quantity < 10 && (
                                    <div className="bg-orange-50 px-4 py-2 rounded-2xl border border-orange-100 text-orange-600 font-black text-xs animate-pulse">
                                        LAST {productData.quantity} LEFT IN STOCK!
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 mb-12">
                                <div className="flex-[3]">
                                    <AddToCartBtn productId={productData.id} />
                                </div>
                                <button className="flex-1 min-w-[64px] h-14 bg-white border-2 border-gray-100 hover:border-rose-100 hover:bg-rose-50 text-gray-400 hover:text-rose-500 rounded-2xl transition-all flex items-center justify-center group shadow-sm">
                                    <Heart className="w-6 h-6 transition-transform group-hover:scale-125 group-active:fill-rose-500" />
                                </button>
                            </div>

                            {/* Info Tabs-like Section */}
                            <div className="space-y-6 mb-12">
                                <details className="group border-b border-gray-100 pb-6 open:pb-8" open>
                                    <summary className="flex items-center justify-between list-none cursor-pointer">
                                        <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                                            <Info className="w-5 h-5 text-emerald-600" />
                                            Product Overview
                                        </h3>
                                        <span className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-open:rotate-180 transition-transform">
                                            <ArrowRight className="w-3 h-3 rotate-90" />
                                        </span>
                                    </summary>
                                    <div className="mt-6 text-gray-600 leading-relaxed font-medium">
                                        {productData.description || "Experience supreme comfort and style with this premium product. Designed for those who appreciate quality and attention to detail. Every thread and component has been carefully selected to ensure durability and performance."}
                                    </div>
                                </details>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white border border-gray-100 p-5 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                                        <Truck className="w-6 h-6 text-emerald-600 mb-3" />
                                        <h4 className="font-black text-sm text-gray-900 mb-1">Fast Shipping</h4>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Estimated: 2-4 Days</p>
                                    </div>
                                    <div className="bg-white border border-gray-100 p-5 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                                        <RefreshCw className="w-6 h-6 text-emerald-600 mb-3" />
                                        <h4 className="font-black text-sm text-gray-900 mb-1">Easy Returns</h4>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">30 Days Policy</p>
                                    </div>
                                </div>
                            </div>

                            {/* Brand Badge */}
                            <div className="bg-gray-900 rounded-3xl p-6 flex items-center justify-between group cursor-pointer hover:bg-black transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center overflow-hidden p-2">
                                        <img src={productData.brand.image} alt={productData.brand.name} className="w-full h-full object-contain" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-0.5">Official Partner</p>
                                        <h4 className="text-white font-black text-lg">{productData.brand.name}</h4>
                                    </div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-emerald-400 group-hover:translate-x-2 transition-all" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
