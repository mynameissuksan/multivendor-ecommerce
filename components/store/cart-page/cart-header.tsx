import { useCartStore } from "@/cart-store/useCartStore";
import { CartProductType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import React, { Dispatch, SetStateAction } from "react";

interface Props {
  cartItems: CartProductType[];
  selectedItems: CartProductType[];
  setSelectedItems: Dispatch<SetStateAction<CartProductType[]>>;
}

const CartHeader: React.FC<Props> = ({
  cartItems,
  selectedItems,
  setSelectedItems,
}) => {
  const removeMultipleFromCart = useCartStore(
    (state) => state.removeMultipleFromCart,
  );
  const cartLength = cartItems.length;
  const selectedLength = selectedItems.length;

  const handleSelectAll = () => {
    const areAllSelected = cartItems.every((item) =>
      selectedItems.some(
        (selected) =>
          selected.variantId === item.variantId &&
          selected.sizeId === item.sizeId &&
          selected.productId === item.productId,
      ),
    );

    if (areAllSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems);
    }
  };

  const removeSelectedFromCart = () => {
    removeMultipleFromCart(selectedItems);

    // Remove the selected items from both cart and selected items
    setSelectedItems((prev) =>
      prev.filter(
        (selected) =>
          !cartItems.some(
            (item) =>
              item.variantId === selected.variantId &&
              item.sizeId === selected.sizeId &&
              item.productId === selected.productId,
          ),
      ),
    );
  };

  return (
    <div className="bg-white py-4">
      <div>
        <div className="px-6 bg-white">
          <div className="flex items-center text-[#222] font-bold text-2xl">
            <h1>Cart ({cartLength})</h1>
          </div>
          <div className="flex justify-between bg-white pt-4 px-6">
            <div className="flex items-center justify-start w-full">
              <label
                onClick={() => handleSelectAll()}
                htmlFor=""
                className="p-0 text-gray-900 text-sm leading-6 list-none inline-flex items-center m-0 mr-2 cursor-pointer align-middle"
              >
                <span className="leading-8 inline-flex p-0.5 cursor-pointer">
                  <span
                    className={cn(
                      "leading-8 w-5 h-5 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:border-orange-500",
                      {
                        "border-orange-500":
                          cartLength > 0 && selectedLength === cartLength,
                      },
                    )}
                  >
                    {cartLength > 0 && selectedLength === cartLength && (
                      <span className="bg-orange-500  w-5 h-5 rounded-full flex items-center justify-center">
                        <Check className="w-3.5 text-white mt-0.5" />
                      </span>
                    )}
                  </span>
                </span>
                <span className="leading-8 px-2 select-none">
                  Select all products
                </span>
              </label>
              {selectedLength > 0 && (
                <div
                  onClick={() => removeSelectedFromCart()}
                  className="pl-4 border-l border-l-[#ebebeb] cursor-pointer"
                >
                  <div className="text-[#3170ee] font-semibold text-sm leading-5">
                    Delete all selected products
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartHeader;
