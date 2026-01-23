import ProductDetails from "@/components/dashboard/forms/product-details";
import { getAllCategories } from "@/queries/category";

const SellerNewProductPage = async ({
  params,
}: {
  params: Promise<{ storeUrl: string }>;
}) => {
  const categories = await getAllCategories();
  const { storeUrl } = await params;

  console.log("storeUrl", storeUrl);
  return (
    <div className="w-full">
      <ProductDetails categories={categories} storeUrl={storeUrl} />
    </div>
  );
};

export default SellerNewProductPage;
