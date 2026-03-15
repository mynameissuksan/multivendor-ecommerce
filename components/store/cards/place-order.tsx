/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { ShippingAddressModel } from "@/models/shipping-address";

interface Props {
  shippingFees: number;
  subTotal: number;
  total: number;
  shippingAddress: ShippingAddressModel | null;
  cartId: string;
}

import React from "react";
import FastDelivery from "./fast-delivery";
import { SecurityPrivacyCard } from "../product-page/shipping/returns-security-privacy-card";
import { toast } from "sonner";
import { emptyUserCart, placeOrder } from "@/queries/user";

import { useCartStore } from "@/cart-store/useCartStore";
import { useRouter } from "next/navigation";

const PlaceOrderCard: React.FC<Props> = ({
  shippingAddress,
  shippingFees,
  subTotal,
  total,
  cartId,
}) => {
  const router = useRouter();

  const emptyCart = useCartStore((state) => state.emptyCart);

  const handlePlaceOrder = async () => {
    if (!shippingAddress) {
      toast.error("Select a shipping address first!");
    } else {
      try {
        const res = await placeOrder(shippingAddress, cartId);
        if (res.ok) {
          emptyCart();
          await emptyUserCart();
          router.push(`/order/${res.orderId}`);
        }
      } catch (error: any) {
        toast.error("Something went wrong! ", error);
      }
    }
  };
  return (
    <div className="sticky top-4 mt-3 ml-5 w-95 max-h-max">
      <div className="relative py-4 px-6 bg-white">
        <h1 className="text-gray-900 text-2xl font-bold mb-4">Summary</h1>
        <div className="mt-4 font-medium flex items-center text-[#222] text-sm">
          <h2 className="overflow-hidden whitespace-nowrap text-ellipsis break-normal">
            Subtotal
          </h2>
          <h3 className="flex-1 w-0 min-w-0 text-right">
            <span className="px-0.5 text-2xl text-black">
              <div className="text-black text-xl inline-block break-all">
                {subTotal.toFixed(2)}
              </div>
            </span>
          </h3>
        </div>
        <div className="mt-4 font-medium flex items-center text-[#222] text-sm">
          <h2 className="overflow-hidden whitespace-nowrap text-ellipsis break-normal">
            Shipping fees
          </h2>
          <h3 className="flex-1 w-0 min-w-0 text-right">
            <span className="px-0.5 text-2xl text-black">
              <div className="text-black text-xl inline-block break-all">
                {shippingFees.toFixed(2)}
              </div>
            </span>
          </h3>
        </div>
        <div className="mt-4 font-medium flex items-center text-[#222] text-sm">
          <h2 className="overflow-hidden whitespace-nowrap text-ellipsis break-normal">
            Total
          </h2>
          <h3 className="flex-1 w-0 min-w-0 text-right">
            <span className="px-0.5 text-2xl text-black">
              <div className="text-black text-xl inline-block break-all">
                {total.toFixed(2)}
              </div>
            </span>
          </h3>
        </div>
        <div className="mt-3">
          <button
            onClick={() => handlePlaceOrder()}
            type="button"
            className="bg-red-400 text-white px-5 py-2 w-full rounded-2xl hover:bg-red-300 cursor-pointer"
          >
            Place Order
          </button>
        </div>
        <div className="mt-2 p-4 px-6">
          <FastDelivery />
        </div>
        <div className="mt-2 p-4 px-6">
          <SecurityPrivacyCard />
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderCard;
