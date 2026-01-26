import { pool } from "@/lib/config/db";
import { getProductBySlug } from "@/queries/product";
import { redirect } from "next/navigation";

const ProductPage = async ({
  params,
}: {
  params: Promise<{ productSlug: string }>;
}) => {
  const { productSlug } = await params;

  const product = await getProductBySlug(productSlug);

  // if the prodouct is not found redirect to hte homepage
  if (!product) {
    return redirect("/");
  }

  // if the prodcut has no variants ,redirect to the homepage
  if (product?.product_varian.length === 0) {
    return redirect("/");
  }


  // if the product existing and has variants, redirect to the first variant page
  return redirect(`/product/${product.slug}/${product.product_varian[0]?.slug}`);
};

export default ProductPage;
