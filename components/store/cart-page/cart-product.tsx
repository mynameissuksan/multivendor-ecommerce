/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useCartStore } from "@/cart-store/useCartStore";
import { CartProductType } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  Trash,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface Props {
  product: CartProductType;
  selectedItems: CartProductType[];
  setSelectedItems: Dispatch<SetStateAction<CartProductType[]>>;
}

import React from "react";

const CartProduct: React.FC<Props> = ({
  product,

  selectedItems,
  setSelectedItems,
}) => {
  const unique_id = `${product.productId}-${product.variantId}-${product.sizeId}`;

  const [shippingInfo, setShippingInfo] = useState({
    initialFee: 0,
    extraFee: 0,
    totalFee: 0,
    method: product.shippingMethod,
    weight: product.weight,
    shippingService: product.shippingService,
  });

  // Function to calculate shipping fee
  const calculateShipping = () => {
    let initialFee = 0;
    let extraFee = 0;
    let totalFee = 0;

    if (product.shippingMethod === "ITEM") {
      initialFee = product.shippingFee;
      extraFee =
        Number(product.quantity) > 1
          ? Number(product.extraShippingFee) * (Number(product.quantity) - 1)
          : 0;
      totalFee = Number(initialFee) + Number(extraFee);
    } else if (product.shippingMethod === "WEIGHT") {
      totalFee =
        Number(product.shippingFee) *
        Number(product.weight) *
        Number(product.quantity);
    } else if (product.shippingMethod === "FIXED") {
      totalFee = product.shippingFee;
    }

    // Update state
    setShippingInfo({
      initialFee,
      extraFee,
      totalFee,
      method: product.shippingMethod,
      weight: product.weight,
      shippingService: product.shippingService,
    });
  };

  const { updateProductQty, removeFromCart } = useCartStore((state) => state);

  useEffect(() => {
    calculateShipping();
  }, [product]);

  const selected = selectedItems.find(
    (p) => unique_id === `${p.productId}-${p.variantId}-${p.sizeId}`,
  );

  const updateProductQtyHandler = (type: "add" | "remove") => {
    if (type === "add" && product.quantity < product.stock) {
      // Increase quantity by 1 but ensure it doesn't exceed stock
      updateProductQty(product, product.quantity + 1);
    } else if (type === "remove" && product.quantity > 1) {
      // Decrease quantity by 1 but ensure it doesn't go below 1
      updateProductQty(product, product.quantity - 1);
    }
  };

  const handleSelectProduct = () => {
    setSelectedItems((prev) => {
      const existing = prev.some(
        (item) =>
          item.variantId === product.variantId &&
          item.sizeId === product.sizeId &&
          item.productId === product.productId,
      );
      return existing
        ? prev.filter((item) => item !== product) // remove if exists
        : [...prev, product]; // add if not exists
    });
  };

  return (
    <div className="bg-white px-6 border-t border-t-[#ebebeb] select-none">
      <div className="py-4 pl-6">
        <div className="relative flex self-start">
          {/* Image */}
          <div className="flex items-center">
            {product.stock > 0 && (
              <label
                htmlFor={unique_id}
                className="p-0 text-gray-900 text-sm leading-6 inline-flex items-center mr-2 cursor-pointer align-middle"
              >
                <span className="leading-8 inline-flex p-0.5 cursor-pointer ">
                  <span
                    className={cn(
                      "leading-8 w-5 h-5 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:border-orange-500",
                      {
                        "border-orange-500": selected,
                      },
                    )}
                  >
                    {selected && (
                      <span className="bg-orange-500  w-5 h-5 rounded-full flex items-center justify-center">
                        <Check className="w-3.5 text-white mt-0.5" />
                      </span>
                    )}
                  </span>
                </span>
                <input
                  type="checkbox"
                  id={unique_id}
                  hidden
                  onChange={() => handleSelectProduct()}
                />
              </label>
            )}
            <Link
              href={`/product/${product.productSlug}/${product.variantSlug}?size=${product.sizeId}`}
            >
              <div className="m-0 mr-4 ml-2 w-28 h-28 bg-gray-200 relative rounded-lg">
                <Image
                  src={product.images}
                  alt={product.name}
                  height={200}
                  width={200}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            </Link>
          </div>
          {/* Info */}
          <div className="w-0 min-w-0 flex-1">
            {/* Title - Actions */}
            <div className="w-[calc(100%-48px)] flex items-start overflow-hidden whitespace-nowrap">
              <Link
                href={`/product/${product.productSlug}/${product.variantSlug}?size=${product.sizeId}`}
                className="inline-block overflow-hidden text-sm whitespace-nowrap truncate"
              >
                {product.name} - {product.variantName}
              </Link>
              <div className="absolute top-0 right-0">
                <span className="mr-2.5 cursor-pointer inline-block">
                  <Heart className="w-4 hover:stroke-orange-600" />
                </span>
                <span
                  onClick={() => {
                    removeFromCart(product);
                  }}
                  className="mr-2.5 cursor-pointer inline-block"
                >
                  <Trash className="w-4 hover:stroke-orange-600" />
                </span>
              </div>
            </div>
            {/* Style - size */}
            <div className="my-1">
              <button className="text-main-primary relative h-6 bg-gray-100 whitespace-normal px-2.5 py-0 max-w-full text-xs leading-4 rounded-xl font-bold cursor-pointer  outline-0">
                <span className="flex items-center justify-between flex-wrap">
                  <div className="text-left inline-block overflow-hidden text-ellipsis whitespace-nowrap max-w-[95%]">
                    {product.size}
                  </div>
                  <span className="ml-0.5">
                    <ChevronRight className="w-3" />
                  </span>
                </span>
              </button>
            </div>
            {/* Price - Delivery */}
            <div className="flex items-center justify-between mt-2 relative">
              <div>
                <span className="inline-block break-all">
                  {product.price.toFixed(2)} x {product.quantity} = {""}
                  {(product.price * product.quantity).toFixed(2)}
                </span>
              </div>
              {/* Quantity changer */}
              <div className="text-xs">
                <div className="text-gray-900 text-sm leading-6 list-none inline-flex items-center">
                  <div
                    onClick={() => updateProductQtyHandler("remove")}
                    className="w-6 h-6 text-xs bg-gray-100 hover:bg-gray-200 leading-6 grid place-items-center rounded-full cursor-pointer"
                  >
                    <Minus className="w-3 stroke-[#555]" />
                  </div>
                  <input
                    type="text"
                    value={product.quantity}
                    min={1}
                    readOnly
                    max={product.stock}
                    className="m-1 h-6 w-8 bg-white border-none leading-6 tracking-normal text-center outline-none text-gray-900 font-bold"
                  />
                  <div
                    onClick={() => updateProductQtyHandler("add")}
                    className="w-6 h-6 text-xs bg-gray-100 hover:bg-gray-200 leading-6 grid place-items-center rounded-full cursor-pointer"
                  >
                    <Plus className="w-3 stroke-[#555]" />
                  </div>
                </div>
              </div>
            </div>
            {/* Shipping info */}
            <div className="mt-1 text-xs text-[#999] cursor-pointer">
              <div className="flex items-center mb-1">
                <span>
                  <Truck className="w-4 inline-block text-[#01A971]" />
                  {shippingInfo.totalFee > 0 ? (
                    <span className="text-[#01A971] ml-1">
                      {product.shippingMethod === "ITEM" ? (
                        <>
                          {shippingInfo.initialFee} &nbsp; (first item)&nbsp; +
                          {product.quantity - 1} &nbsp; x &nbsp;
                          {product.extraShippingFee} &nbsp; (additional items)
                          &nbsp; = &nbsp;
                          {Number(shippingInfo.totalFee).toFixed(2)}
                        </>
                      ) : product.shippingMethod === "WEIGHT" ? (
                        <>
                          {product.shippingFee} x {shippingInfo.weight}kg
                          x&nbsp;
                          {product.quantity}&nbsp;
                          {product.quantity > 1 ? "items" : "item"} =&nbsp;
                          {Number(shippingInfo.totalFee).toFixed(2)}
                        </>
                      ) : (
                        <>
                          Fixed Fee : {Number(shippingInfo.totalFee).toFixed(2)}
                        </>
                      )}
                    </span>
                  ) : (
                    <span className="text-[#01A971] ml-1">Free Delivery</span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartProduct;
