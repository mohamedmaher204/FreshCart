"use client";
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, FreeMode } from 'swiper/modules';
import Image from 'next/image';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';

type ProductGalleryProps = {
    images: string[];
    title: string;
    imageCover: string;
};

export default function ProductGallery({ images, title, imageCover }: ProductGalleryProps) {
    const [thumbsSwiper, setThumbsSwiper] = React.useState<any>(null);
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [swiperInstance, setSwiperInstance] = React.useState<any>(null);

    // Put gallery images FIRST so index 0 is never the imageCover
    // (imageCover gets cached at small sizes by ProductCard on catalog pages)
    const allImages = React.useMemo(() => {
        const gallery = images || [];
        if (gallery.length === 0) {
            return [imageCover];
        }
        // If imageCover is already in gallery, just use gallery order
        if (gallery.includes(imageCover)) {
            return gallery;
        }
        // Append imageCover at the END so it doesn't appear first
        return [...gallery, imageCover];
    }, [images, imageCover]);

    if (!allImages.length) return null;

    return (
        <div className="flex flex-col gap-4">
            {/* Main Swiper */}
            <div className="relative group rounded-3xl overflow-hidden bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 aspect-square">
                <Swiper
                    spaceBetween={10}
                    navigation={true}
                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                    modules={[FreeMode, Navigation, Thumbs, Pagination]}
                    pagination={{ clickable: true }}
                    className="h-full w-full"
                    onSwiper={setSwiperInstance}
                    onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                >
                    {allImages.map((img, index) => (
                        <SwiperSlide key={`${img}-${index}`} className="flex items-center justify-center bg-white dark:bg-zinc-900">
                            <div className="relative w-full h-full flex items-center justify-center p-4">
                                <Image
                                    src={img}
                                    alt={`${title} - image ${index + 1}`}
                                    width={900}
                                    height={900}
                                    className="object-contain w-full h-full"
                                    loading={index === 0 ? 'eager' : 'lazy'}
                                    unoptimized={true}
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Thumbnail Swiper */}
            {allImages.length > 1 && (
                <div className="h-24">
                    <Swiper
                        onSwiper={setThumbsSwiper}
                        spaceBetween={12}
                        slidesPerView={4}
                        freeMode={true}
                        watchSlidesProgress={true}
                        modules={[FreeMode, Navigation, Thumbs]}
                        className="h-full"
                    >
                        {allImages.map((img, index) => (
                            <SwiperSlide key={`thumb-${img}-${index}`} className="cursor-pointer">
                                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 swiper-thumb-active:border-emerald-500 hover:border-emerald-200 transition-all">
                                    <Image
                                        src={img}
                                        alt={`${title} thumb ${index + 1}`}
                                        fill
                                        className="object-contain p-2"
                                        sizes="96px"
                                        quality={75}
                                        placeholder="empty"
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}

            <style jsx global>{`
                .swiper-wrapper {
                    display: flex;
                }
                .swiper-slide {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    height: 100%;
                }
                .swiper-slide > div {
                    width: 100%;
                    height: 100%;
                }

                .swiper-button-next, .swiper-button-prev {
                    color: #10b981;
                    background: rgba(255, 255, 255, 0.8);
                    border: 1px solid rgba(0, 0, 0, 0.05);
                    backdrop-filter: blur(4px);
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    transform: scale(0.8);
                    opacity: 0;
                    transition: all 0.3s;
                    z-index: 10;
                }
                :global(.dark) .swiper-button-next, :global(.dark) .swiper-button-prev {
                    background: rgba(24, 24, 27, 0.8);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .group:hover .swiper-button-next, .group:hover .swiper-button-prev {
                    opacity: 1;
                    transform: scale(0.9);
                }
                .swiper-button-next:after, .swiper-button-prev:after {
                    font-size: 20px;
                    font-weight: bold;
                }
                .swiper-pagination-bullet-active {
                    background: #10b981;
                }
                .swiper-slide-thumb-active div {
                    border-color: #10b981 !important;
                    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
                }
            `}</style>
        </div>
    );
}
