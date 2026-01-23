import ProductList from "@/components/store/store-shared/product-list";
import { getProducts } from "@/queries/product";
import { UserButton } from "@clerk/nextjs";
import React from "react";

const StoreHomePage = async () => {
  const productsData = await getProducts();
  const { products } = productsData;
  return (
    <div className="p-14">
      <ProductList products={products} title="Products" arrow />
    </div>
  );
};

export default StoreHomePage;
