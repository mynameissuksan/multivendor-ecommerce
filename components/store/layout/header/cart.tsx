"use client";

import { useCartStore } from "@/cart-store/useCartStore";
import { CartIcon } from "@/components/store/icons";
import Link from "next/link";


const Cart = () => {
  const totalItems = useCartStore((state) => state.totalItems);

  return (
    <div className="relative flex h-11 items-center px-2 cursor-pointer">
      <Link href="/cart" className="flex items-center text-white">
        <span className="text-[32px] inline-block">
          <CartIcon />
        </span>
        <div className="ml-1">
          <div className="min-h-3 min-w-6 -mt-1.5">
            <span className="inline-block text-xs text-white leading-4 bg-red-500 rounded-lg text-center font-bold min-h-3 px-1 min-w-6">
              {totalItems}
            </span>
          </div>
          <b className="text-xs font-bold text-wrap leading-4">cart</b>
        </div>
      </Link>
    </div>
  );
};

export default Cart;
