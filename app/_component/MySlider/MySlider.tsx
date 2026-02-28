'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

type MySliderType = {
  children?: React.ReactNode[];
  imageUrls?: string[];
  spaceBetween?: number;
  slidesPerView?: number;
  autoplay?: boolean;
  loop?: boolean;
  className?: string;
  breakpoints?: any;
}

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function MySlider({
  children,
  imageUrls,
  spaceBetween = 20,
  slidesPerView = 1,
  autoplay = true,
  loop = true,
  className = "",
  breakpoints
}: MySliderType) {

  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const modules = [Autoplay, Navigation, Pagination];

  return (
    <div className={`relative w-full group/slider ${className}`}>
      <Swiper
        modules={modules}
        loop={loop}
        autoplay={autoplay ? { delay: 3000, disableOnInteraction: false } : false}
        spaceBetween={spaceBetween}
        slidesPerView={slidesPerView}
        onSwiper={(swiper) => setSwiperInstance(swiper)}
        pagination={{ clickable: true }}
        breakpoints={breakpoints}
        className="mySwiper rounded-2xl overflow-hidden"
      >
        {imageUrls ? (
          imageUrls.map((url, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-[300px] md:h-[500px]">
                <img
                  className='w-full h-full object-cover'
                  src={url}
                  alt={`Slide ${index + 1}`}
                />
              </div>
            </SwiperSlide>
          ))
        ) : (
          children?.map((child, index) => (
            <SwiperSlide key={index}>
              {child}
            </SwiperSlide>
          ))
        )}
      </Swiper>

      {/* Premium Custom Navigation */}
      <button
        onClick={() => swiperInstance?.slidePrev()}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md border border-white/20 shadow-2xl flex items-center justify-center text-emerald-600 opacity-0 group-hover/slider:opacity-100 transition-all duration-500 hover:bg-emerald-600 hover:text-white -translate-x-4 group-hover/slider:translate-x-0"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={() => swiperInstance?.slideNext()}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md border border-white/20 shadow-2xl flex items-center justify-center text-emerald-600 opacity-0 group-hover/slider:opacity-100 transition-all duration-500 hover:bg-emerald-600 hover:text-white translate-x-4 group-hover/slider:translate-x-0"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <style jsx global>{`
        .swiper-pagination-bullet {
          background: white !important;
          opacity: 0.5;
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active {
          background: #10b981 !important;
          opacity: 1;
          width: 24px !important;
          border-radius: 4px !important;
        }
      `}</style>
    </div>
  );
};
