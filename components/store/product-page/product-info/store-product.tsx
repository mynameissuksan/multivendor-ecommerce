"use client";

import { ProductModelInput } from "@/models/product-model";
import { getProducts } from "@/queries/product";
import React, { useEffect, useState } from "react";
import ProductList from "../../store-shared/product-list";
interface Props {
  storeUrl: string;
  count: number;
  storeName: string;
}

const StoreProducts: React.FC<Props> = ({ storeUrl, count, storeName }) => {
  const [products, setProducts] = useState<ProductModelInput[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await getProducts({ storeUrl }, "", 1, count);
      if (res && res.products) {
        setProducts(res.products);
      }
    };
    fetchProducts();
  }, [storeUrl, count]);


  return (
    <div className="relative mt-6">
      <ProductList
        products={products}
        title={`Recommanded from ${storeName}`}
      />
    </div>
  );
};

export default StoreProducts;
