/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { ProductPageDataType } from "@/lib/types";
import { ChevronDown, ChevronRight, ChevronUp, Truck } from "lucide-react";
import React, { useEffect, useState } from "react";
import ProductShippingFee from "./shipping-fee";
import { getShippingDateRange } from "@/lib/utils";

interface Props {
  shippingDetails: ProductPageDataType;
  quantity: number;
  weight: number;
}

const ShippingDetails: React.FC<Props> = ({
  shippingDetails,
  quantity,
  weight,
}) => {
  const [toggle, setToggle] = useState<boolean>(false);

  const shippingDetail = shippingDetails?.shippingDetails;
  if (typeof shippingDetail === "boolean") return null;

  const [shippingTotal, setShippingTotal] = useState<number>();

  useEffect(() => {
    switch (shippingDetail?.shippingFeeMethod) {
      case "ITEM":
        const qty = quantity - 1;
        setShippingTotal(
          Number(shippingDetail.shippingFee) +
            qty * Number(shippingDetail.extraShippingFee),
        );

        break;
      case "WEIGHT":
        setShippingTotal(shippingDetail.shippingFee * quantity);
        break;
      case "FIXED":
        setShippingTotal(shippingDetail.shippingFee);
        break;
      default:
        break;
    }
  }, [quantity, shippingDetail]);

  const { minDate, maxDate } = getShippingDateRange(
    Number(shippingDetail?.deliveryTimeMin),
    Number(shippingDetail?.deliveryTimeMax),
  );

  return (
    <div>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          {/* Shipping detail */}
          <div className="flex items-center gap-x-1">
            <Truck className="w-4" />
            {shippingDetail?.isFreeShipping ? (
              <span className="text-sm font-bold flex items-center">
                <span>
                  Free Shipping to &nbsp;
                  <span>{shippingDetail?.countryName}</span>
                </span>
              </span>
            ) : (
              <span className="text-sm font-bold flex items-center">
                <span>
                  Shipping to &nbsp;<span>{shippingDetail?.countryName}</span>
                </span>
                <span>&nbsp; for &nbsp; ฿{shippingTotal}</span>
              </span>
            )}
          </div>
          {/*  */}
          <ChevronRight className="w-3" />
        </div>
        <span className="flex items-center text-sm ml-5">
          Service;&nbsp;
          <strong className="text-sm">{shippingDetail?.shippingService}</strong>
        </span>
        <span className="flex items-center text-sm ml-5">
          Delivery:&nbsp;{" "}
          <strong className="text-sm">
            {minDate.slice(4)} - {maxDate.slice(4)}
          </strong>
        </span>

        {/* Product shipping free */}
        {!shippingDetail?.isFreeShipping && toggle && (
          <ProductShippingFee
            fee={shippingDetail!.shippingFee}
            extraFee={shippingDetail!.extraShippingFee}
            quantity={2}
            method={shippingDetail!.shippingFeeMethod}
            weight={weight}
          />
        )}
        <div
          onClick={() => setToggle((prev) => !prev)}
          className="max-w-[calc(100%-2rem)] ml-4 flex items-center bg-gray-100 hover:bg-gray-200 h-5 cursor-pointer"
        >
          <div className="flex w-full items-center justify-between gap-x-1 px-2">
            <span className="text-xs">
              {toggle ? "Hide" : "shipping Fee Breakdown"}
            </span>
            {toggle ? (
              <ChevronUp className="w-4" />
            ) : (
              <ChevronDown className="w-4" />
            )}
          </div>
        </div>
      </div>
      .
    </div>
  );
};

export default ShippingDetails;
