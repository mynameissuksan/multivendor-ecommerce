"use client";

/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CartProductType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ProductSizeModelInput } from "@/models/product-model";
import { usePathname, useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";

interface Props {
  sizeId?: string | undefined;
  sizes?: ProductSizeModelInput[];
  isCard?: boolean;
  handleChange?: (property: keyof CartProductType, value: any) => void;
}

const ProductPrice: React.FC<Props> = ({
  sizeId,
  sizes,
  isCard,
  handleChange,
}) => {
  const lastRef = React.useRef<{ price?: number; stock?: number }>({});

  const safeSizes = sizes ?? [];

  //   sizeId passed, find the specific size and return its details
  const selectedSize = sizeId
    ? safeSizes!.find((size) => size.id === sizeId)
    : undefined;

  // console.log("size", sizeId);

  //   calculate the price after discount
  const discountedPrice = selectedSize
    ? selectedSize!.price * (1 - selectedSize!.discount / 100)
    : undefined;

  React.useEffect(() => {
    //  ไม่มี selectedSize ก็ไม่ทำอะไร
    if (!selectedSize || discountedPrice == null) return;

    //  กัน set ซ้ำจนเกิด loop (โดยเฉพาะถ้า handleChange ไป setState แล้วทำให้ re-render)
    const next = { price: discountedPrice, stock: selectedSize.quantity };
    const prev = lastRef.current;

    if (prev.price === next.price && prev.stock === next.stock) return;

    lastRef.current = next;
    handleChange!("price", next.price);
    handleChange!("stock", next.stock);
  }, [discountedPrice, handleChange, selectedSize]);

  //   Check if the sizes array is either undefined or empty
  if (!sizes || sizes.length === 0) {
    return;
  }

  //   No sizeId passed calculate rang of prices and total quantity
  if (!sizeId) {
    const discountedPrices = sizes.map(
      (size) => size.price * (1 - size.discount / 100),
    );

    // Calculate discounted prices for all sizes
    // const discountedPrices = sizes.map(
    //   (size) => size.price * (1 - size.discount / 100),
    // );

    const totalQunatity = sizes.reduce(
      (total, size) => total + size.quantity,
      0,
    );

    const minPrice = Math.min(...discountedPrices).toFixed(2);
    const maxPrice = Math.max(...discountedPrices).toFixed(2);

    // if all prices are the same, return a single price; otherwise, return range
    const priceDisplay =
      minPrice === maxPrice
        ? `฿${minPrice}`
        : isCard
          ? `฿${minPrice}`
          : `฿${minPrice} - ฿${maxPrice}`;

    // if a discount exist when minPrice = maxPrice
    let discount = 0;
    if (minPrice === maxPrice) {
      const check_discount = sizes.find((s) => s.discount > 0);
      if (check_discount) {
        discount = check_discount.discount;
      }
    }

    //    return the price display
    return (
      <div>
        <div className="text-orange-400 inline-block font-bold leading-none mr-2.5">
          <span
            className={cn("inline-block text-4xl text-nowrap", {
              "text-lg": isCard,
            })}
          >
            {priceDisplay}
          </span>
        </div>
        {!sizeId && !isCard && (
          <div className="text-orange-400 text-xs leading-4 mt-1">
            <span>Note: Select a size to see the exact price</span>
          </div>
        )}
        {!sizeId && !isCard && (
          <p className="mt-2 text-xs">{totalQunatity} pieces</p>
        )}
      </div>
    );
  }

  // if selected size is not found, short-circuit
  if (!selectedSize) {
    return <div></div>;
  }

  return (
    <div>
      <div className="text-orange-400 inline-block font-bold leading-none mr-2.5">
        {/* discounted price */}
        <span className="inline-block text-4xl">
          ฿{discountedPrice?.toFixed(2)}
        </span>
      </div>
      {/* original price */}
      {selectedSize.price !== discountedPrice && selectedSize.discount > 0 && (
        <span className="text-[#999] inline-block text-xl font-normal leading-6 mr-2 line-through">
          ฿{selectedSize.price}
        </span>
      )}
      {/* percentage off */}
      {selectedSize.discount > 0 && (
        <span className="inline-block text-orange-400 text-xl leading-6">
          {selectedSize.discount}% Off
        </span>
      )}
      <p className="mt-2 text-xs">{selectedSize.quantity} pieces</p>
    </div>
  );
};

export default ProductPrice;
