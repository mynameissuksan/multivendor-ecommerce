"use client";

import { CartModel } from "@/models/cart-model";
import { Country } from "@/models/country-model";
import { ShippingAddressModel } from "@/models/shipping-address";
import React, { useState } from "react";
import UserShippingAddresses from "../store-shared/shipping-addresses/shipping-addresses";
import CheckoutProductCard from "../cards/checkout-product";
import PlaceOrderCard from "../cards/place-order";

interface Props {
  cart: CartModel[];
  countries: Country[];
  addresses: ShippingAddressModel[];
}

const CheckoutContainer: React.FC<Props> = ({ cart, countries, addresses }) => {
  const [selectedAddress, setSelectedAddress] =
    useState<ShippingAddressModel | null>(null);

  const cartItem = cart[0];

  return (
    <div className="flex">
      <div className="flex-1 py-3">
        {/* UserShippingAddresses */}
        <UserShippingAddresses
          addresses={addresses}
          countries={countries}
          selectedAddress={selectedAddress}
          setSelectedAddress={setSelectedAddress}
        />
        {/* Cart side */}
        <div className="w-full py-4 px-4 bg-white my-3">
          <div className="relative">
            {cart.map((item, i) => (
              <CheckoutProductCard key={i} product={item} />
            ))}
          </div>
        </div>
      </div>

      {/* PlaceOrderCard */}
      <PlaceOrderCard
        cartId={cartItem.id}
        shippingAddress={selectedAddress}
        shippingFees={Number(cartItem.shipping_fees)}
        subTotal={Number(cartItem.sub_total)}
        total={Number(cartItem.total)}
      />
    </div>
  );
};

export default CheckoutContainer;
