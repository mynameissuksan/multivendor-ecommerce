"use client";

import {
  ProductModelInput,
  ProductVariantModelInput,
} from "@/models/product-model";
import Link from "next/link";
import React, { useState } from "react";
import { Rating } from "react-simple-star-rating";
import ProductCardImageSwiper from "./swiper";
import VariantSwitcher from "./variant-switcher";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import ProductPrice from "../../product-page/product-price";

const ProductCard = ({ product }: { product: ProductModelInput }) => {
  const variants = product.product_varian ?? [];

  const [variant] = useState<ProductVariantModelInput>(variants[0]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  return (
    <div className="group w-48 sm:w-[225px] relative transition-all duration-75 bg-white ease-in-out p-4 rounded-t-3xl border border-transparent hover:shadow-xl hover:border-border">
      <div className="relative w-full h-full">
        <Link
          href={`/product/${product.slug}/${variant?.slug}`}
          className="w-full relative inline-block overflow-hidden"
        >
          {/* Image Swiper */}
          <ProductCardImageSwiper
            images={variant.images}
            selectedIndex={selectedImageIndex}
          />

          {/* Title */}
          <div className="text-sm text-black h-4.5 truncate line-clamp-1">
            {product.name} - {variant?.name}
          </div>

          {/* Rating - Sales */}
          {product.rating! > 0 && product.sales! > 0 && (
            <div className="flex items-center gap-x-1 h-5">
              <Rating
                className=""
                size={13}
                initialValue={Number(product.rating ?? 0)}
                SVGclassName="inline-block"
                readonly
                allowFraction
              />
              <div className="text-xs text-gray-400">{product.sales} sold</div>
            </div>
          )}
          {/* Price */}
          <ProductPrice sizes={variant.sizes} isCard />
        </Link>
      </div>
      <div className="hidden group-hover:block absolute -left-px bg-white border border-t-0 w-[calc(100%+2px)] px-4 pb-4 rounded-b-3xl shadow-xl z-30 space-y-2">
        {/* Variant switcher */}
        <VariantSwitcher
          images={variants[0].images}
          setSelectedImageIndex={setSelectedImageIndex}
          selectedImageIndex={selectedImageIndex}
        />
        {/* Action buttons */}
        <div className="flex flex-items-center justify-center px-5 space-x-4">
          <Button className="bg-pink-600 w-full">Add to cart</Button>
          <Button size="icon">
            <Heart className="w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
