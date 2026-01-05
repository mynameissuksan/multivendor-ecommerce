import StoreDetails from "@/components/dashboard/forms/store-details";
import { getStoreByUrl } from "@/queries/store";
import { redirect } from "next/navigation";

const SellerStoreSettingPage = async ({
  params,
}: {
  params: Promise<{ storeUrl: string }>;
}) => {
  const storeDetails = await getStoreByUrl((await params).storeUrl);

  if (!storeDetails) redirect("/dashboard/seller/stores");

  return (
    <div>
      <StoreDetails data={storeDetails} />
    </div>
  );
};

export default SellerStoreSettingPage;
