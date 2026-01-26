import { cn } from "@/lib/utils";
import { ProductSizeModelInput } from "@/models/product-model";
import { usePathname, useRouter } from "next/navigation";

import React from "react";

interface Props {
  sizeId?: string | undefined;
  sizes?: ProductSizeModelInput[];
  isCard?: boolean;
}

const ProductPrice: React.FC<Props> = ({ sizeId, sizes, isCard }) => {
  // get the current URL path
  const pathname = usePathname();

  //   Destructure the replace method from useRouter hook
  const { replace } = useRouter();

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
            <span>Note: Seelct a size to see the exact price</span>
          </div>
        )}
        {!sizeId && !isCard && (
          <p className="mt-2 text-xs">{totalQunatity} pieces</p>
        )}
      </div>
    );
  }

  return <div>{sizeId}</div>;
};

export default ProductPrice;
