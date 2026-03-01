/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCartStore } from "@/cart-store/useCartStore";
import useFromStore from "@/hooks/useFromStore";
import { CartProductType } from "@/lib/types";
import { ProductSizeModelInput } from "@/models/product-model";
import { Minus, Plus } from "lucide-react";
import React, { useEffect, useMemo } from "react";

interface Props {
  productId: string;
  variantId: string;
  sizeId: string | null;
  quantity: number;
  handleChange: (property: keyof CartProductType, value: any) => void;
  sizes: ProductSizeModelInput[];
  stock: number;
}

const QuantitySelector: React.FC<Props> = ({
  productId,
  variantId,
  sizeId,
  sizes,
  quantity,
  handleChange,
  stock,
}) => {
  // Get cart product if it exists in cart , the get added quantity
  const cart = useFromStore(useCartStore, (state) => state.cart);

  useEffect(() => {
    handleChange("quantity", 1);
  }, [handleChange, sizeId]);

  const maxQty = useMemo(() => {
    const search_product = cart?.find(
      (p) =>
        p.productId === productId &&
        p.variantId === variantId &&
        p.sizeId === sizeId,
    );
    return search_product
      ? search_product.stock - search_product.quantity
      : stock;
  }, [cart, productId, variantId, sizeId, stock]);

  // console.log("maxQty", maxQty);

  // If no sizeId is provided, return null to prevent redering the component
  if (!sizeId) return null;

  const handleIncrease = () => {
    if (quantity < maxQty) {
      handleChange("quantity", quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      handleChange("quantity", quantity - 1);
    }
  };

  return (
    <div className="w-full py-2 px-3 bg-white border border-gray-200 rounded-lg">
      <div className="w-full flex justify-between items-center gap-x-5">
        <div className="grow">
          <span className="block text-xs text-gray-500">Select quantity</span>
          <span className="block text-xs text-gray-500">
            {maxQty !== stock &&
              `(You already have ${stock - maxQty} pieces of this product in cart)`}
          </span>
          <input
            type="number"
            className="w-full p-0 bg-transparent border-0 focus:outline-0 text-gray-800"
            min={1}
            max={maxQty}
            value={maxQty <= 0 ? 0 : quantity}
            readOnly
          />
        </div>
        <div className="flex justify-end items-center gap-x-1.5">
          <button
            disabled={quantity === 1}
            className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 gb-white shadow-sm focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
          >
            <Minus onClick={handleDecrease} className="w-3" />
          </button>
          <button
            disabled={quantity === stock}
            className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 gb-white shadow-sm focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
          >
            <Plus onClick={handleIncrease} className="w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuantitySelector;
