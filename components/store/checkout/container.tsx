"use client";

import { CartModel } from "@/models/cart-model";
import { Country } from "@/models/country-model";
import { ShippingAddressModel } from "@/models/shipping-address";
import React, { useState } from "react";
import UserShippingAddresses from "../store-shared/shipping-addresses/shipping-addresses";

interface Props {
  cart: CartModel[];
  countries: Country[];
  addresses: ShippingAddressModel[];
}

const CheckoutContainer: React.FC<Props> = ({ cart, countries, addresses }) => {
  const [selectedAddress, setSelectedAddress] =
    useState<ShippingAddressModel | null>(null);

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

        <div className="w-full py-4 px-4 bg-white my-3">
          <div className="relative">
            {cart.map((item, i) => (
              <div key={i}></div>
            ))}
          </div>
        </div>
      </div>
      {/* Cart side */}
      {/* PlaceOrderCard */}
    </div>
  );
};

export default CheckoutContainer;
