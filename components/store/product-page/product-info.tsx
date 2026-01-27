"use client";

import { ProductPageDataType } from "@/lib/types";
import { CopyIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import toast from "react-hot-toast";
import { Rating } from "react-simple-star-rating";
import ProductPrice from "./product-price";
import CountDown from "../store-shared/countdown";
import { Separator } from "@/components/ui/separator";
import ColorWheel from "@/components/shared/color-wheel";
import ProductVariantSelector from "./variant-selector";
import SizeSelector from "./size-selector";
import ProductAssurancePoliy from "./product-assurance-policy";

interface Props {
  productData: ProductPageDataType;

  quantity?: number;
  sizeId: string | undefined;
  variantSlug: string;
}

const ProductInfo: React.FC<Props> = ({
  productData,
  quantity,
  sizeId,
  variantSlug,
}) => {
  if (!productData) return;

  const product = productData?.products[0];
  const variants = product?.product_varian ?? [];
  const selectedSlug = variantSlug ?? variants[0]?.slug;
  const variant = variants.find((v) => v.slug === selectedSlug) ?? variants[0];
  const colors = variant?.colors;
  const sizes = variant?.sizes;
  const stores = product?.stores;

  const productId = product.id;
  const productName = product.name;
  const sku = variant.sku;
  const variantImage = variant.variant_image;

  const isSale = variant.is_sale;
  const saleEndDate = variant.sale_end_date;
  const variantName = variant.name;
  const productRating = product.rating;
  const numReviews = productData.numReviews;

  //   copy the sku clipboard
  const copySkuToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sku as string);
      toast.success("Copied successfully");
    } catch (error) {
      toast.error(`Failed to copy: ${error}`);
    }
  };

  return (
    <div className="relative w-full xl:w-135">
      {/* Title */}
      <div>
        <h1 className="text-black inline font-bold leading-5">
          {productName} - {variantName}
        </h1>
      </div>
      {/* Sku - Rating - Num Reviews */}
      <div className="flex items-center text-xs mt-2">
        {/* Store details */}
        <Link
          href={`/store/${stores?.url}`}
          className="hidden sm:inline-block md:hidden lg:inline-block mr-2 hover:underline"
        >
          <div className="w-full flex items-center gap-x-1">
            <Image
              src={stores?.logo ?? ""}
              alt={stores?.logo ?? ""}
              width={100}
              height={100}
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
        </Link>
        <div className="whitespace-nowrap">
          <span className="flex-1 overflow-hidden truncate whitespace-nowrap text-gray-500">
            SKU : {sku}
          </span>
          <span
            onClick={copySkuToClipboard}
            className="inline-block align-middle text-[#2f68a8] mx-1 cursor-pointer"
          >
            <CopyIcon className="w-3" />
          </span>
        </div>
        {/*  */}
        <div className="ml-4 flex items-center gap-x-2 flex-1 whitespace-nowrap">
          <Rating
            className=""
            size={13}
            initialValue={Number(productRating ?? 0)}
            SVGclassName="inline-block"
            readonly
            allowFraction
          />
          <Link href="#reviews" className="text-[#0464ff] hover:underline">
            {numReviews === 0
              ? "No review yet"
              : numReviews === 1
                ? "1 review"
                : numReviews + " reviews"}
          </Link>
        </div>
      </div>
      <div className="my-2 relative flex flex-col sm:flex-row justify-between">
        <ProductPrice sizeId={sizeId} sizes={sizes} />
        {isSale && saleEndDate && <CountDown targetDate={saleEndDate} />}
      </div>
      <Separator className="mt-2" />
      {/* Color Wheel - variant switcher */}
      <div className="mt-4 space-y-2">
        <div className="relative flex items-center justify-between text-black font-bold">
          <span className="flex items-center gap-x-2">
            {colors!.length > 1 ? "Colors" : "Color"}
            <ColorWheel colors={colors!} size={25} />
          </span>
        </div>
        {variants!.length > 0 && (
          <ProductVariantSelector variants={variants} slug={variantSlug} />
        )}
      </div>

      {/* Size selector */}
      <div className="space-y-2 pb-2 mt-4">
        <div className="">
          <h1 className="text-gray-800 font-bold">Size</h1>
        </div>
        <SizeSelector sizeId={sizeId} sizes={sizes!} />
      </div>

      {/* Product assurance */}
      <Separator className="mt-2" />
      <ProductAssurancePoliy />
    </div>
  );
};

export default ProductInfo;
