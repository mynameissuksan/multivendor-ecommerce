import { cn } from "@/lib/utils";
import { ProductVariantModelInput } from "@/models/product-model";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface VariantSelectorProps {
  variants: ProductVariantModelInput[];
  slug: string;
}

const ProductVariantSelector: React.FC<VariantSelectorProps> = ({
  variants,
  slug,
}) => {
  return (
    <div className="flex items-center flex-wrap gap-2">
      {variants.map((variant, i) => (
        <Link href={variant.url!} key={variant.id ?? i}>
          <div
            className={cn(
              "w-12 h-12 rounded-full grid place-items-center p-0.5 overflow-hidden border hover:border-gray-600 border-transparent cursor-pointer transition-all duration-75 ease-in",
              {
                "border-orange-700": variant.slug === slug,
              },
            )}
          >
            <Image
              src={variant.variant_image!}
              alt={`Product variant ${variant.url}`}
              width={48}
              height={48}
              className="rounded-full"
            />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductVariantSelector;
