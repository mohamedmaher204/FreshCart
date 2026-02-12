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

  const modules = [Autoplay, Navigation, Pagination];

  return (
    <div className={`relative w-full ${className}`}>
      <Swiper
        modules={modules}
        loop={loop}
        autoplay={autoplay ? { delay: 3000, disableOnInteraction: false } : false}
        spaceBetween={spaceBetween}
        slidesPerView={slidesPerView}
        navigation={true}
        pagination={{ clickable: true }}
        breakpoints={breakpoints}
        className="mySwiper group rounded-2xl overflow-hidden"
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

      <style jsx global>{`
        .swiper-button-next, .swiper-button-prev {
          color: white !important;
          background: rgba(16, 185, 129, 0.4);
          backdrop-filter: blur(4px);
          width: 45px !important;
          height: 45px !important;
          border-radius: 50%;
          transition: all 0.3s ease;
          opacity: 0;
        }
        .mySwiper:hover .swiper-button-next, .mySwiper:hover .swiper-button-prev {
          opacity: 1;
        }
        .swiper-button-next:after, .swiper-button-prev:after {
          font-size: 18px !important;
          font-weight: bold;
        }
        .swiper-button-next:hover, .swiper-button-prev:hover {
          background: rgba(16, 185, 129, 0.9);
          scale: 1.1;
        }
        .swiper-pagination-bullet {
          background: white !important;
          opacity: 0.5;
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