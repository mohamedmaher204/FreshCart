
import MySlider from '@/app/_component/MySlider/MySlider';
import { getAllCategories } from '@/app/_services/categoriec.service';
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default async function CategoriesSlider() {
  const categoriesData = await getAllCategories();

  if (categoriesData === null) {
    return (
      <div className="h-40 flex items-center justify-center bg-gray-50 rounded-2xl border border-gray-100 italic text-gray-400">
        Unable to load categories at this time.
      </div>
    );
  }

  return (
    <div className="py-2">
      <MySlider
        slidesPerView={2}
        spaceBetween={20}
        breakpoints={{
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 6 },
          1280: { slidesPerView: 7 }
        }}
        autoplay={true}
        loop={true}
      >
        {categoriesData.map((category) => (
          <Link
            key={category._id}
            href={`/products?category=${category._id}`}
            className="group block"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-transparent group-hover:border-emerald-500 transition-all duration-500 shadow-md transform group-hover:-translate-y-2">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
              </div>
              <h3 className="text-sm font-bold text-gray-700 group-hover:text-emerald-600 transition-colors text-center line-clamp-1 uppercase tracking-wider">
                {category.name}
              </h3>
            </div>
          </Link>
        ))}
      </MySlider>
    </div>
  );
}
