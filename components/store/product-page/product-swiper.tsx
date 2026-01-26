/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { cn } from "@/lib/utils";
import { ProductVariantImagesModelInput } from "@/models/product-model";
import Image from "next/image";
import React, { useState } from "react";
import ImageZoom from "react-image-zooom";

const ProductSwiper = ({
  images,
}: {
  images: ProductVariantImagesModelInput[];
}) => {
  // if no images are provided, exit early and don't render anything
  if (!images) return;

  //   useState hook to manage the active image being displayed,initialized to the first
  const [activeImage, setActiveImage] =
    useState<ProductVariantImagesModelInput>(images[0]);

  return (
    <div className="relative">
      <div className="relative w-full flex flex-col-reverse xl:flex-row gap-2 ">
        {/* Thumbnails */}
        <div className="flex flex-wrap xl:flex-col gap-3">
          {images.map((img, i) => (
            <div
              key={i}
              className={cn(
                "w-16 h-16 rounded-md grid place-items-center overflow-hidden border border-gray-100 cursor-pointer transition-all duration-75 ease-in",
                {
                  "border-gray-700": activeImage.id === img.id,
                },
              )}
            >
              <Image
                onMouseEnter={() => setActiveImage(img)}
                src={img.url}
                alt={img.alt ?? ""}
                width={80}
                height={80}
                className="object-cover rounded-md"
              />
            </div>
          ))}
        </div>
        {/* image view */}
        <div className="relative rounded-lg overflow-hidden w-full 2xl:h-150 2xl:w-150">
          <ImageZoom
            src={activeImage.url}
            alt="A image to apply the ImageZoom plugin"
            fullWidth={true}
            zoom={200}
            className="w-full!"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductSwiper;
