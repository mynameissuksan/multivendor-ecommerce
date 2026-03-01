"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { CartProductType, ProductPageDataType } from "@/lib/types";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import ProductSwiper from "./product-info/product-swiper";
import ProductInfo from "./product-info/product-info";
import ShipTo from "./shipping/ship-to";
import ShippingDetails from "./shipping/shipping-details";
import ReturnsPrivacySecurityCard from "./shipping/returns-security-privacy-card";
import { cn, isProductValidToCart } from "@/lib/utils";
import QuantitySelector from "./product-info/quantity-selector";
import SocialShare from "../store-shared/social-share";
import { useCartStore } from "@/cart-store/useCartStore";
import { toast } from "sonner";
import useFromStore from "@/hooks/useFromStore";

interface Props {
  productData: ProductPageDataType;

  variantSlug: string;
  sizeId: string | undefined;
  children: ReactNode;
}

const ProductPageContainer: React.FC<Props> = ({
  productData,
  sizeId,
  children,
  variantSlug,
}) => {
  // if there is no product data available, render nothing null
  if (!productData) return null;

  const variants = productData.products[0]?.product_varian.find(
    (v) => v.slug === variantSlug,
  );

  if (!variants) return null;

  const { shippingDetails } = productData;

  if (typeof shippingDetails === "boolean") return null;

  // console.log("variant ", variants?.weight);
  // console.log("slug", variantSlug);

  const product = productData?.products[0];
  const variant = product?.product_varian[0];
  const image = variant.images[0];

  const data: CartProductType = {
    productId: product.id!,
    variantId: variant.id!,
    productSlug: product.slug!,
    variantSlug: variant.slug!,
    variantName: variant.name,
    name: product.name,
    images: image.url,
    variantImage: variant.variant_image!,
    sizeId: sizeId || "",
    size: "",
    quantity: 1,
    price: 0,
    stock: 1,
    weight: variant.weight!,
    shippingMethod: productData.shippingFeeMethod,
    shippingService: shippingDetails.shippingService,
    shippingFee: shippingDetails.shippingFee,
    extraShippingFee: shippingDetails.extraShippingFee,
    deliveryTimeMin: shippingDetails.deliveryTimeMin,
    deliveryTimeMax: shippingDetails.deliveryTimeMax,
    freeShipping: shippingDetails.isFreeShipping,
  };

  const [productToBeAddedToCart, setProductToBeAddedToCart] =
    useState<CartProductType>(data);

  // useState hook to manage product validity to be added to cart
  const [isProductValid, setIsProductValid] = useState<boolean>(false);

  // function to handle state changes for the product properties
  const handleChange = useCallback(
    (property: keyof CartProductType, value: any) => {
      setProductToBeAddedToCart((prev) => ({
        ...prev,
        [property]: value,
      }));
    },
    [],
  );

  useEffect(() => {
    const check = isProductValidToCart(productToBeAddedToCart);
    setIsProductValid(check);
  }, [productToBeAddedToCart]);

  // console.log(
  //   "stock ---->",
  //   productToBeAddedToCart.stock,
  //   productToBeAddedToCart.quantity,
  // );

  // get the store action to add items to cart
  const addToCart = useCartStore((state) => state.addToCart);

  const cartItems = useFromStore(useCartStore, (state) => state.cart);

  console.log("cartItem ", cartItems);

  const handleAddToCart = () => {
    if (maxQty <= 0) return;

    addToCart(productToBeAddedToCart);
    toast.success("Product added to cart!");
  };

  const maxQty = useMemo(() => {
    const search_product = cartItems?.find(
      (p) =>
        p.productId === product.id &&
        p.variantId === variant.id &&
        p.sizeId === sizeId,
    );
    return search_product
      ? search_product.stock - search_product.quantity
      : productToBeAddedToCart.stock;
  }, [cartItems, productToBeAddedToCart.stock, product.id, variant.id, sizeId]);

  return (
    <div className="relative">
      <div className="w-full xl:flex xl:gap-4">
        {/* Product image swiper */}
        <ProductSwiper images={variants!.images} />
        <div className="w-full mt-4 md:mt-0 flex flex-col gap-4 md:flex-row">
          {/* Product main info */}
          <ProductInfo
            handleChange={handleChange}
            productData={productData}
            sizeId={sizeId}
            quantity={1}
            variantSlug={variantSlug}
          />
          {/* Shipping details - buy actions buttons */}
          <div className="w-97.5">
            <div className="z-20">
              <div className="bg-white border rounded-md overflow-hidden overflow-y-auto p-4 pb-0">
                {/* Ship to */}
                {typeof shippingDetails != "boolean" && (
                  <>
                    <ShipTo
                      countryName={shippingDetails.countryName}
                      countryCode={shippingDetails.countryCode}
                      city={shippingDetails.city}
                    />
                    <div className="mt-3 space-y-3">
                      <ShippingDetails
                        shippingDetails={productData}
                        weight={variants.weight!}
                        quantity={1}
                      />
                    </div>
                    {/*  Return Policy card */}
                    <ReturnsPrivacySecurityCard
                      returnPolicy={shippingDetails.returnPolicy}
                    />
                  </>
                )}

                {/* Action buttons */}
                <div className="mt-5 bg-white bottom-0 pb-4 space-y-3 sticky">
                  {/* Qty selector */}
                  {sizeId && (
                    <div className="w-full flex justify-end mt-4">
                      <QuantitySelector
                        productId={productToBeAddedToCart.productId}
                        variantId={productToBeAddedToCart.variantId}
                        sizeId={productToBeAddedToCart.sizeId}
                        quantity={productToBeAddedToCart.quantity}
                        handleChange={handleChange}
                        sizes={variant.sizes!}
                        stock={productToBeAddedToCart.stock}
                      />
                    </div>
                  )}
                  {/* Action buttons */}

                  <button
                    disabled={!isProductValid}
                    className="relative w-full py-2.5 min-w-20 bg-orange-600 text-white hover:bg-orange-500 h-11 rounded-3xl leading-6 inline-block font-bold whitespace-normal border border-white cursor-pointer transition-all duration-300 ease-in select-none"
                  >
                    <span>Buy now</span>
                  </button>
                  <button
                    onClick={() => handleAddToCart()}
                    className={cn(
                      "relative w-full py-2.5 min-w-20 bg-orange-300 text-white hover:bg-orange-200 h-11 rounded-3xl leading-6 inline-block font-bold whitespace-normal border border-white cursor-pointer transition-all duration-300 ease-in select-none",
                      {
                        "cursor-not-allowed ": !isProductValid || maxQty <= 0,
                      },
                    )}
                  >
                    <span>Add to cart</span>
                  </button>

                  {/* Share to social */}
                  <SocialShare
                    url={`/product/${product.slug}/${variant.slug}`}
                    quote={`${product.name} - ${variant.name}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full mt-6 pb-16 ">{children}</div>
    </div>
  );
};

export default ProductPageContainer;
