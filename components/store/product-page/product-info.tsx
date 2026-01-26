"use client";

import { ProductPageDataType } from "@/lib/types";
import { CopyIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import toast from "react-hot-toast";
import { Rating } from "react-simple-star-rating";
import ProductPrice from "./product-price";

interface Props {
  productData: ProductPageDataType;
  quantity?: number;
  sizeId: string | undefined;
}

const ProductInfo: React.FC<Props> = ({ productData, quantity, sizeId }) => {
  if (!productData) return;

  const variant = productData?.product[0]?.product_varian[0];
  const product = productData?.product[0];
  const colors = productData?.product[0]?.product_varian[0]?.colors![0].name;
  const sizes = productData?.product[0]?.product_varian[0]?.sizes;
  const stores = product.stores;

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
      </div>
    </div>
  );
};

export default ProductInfo;
