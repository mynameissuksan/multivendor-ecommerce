"use client";

import Image from "next/image";
import { useState } from "react";
import { Heart } from "lucide-react";

interface ImageGalleryProps {
  images: Array<{ id: string; url: string; alt: string }>;
  productName: string;
  isSale: boolean;
  discountPercentage: number;
}

export default function ImageGallery({
  images,
  productName,
  isSale,
  discountPercentage,
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-white rounded-3xl shadow-xl overflow-hidden group">
        <Image
          src={images[selectedImage]?.url || ""}
          alt={productName}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
        {isSale && (
          <div className="absolute top-6 left-6 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full font-bold shadow-lg animate-pulse">
            SALE {discountPercentage}% OFF
          </div>
        )}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className={`absolute top-6 right-6 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
            isLiked ? "bg-red-50" : ""
          }`}
        >
          <Heart
            className={`w-5 h-5 transition-all ${
              isLiked ? "text-red-500 fill-red-500" : "text-slate-700"
            }`}
          />
        </button>

        {/* Image Navigation Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === selectedImage
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`View image ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnail Gallery */}
      <div className="grid grid-cols-4 gap-3">
        {images.map((img, idx) => (
          <button
            key={img.id}
            onClick={() => setSelectedImage(idx)}
            className={`relative aspect-square bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 ${
              idx === selectedImage
                ? "border-blue-500 ring-2 ring-blue-200"
                : "border-transparent hover:border-blue-300"
            }`}
          >
            <Image
              src={img.url}
              alt={`${productName} view ${idx + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
