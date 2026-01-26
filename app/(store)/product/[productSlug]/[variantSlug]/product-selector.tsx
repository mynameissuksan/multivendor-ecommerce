"use client";

import { useState } from "react";
import { ShoppingCart, Share2, Check } from "lucide-react";

interface Color {
  id: string;
  name: string;
}

interface Size {
  id: string;
  size: string;
  quantity: number;
  price: string;
  discount: string;
}

interface ProductSelectorProps {
  colors: Color[];
  sizes: Size[];
  originalPrice: number;
  discount: number;
}

export default function ProductSelector({
  colors,
  sizes,
  originalPrice,
  discount,
}: ProductSelectorProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(
    colors[0]?.id || null,
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(
    sizes[0]?.id || null,
  );
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const finalPrice = originalPrice - discount;
  const selectedSizeData = sizes.find((s) => s.id === selectedSize);
  const maxQuantity = selectedSizeData?.quantity || 0;

  const handleAddToCart = async () => {
    if (!selectedColor || !selectedSize) {
      alert("Please select color and size");
      return;
    }

    setIsAddingToCart(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    setIsAddingToCart(false);
    setAddedToCart(true);

    // Reset after 2 seconds
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this product!",
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="space-y-6">
      {/* Price */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
        <div className="flex items-baseline space-x-3">
          <span className="text-5xl font-bold text-slate-900">
            ฿{(finalPrice * quantity).toFixed(2)}
          </span>
          {discount > 0 && (
            <>
              <span className="text-2xl text-slate-400 line-through">
                ฿{(originalPrice * quantity).toFixed(2)}
              </span>
              <span className="text-lg text-red-500 font-semibold">
                Save ฿{(discount * quantity).toFixed(2)}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Color Selection */}
      {colors.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-slate-900 text-lg">
            Available Colors
          </h3>
          <div className="flex flex-wrap gap-3">
            {colors.map((color) => (
              <button
                key={color.id}
                onClick={() => setSelectedColor(color.id)}
                className={`group relative transition-all duration-300 ${
                  selectedColor === color.id ? "scale-110" : ""
                }`}
                title={color.name}
              >
                <div
                  className={`w-12 h-12 rounded-full border-3 shadow-md transition-all duration-300 ${
                    selectedColor === color.id
                      ? "border-blue-500 ring-2 ring-blue-200 shadow-xl"
                      : "border-slate-200 hover:border-blue-300 hover:shadow-lg"
                  }`}
                  style={{ backgroundColor: color.name }}
                />
                {selectedColor === color.id && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check className="w-6 h-6 text-white drop-shadow-lg" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size Selection */}
      <div className="space-y-3">
        <h3 className="font-semibold text-slate-900 text-lg">Select Size</h3>
        <div className="flex flex-wrap gap-3">
          {sizes.map((sizeOption) => (
            <button
              key={sizeOption.id}
              onClick={() => setSelectedSize(sizeOption.id)}
              disabled={sizeOption.quantity === 0}
              className={`px-6 py-3 border-2 rounded-xl font-semibold transition-all duration-300 shadow-sm ${
                sizeOption.quantity === 0
                  ? "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
                  : selectedSize === sizeOption.id
                    ? "border-blue-500 bg-blue-50 text-blue-700 scale-105 shadow-md"
                    : "border-slate-200 text-slate-900 hover:border-blue-500 hover:bg-blue-50 hover:scale-105 hover:shadow-md"
              }`}
            >
              {sizeOption.size}
              {sizeOption.quantity === 0 && (
                <span className="block text-xs mt-0.5">Out of stock</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity Selector */}
      <div className="space-y-3">
        <h3 className="font-semibold text-slate-900 text-lg">Quantity</h3>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="w-12 h-12 bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 disabled:text-slate-300 rounded-xl font-bold text-xl transition-all duration-200 hover:scale-105 disabled:scale-100"
          >
            −
          </button>
          <span className="text-2xl font-bold text-slate-900 min-w-[3rem] text-center">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
            disabled={quantity >= maxQuantity}
            className="w-12 h-12 bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 disabled:text-slate-300 rounded-xl font-bold text-xl transition-all duration-200 hover:scale-105 disabled:scale-100"
          >
            +
          </button>
          <span className="text-sm text-slate-600">
            {maxQuantity} available
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4 pt-4">
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart || !selectedColor || !selectedSize}
          className={`flex-1 px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
            addedToCart
              ? "bg-green-500 text-white"
              : isAddingToCart
                ? "bg-slate-400 text-white cursor-wait"
                : !selectedColor || !selectedSize
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 hover:scale-105"
          }`}
        >
          {addedToCart ? (
            <>
              <Check className="w-6 h-6" />
              <span>Added to Cart!</span>
            </>
          ) : isAddingToCart ? (
            <>
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
              <span>Adding...</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-6 h-6" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
        <button
          onClick={handleShare}
          className="bg-white border-2 border-slate-200 p-4 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 hover:scale-105 shadow-md"
        >
          <Share2 className="w-6 h-6 text-slate-700" />
        </button>
      </div>
    </div>
  );
}
