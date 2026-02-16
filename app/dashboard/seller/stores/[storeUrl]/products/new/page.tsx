import ProductDetails from "@/components/dashboard/forms/product-details";
import { pool } from "@/lib/config/db";
import { Country } from "@/models/country-model";
import { getAllCategories } from "@/queries/category";
import { RowDataPacket } from "mysql2";

const SellerNewProductPage = async ({
  params,
}: {
  params: Promise<{ storeUrl: string }>;
}) => {
  const categories = await getAllCategories();
  const { storeUrl } = await params;

  // get offer

  const [countries] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM countries ORDER BY name DESC",
  );

  console.log("storeUrl", storeUrl);
  return (
    <div className="w-full">
      <ProductDetails
        categories={categories}
        storeUrl={storeUrl}
        countries={countries as Country[]}
      />
    </div>
  );
};

export default SellerNewProductPage;
