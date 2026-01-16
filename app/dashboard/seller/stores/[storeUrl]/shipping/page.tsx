import StoreDefaultShippingDetails from "@/components/dashboard/forms/store-default-shipping-details";
import { StoreModelInput } from "@/models/store-model";
import { getStoreDefaultShippingDetails } from "@/queries/store";
import React from "react";

const StoreShippingPage = async ({
  params,
}: {
  params: Promise<{ storeUrl: string }>;
}) => {
  const { storeUrl } = await params;
  const shippingDetails = (await getStoreDefaultShippingDetails(
    storeUrl
  )) as StoreModelInput;

  return (
    <StoreDefaultShippingDetails data={shippingDetails} storeUrl={storeUrl} />
  );
};

export default StoreShippingPage;
