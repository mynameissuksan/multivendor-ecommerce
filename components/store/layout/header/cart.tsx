import { CartIcon } from "@/components/store/icons";
import Link from "next/link";
import React from "react";

const Cart = () => {
  const totalItem = 5;
  return (
    <div className="relative flex h-11 items-center px-2 cursor-pointer">
      <Link href="/cart" className="flex items-center text-white">
        <span className="text-[32px] inline-block">
          <CartIcon />
        </span>
        <div className="ml-1">
          <div className="min-h-3 min-w-6 -mt-1.5">
            <span className="inline-block text-xs text-white leading-4 bg-red-500 rounded-lg text-center font-bold min-h-3 px-1 min-w-6">
              {totalItem}
            </span>
          </div>
          <b className="text-xs font-bold text-wrap leading-4">cart</b>
        </div>
      </Link>
    </div>
  );
};

export default Cart;
