/* eslint-disable react-hooks/rules-of-hooks */
import { useCartStore } from "@/cart-store/useCartStore";
import CaegoriesHeader from "@/components/store/layout/categories-header/categories-header";
import Footer from "@/components/store/layout/footer/footer";
import Header from "@/components/store/layout/header/header";
import ProductList from "@/components/store/store-shared/product-list";
import useFromStore from "@/hooks/useFromStore";
import { getProducts } from "@/queries/product";
import React from "react";
import { Toaster } from "sonner";

export default async function StoreHomePage() {
  const productsData = await getProducts();
  const products = Array.isArray(productsData)
    ? productsData
    : (productsData?.products ?? []);

  // const cart = useFromStore(useCartStore, (state) => state.cart);
  // const addToCart = useCartStore((state) => state.addToCart);

  return (
    <div className="">
      <Header />
      <CaegoriesHeader />
      <div className="h-full p-14">
        <ProductList products={products} title="Products" arrow isShowVariant />
      </div>
      {/* Footer */}
      <div className="bg-red-200">
        <Footer />
        <Toaster position="top-center" />
      </div>
    </div>
  );
}
