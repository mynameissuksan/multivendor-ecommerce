"use client";
import { useCartStore } from "@/cart-store/useCartStore";
import FastDelivery from "@/components/store/cards/fast-delivery";
import CartHeader from "@/components/store/cart-page/cart-header";
import CartProduct from "@/components/store/cart-page/cart-product";
import CartSummary from "@/components/store/cart-page/summary";
import { SecurityPrivacyCard } from "@/components/store/product-page/shipping/returns-security-privacy-card";
import useFromStore from "@/hooks/useFromStore";
import { CartProductType } from "@/lib/types";
import React, { useMemo, useState } from "react";

const CartPage = () => {
  const cartItems = useFromStore(useCartStore, (state) => state.cart);

  const [selectedItems, setSelectedItems] = useState<CartProductType[]>([]);

  const calcItemShipping = (p: CartProductType) => {
    if (p.stock <= 0) return 0;

    if (p.shippingMethod === "ITEM") {
      const initial = Number(p.shippingFee) || 0;
      const extra =
        p.quantity > 1
          ? (Number(p.extraShippingFee) || 0) * (p.quantity - 1)
          : 0;
      return initial + extra;
    }

    if (p.shippingMethod === "WEIGHT") {
      return (
        (Number(p.shippingFee) || 0) *
        (Number(p.weight) || 0) *
        (Number(p.quantity) || 0)
      );
    }

    if (p.shippingMethod === "FIXED") {
      return Number(p.shippingFee) || 0;
    }

    return 0;
  };

  const shippingFees = useMemo(() => {
    return cartItems?.reduce((sum, p) => sum + calcItemShipping(p), 0);
  }, [cartItems]);

  return (
    <div>
      {cartItems && cartItems?.length > 0 ? (
        <div className="bg-[#f5f5f5]">
          <div className="max-w-300 mx-auto py-6 flex">
            <div className="min-w-0 flex-1">
              {/* Cart Header */}
              <CartHeader
                cartItems={cartItems}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
              />
              <div className="h-auto overflow-x-hidden overflow-auto mt-2">
                {/* Cart Items */}
                {cartItems.map((item, i) => (
                  <CartProduct
                    key={i}
                    product={item}
                    selectedItems={selectedItems}
                    setSelectedItems={setSelectedItems}
                  />
                ))}
              </div>
            </div>
            {/* Cart side */}
            <div className="sticky top-4 ml-5 w-95 max-h-max">
              {/* Cart Summary */}
              <CartSummary cartItems={cartItems} shippingFees={shippingFees!} />
              <div className="mt-2 bg-white px-6">
                <FastDelivery />
              </div>
              <div className="mt-2 bg-white px-6">
                <SecurityPrivacyCard />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>No item in cart</div>
      )}
    </div>
  );
};

export default CartPage;
