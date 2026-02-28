import React from 'react'

export default function ProductSkeleton() {
    return (
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group animate-pulse">
            {/* Image Area */}
            <div className="relative aspect-square bg-gray-200"></div>

            {/* Content Area */}
            <div className="p-5 space-y-4">
                {/* Brand/Category Tag */}
                <div className="flex justify-between items-center">
                    <div className="h-3 w-16 bg-gray-200 rounded-full"></div>
                    <div className="h-6 w-10 bg-gray-100 rounded-full"></div>
                </div>

                {/* Title */}
                <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-200 rounded-full"></div>
                    <div className="h-4 w-2/3 bg-gray-200 rounded-full"></div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="w-3 h-3 bg-gray-100 rounded-full"></div>
                    ))}
                    <div className="h-3 w-8 bg-gray-100 rounded-full ml-1"></div>
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between pt-2">
                    <div className="h-6 w-20 bg-emerald-100 rounded-full"></div>
                    <div className="h-10 w-10 bg-gray-200 rounded-xl"></div>
                </div>
            </div>
        </div>
    )
}
