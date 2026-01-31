import DataTable from "@/components/ui/data-table";
import { getAllStoreProducts } from "@/queries/product";
import { columns } from "./columns";
import { Plus } from "lucide-react";
import ProductDetails from "@/components/dashboard/forms/product-details";
import { getAllCategories } from "@/queries/category";

const SellerProductPage = async ({
  params,
}: {
  params: Promise<{ storeUrl: string }>;
}) => {
  const { storeUrl } = await params;

  // Fetching products data from db for the active store
  const products = await getAllStoreProducts(storeUrl);
  const categories = await getAllCategories();

  // console.log('product', products)

  return (
    <DataTable
      heading="Products"
      searchPlaceholder="Search product"
      filterValue="name"
      data={products}
      actionButtonText={
        <>
          <Plus />
          Create new product
        </>
      }
      modalChildren={
        <ProductDetails categories={categories} storeUrl={storeUrl} />
      }
      columns={columns}
      newTabLink={`/dashboard/seller/stores/${storeUrl}/products/new`}
    />
  );
};

export default SellerProductPage;
