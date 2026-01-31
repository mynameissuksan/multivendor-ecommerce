import { ProductModelInput } from "@/models/product-model";
import React from "react";
import ProductList from "../../store-shared/product-list";

const RelatesProducts = ({ products }: { products: ProductModelInput[] }) => {
  return (
    <div className="mt-4 space-y-1">
      <ProductList products={products} title="Related products" />
    </div>
  );
};

export default RelatesProducts;
