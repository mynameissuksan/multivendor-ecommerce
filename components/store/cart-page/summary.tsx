/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { CartProductType } from "@/lib/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { saveUserCart } from "@/queries/user";
import { PulseLoader } from "react-spinners";

interface Props {
  cartItems: CartProductType[];
  shippingFees: number;
}

const CartSummary: React.FC<Props> = ({ cartItems, shippingFees }) => {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);

  const subtotal = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const total = subtotal + shippingFees;

  const handleSaveCart = async () => {
    try {
      setLoading(true);
      const res = await saveUserCart(cartItems);

      console.log(res);

      if (res) {
        router.push("/checkout");
        setLoading(false);
      }
    } catch (error: any) {
      console.log("error ", error);
      toast.error(error.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative py-2 px-6 bg-white">
      <h1 className="text-gray-900 text-2xl font-bold mb-4">Summary</h1>
      <div className="mt-4 font-medium flex items-center text-[#222] text-sm">
        <h2 className="overflow-hidden whitespace-normal text-ellipsis break-normal">
          Subtotal
        </h2>
        <h3 className="flex-1 w-0 min-w-0 text-right">
          <span className="px-0.5 text-2xl text-black">
            <div className="text-black text-xl inline-block break-all">
              {Number(subtotal).toFixed(2)}
            </div>
          </span>
        </h3>
      </div>

      <div className="mt-4 font-medium flex items-center text-[#222] text-sm">
        <h2 className="overflow-hidden whitespace-normal text-ellipsis break-normal">
          Shipping Fees
        </h2>
        <h3 className="flex-1 w-0 min-w-0 text-right">
          <span className="px-0.5 text-2xl text-black">
            <div className="text-black text-xl inline-block break-all">
              + {Number(shippingFees).toFixed(2)}
            </div>
          </span>
        </h3>
      </div>

      <div className="mt-4  flex items-center text-[#222] text-xl font-bold">
        <h2 className="overflow-hidden whitespace-normal text-ellipsis break-normal">
          Total
        </h2>
        <h3 className="flex-1 w-0 min-w-0 text-right">
          <span className="px-0.5 text-xl text-black">
            <div className="text-black text-xl inline-block break-all">
              {Number(total).toFixed(2)}
            </div>
          </span>
        </h3>
      </div>

      <button
        onClick={() => handleSaveCart()}
        className="py-2 min-w-20 cursor-pointer text-white border-0 bg-[#fd384f] h-11 leading-6 rounded-3xl w-full flex items-center justify-center font-bold whitespace-nowrap text-center relative mt-4"
      >
        {loading ? (
          <>
            <PulseLoader color="white" />
          </>
        ) : (
          <span>Checkout &nbsp; ({cartItems.length})</span>
        )}
      </button>
    </div>
  );
};

export default CartSummary;
