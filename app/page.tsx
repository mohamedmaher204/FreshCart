
import React, { lazy, Suspense } from 'react'
import { getAllProduct } from './_services/products.services';
import ProductCard from './_component/productCard/ProductCard';
import MySlider from './_component/MySlider/MySlider';
import { ShoppingBag, ArrowRight, Truck, ShieldCheck, Clock, Sparkles, Star, Heart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

import imagList1 from '@/images/slider-image-1.jpeg'
import imagList2 from '@/images/slider-image-2.jpeg'
import imagList3 from '@/images/slider-image-3.jpeg'

const CategoriesSlider = lazy(() => import('./product/[id]/CategoriesSlider/CategoriesSlider'));

export default async function Home() {
  const imagList = [imagList1.src, imagList2.src, imagList3.src];
  const products = await getAllProduct();

  if (products === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-red-100 max-w-md">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Technical Difficulty</h2>
          <p className="text-gray-500 mb-6">We're having trouble loading the products. Please refresh or try again later.</p>
          <Link href="/">
            <Button variant="outline" className="rounded-full">Reload Page</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-[#fafafa] min-h-screen pb-20">
      {/* Hero Section with Slider */}
      <section className="relative group">
        <div className="relative overflow-hidden">
          <MySlider imageUrls={imagList} />

          {/* Hero Overlay Content */}
          <div className="absolute inset-0 z-10 flex items-center pointer-events-none">
            <div className="container mx-auto px-4 md:px-12">
              <div className="max-w-xl space-y-6">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
                  <Sparkles className="w-3 h-3" /> New Season Arrivals
                </span>
                <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-2xl leading-[1.1]">
                  ELEVATE YOUR <br />
                  <span className="text-emerald-400">LIFESTYLE</span>
                </h1>
                <p className="text-white/90 text-lg md:text-xl font-medium drop-shadow-lg max-w-md">
                  Discover premium quality products curated just for your unique taste and modern needs.
                </p>
                <div className="flex gap-4 pt-4 pointer-events-auto">
                  <Link href="/products">
                    <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 h-14 text-lg shadow-xl shadow-emerald-900/20 group">
                      Shop Now <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white hover:text-emerald-900 rounded-full px-8 h-14 text-lg">
                    See Offers
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-white rounded-3xl p-8 shadow-2xl shadow-gray-200/50 border border-gray-100">
          <div className="flex items-center gap-4 p-4 border-b md:border-b-0 md:border-r border-gray-50 last:border-0 transition-colors hover:bg-emerald-50/50 rounded-2xl group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Free Delivery</h4>
              <p className="text-xs text-gray-500">On all orders over $100</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 border-b md:border-b-0 md:border-r border-gray-50 last:border-0 transition-colors hover:bg-emerald-50/50 rounded-2xl group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Secure Payment</h4>
              <p className="text-xs text-gray-500">100% secure checkouts</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 border-b md:border-b-0 md:border-r border-gray-50 last:border-0 transition-colors hover:bg-emerald-50/50 rounded-2xl group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">24/7 Support</h4>
              <p className="text-xs text-gray-500">Expert help anytime</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 transition-colors hover:bg-emerald-50/50 rounded-2xl group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Quality Items</h4>
              <p className="text-xs text-gray-500">Top brands collection</p>
            </div>
          </div>
        </div>
      </section>


      {/* Categories Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-emerald-600 font-bold uppercase tracking-widest text-sm mb-2 block">Our Categories</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">BROWSE BY <span className="text-emerald-600">DEPARTMENT</span></h2>
          </div>
          <Link href="/products" className="group flex items-center gap-2 text-gray-500 hover:text-emerald-600 font-bold transition-colors">
            View All Categories <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="relative rounded-3xl overflow-hidden shadow-xl">
          <Suspense fallback={
            <div className="w-full h-40 bg-gray-100 animate-pulse flex items-center justify-center rounded-3xl">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-emerald-300 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          }>
            <CategoriesSlider />
          </Suspense>
        </div>
      </section>


      {/* Recommended Section */}
      <section className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-emerald-600 font-bold uppercase tracking-widest text-sm mb-2 block">Special Picks</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">POPULAR <span className="text-emerald-600">PRODUCTS</span></h2>
          </div>
          <p className="text-gray-500 max-w-md md:text-right">
            Based on recent customer trends and ratings, these are the items people are loving right now.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {products.slice(0, 12).map((product) => (
            <div key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/products">
            <Button size="lg" variant="outline" className="rounded-full px-12 h-14 text-lg border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all font-bold">
              Explore Entire Catalog
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
