/* eslint-disable react-hooks/rules-of-hooks */
import { useCartStore } from "@/cart-store/useCartStore";
import ProductList from "@/components/store/store-shared/product-list";
import useFromStore from "@/hooks/useFromStore";
import { getProducts } from "@/queries/product";
import React from "react";

export default async function StoreHomePage() {
  const productsData = await getProducts();
  const products = Array.isArray(productsData)
    ? productsData
    : (productsData?.products ?? []);

  // const cart = useFromStore(useCartStore, (state) => state.cart);
  // const addToCart = useCartStore((state) => state.addToCart);

  return (
    <div className="p-14">
      <ProductList products={products} title="Products" arrow isShowVariant />
    </div>
  );
}
