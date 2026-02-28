"use client"
import { Producttype } from '@/app/_types/Product.type'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import AddToCartBtn from './AddToCartBtn'
import { Star, Heart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useWishlist } from '@/app/providers/WishlistContextProvider'

type productCardProps = {
  product: Producttype
  priority?: boolean
}

export default function ProductCard({ product, priority = false }: productCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist()

  const discountPercentage = product.priceAfterDiscount
    ? Math.round(100 - (product.priceAfterDiscount / product.price * 100))
    : 0;

  const isFavorite = isInWishlist(product.id)

  return (
    <div className='group relative bg-white dark:bg-zinc-900 rounded-[2rem] border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col h-full hover:-translate-y-2 animate-reveal'>

      {/* Image Section */}
      <div className='relative w-full aspect-square bg-gray-50 dark:bg-zinc-800/50 overflow-hidden'>

        {/* Discount Badge */}
        {product.priceAfterDiscount && (
          <div className="absolute top-4 left-4 z-10">
            <Badge className='bg-red-500 hover:bg-red-600 text-white border-0 shadow-lg px-3 py-1 font-black uppercase text-[10px] tracking-widest rounded-lg'>
              {discountPercentage}% OFF
            </Badge>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product.id)}
          className={`absolute top-4 right-4 z-10 p-3 rounded-2xl backdrop-blur-md transition-all duration-300 shadow-lg active:scale-90 ${isFavorite
            ? 'bg-rose-500 text-white'
            : 'bg-white/80 dark:bg-zinc-900/80 text-gray-400 hover:text-rose-500 hover:bg-white dark:hover:bg-zinc-800'
            }`}
        >
          <Heart className={`w-5 h-5 transition-all duration-300 ${isFavorite ? 'fill-current scale-110' : 'group-hover:scale-110'}`} />
        </button>

        <Link href={`/product/${product.id}`} className="block w-full h-full p-6">
          <div className="w-full h-full relative transition-transform duration-700 group-hover:scale-110">
            <Image
              src={product.imageCover}
              alt={product.title}
              fill
              className='object-contain w-full h-full dark:brightness-95 transition-transform duration-700'
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
              quality={90}
              priority={priority}
            />
          </div>
        </Link>

        {/* Add To Cart Overlay Desktop */}
        <div className='absolute bottom-0 left-0 right-0 p-6 hidden md:block bg-gradient-to-t from-white dark:from-zinc-900 via-white/80 dark:via-zinc-900/80 to-transparent pt-12 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out'>
          <AddToCartBtn productId={product.id} />
        </div>
      </div>

      {/* Content Section */}
      <div className='p-6 flex flex-col flex-grow bg-white dark:bg-zinc-900'>
        <div className='flex items-center justify-between mb-4'>
          <span className='text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-xl'>
            {product.category.name}
          </span>
          <div className='flex items-center gap-1.5 text-amber-400'>
            <Star className='w-4 h-4 fill-current' />
            <span className='text-xs text-gray-400 dark:text-zinc-500 font-black uppercase tracking-widest'>{product.ratingsAverage}</span>
          </div>
        </div>

        <Link href={`/product/${product.id}`} className="flex-grow group/title">
          <h3 className='text-md font-black text-gray-900 dark:text-zinc-100 mb-3 line-clamp-2 leading-tight transition-colors group-hover/title:text-emerald-600 dark:group-hover/title:text-emerald-400 uppercase tracking-tighter' title={product.title}>
            {product.title}
          </h3>
        </Link>

        <div className='flex items-end justify-between mt-auto'>
          <div className='flex flex-col gap-0.5'>
            {product.priceAfterDiscount ? (
              <>
                <span className='text-[11px] text-gray-300 dark:text-zinc-600 line-through font-bold'>EGP {product.price}</span>
                <span className='text-xl font-black text-emerald-600 dark:text-emerald-400 tracking-tighter'>EGP {product.priceAfterDiscount}</span>
              </>
            ) : (
              <span className='text-xl font-black text-gray-900 dark:text-zinc-100 tracking-tighter'>EGP {product.price}</span>
            )}
          </div>
        </div>

        {/* Mobile Add to Cart */}
        <div className='mt-6 md:hidden'>
          <AddToCartBtn productId={product.id} />
        </div>
      </div>
    </div>
  )
}
