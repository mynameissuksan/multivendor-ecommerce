/* eslint-disable @typescript-eslint/no-explicit-any */
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

// import Swiper and modules styles
import "swiper/css";

import { ProductVariantImagesModelInput } from "@/models/product-model";
import Image from "next/image";
import { useEffect, useRef } from "react";

const ProductCardImageSwiper = ({
  images,
  selectedIndex = 0,
}: {
  images: ProductVariantImagesModelInput[];
  selectedIndex: number;
}) => {
  const swiperRef = useRef<any | null>(null);
  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.autoplay.stop();
      swiperRef.current.swiper.slideTo(selectedIndex);
    }
  }, [selectedIndex, swiperRef]);

  return (
    <div
      className="relative mb-2 w-full h-50 bg-white contrast-90 rounded-2xl overflow-hidden"
      onMouseEnter={() => swiperRef.current.swiper.autoplay.start()}
      onMouseLeave={() => swiperRef.current.swiper.autoplay.stop()}
    >
      <Swiper ref={swiperRef} modules={[Autoplay]} autoplay={{ delay: 500 }}>
        {images &&
          images.map((img, i) => (
            <SwiperSlide key={i}>
              <Image
                alt=""
                src={img.url!}
                height={400}
                width={400}
                className="block object-cover h-full w-48 sm:w-52"
              />
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
};

export default ProductCardImageSwiper;
