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
}

export default function ProductCard({ product }: productCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist()

  const discountPercentage = product.priceAfterDiscount
    ? Math.round(100 - (product.priceAfterDiscount / product.price * 100))
    : 0;

  const isFavorite = isInWishlist(product.id)

  return (
    <div className='group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full'>

      {/* Image Section */}
      <div className='relative w-full aspect-square bg-gray-50 overflow-hidden'>

        {/* Discount Badge */}
        {product.priceAfterDiscount && (
          <Badge className='absolute top-3 left-3 z-10 bg-red-500 hover:bg-red-600 text-white border-0 shadow-sm'>
            {discountPercentage}% OFF
          </Badge>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product.id)}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-sm transition-all shadow-sm ${isFavorite
            ? 'bg-rose-500 text-white hover:bg-rose-600'
            : 'bg-white/80 text-gray-400 hover:text-rose-500 hover:bg-white'
            }`}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        <Link href={`/product/${product.id}`} className="block w-full h-full">
          <Image
            src={product.imageCover}
            alt={product.title}
            fill
            className='object-contain w-full h-full mix-blend-multiply p-4 group-hover:scale-110 transition-transform duration-500'
          />
        </Link>

        {/* Add To Cart Overlay (Mobile: Always visible below, Desktop: Slide up) */}
        <div className='absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden md:block bg-gradient-to-t from-white/90 to-transparent pt-10'>
          <AddToCartBtn productId={product.id} />
        </div>
      </div>

      {/* Content Section */}
      <div className='p-3 flex flex-col flex-grow'>
        <div className='flex items-center justify-between mb-2'>
          <span className='text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md'>
            {product.category.name}
          </span>
          <div className='flex items-center gap-1 text-yellow-400'>
            <Star className='w-4 h-4 fill-current' />
            <span className='text-sm text-gray-500 font-medium'>{product.ratingsAverage}</span>
          </div>
        </div>

        <Link href={`/product/${product.id}`} className="flex-grow">
          <h3 className='text-sm font-bold text-gray-900 mb-1 line-clamp-2 hover:text-emerald-600 transition-colors' title={product.title}>
            {product.title}
          </h3>
        </Link>

        <div className='flex items-end justify-between mt-4'>
          <div className='flex flex-col'>
            {product.priceAfterDiscount ? (
              <>
                <span className='text-[10px] text-gray-400 line-through'>EGP {product.price}</span>
                <span className='text-md font-bold text-emerald-600'>EGP {product.priceAfterDiscount}</span>
              </>
            ) : (
              <span className='text-md font-bold text-gray-900'>EGP {product.price}</span>
            )}
          </div>
        </div>

        {/* Mobile Add to Cart */}
        <div className='mt-4 md:hidden'>
          <AddToCartBtn productId={product.id} />
        </div>
      </div>
    </div>
  )
}
