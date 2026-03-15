import Image from "next/image";
import React from "react";
import CartImg from "@/public/assets/images/cart.avif";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const EmptyCart = () => {
  return (
    <div className="bg-[#f5f5f5] min-h-[calc(100vh-125px)] w-full mx-auto px-4 text-center ">
      <div className="h-full pb-14 flex flex-col justify-center items-center">
        <Image
          src={CartImg}
          alt="Cart Image"
          height={300}
          width={300}
          className="w-64 h-64"
        />
        <span className="py-4 font-bold my-3">
          No items yet? Continue shopping to explore mroe.
        </span>
        <Link href="/browse">
          <Button className="w-56 cursor-pointer">
            Explore items
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default EmptyCart;
