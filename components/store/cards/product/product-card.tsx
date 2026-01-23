"use client";

import {
  ProductModelInput,
  ProductVariantModelInput,
} from "@/models/product-model";
import Link from "next/link";
import React, { useState } from "react";
import { Rating } from "react-simple-star-rating";

const ProductCard = ({ product }: { product: ProductModelInput }) => {
  const variants = product.product_varian ?? [];

  const firstVariant = variants[0];

  const [variant, setVariant] = useState<ProductVariantModelInput | null>(
    firstVariant ?? null,
  );

  return (
    <div className="group w-48 sm:w-[225px] relative transition-all duration-75 bg-white ease-in-out p-4 rounded-t-3xl border border-transparent hover:shadow-xl hover:border-border">
      <div className="relative w-full h-full">
        <Link
          href={`/product/${product.slug}/${variant?.slug}`}
          className="w-full relative inline-block overflow-hidden"
        >
          {/* Image Swiper */}
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
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
