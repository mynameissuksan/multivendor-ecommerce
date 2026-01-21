import StoreDefaultShippingDetails from "@/components/dashboard/forms/store-default-shipping-details";
import DataTable from "@/components/ui/data-table";
import { StoreModelInput } from "@/models/store-model";
import {
  getStoreDefaultShippingDetails,
  getStoreShippingRates,
} from "@/queries/store";
import { redirect } from "next/navigation";
import React from "react";
import { columns } from "./columns";

const StoreShippingPage = async ({
  params,
}: {
  params: Promise<{ storeUrl: string }>;
}) => {
  const { storeUrl } = await params;
  const shippingDetails = (await getStoreDefaultShippingDetails(
    storeUrl
  )) as StoreModelInput;

  const shippingRates = await getStoreShippingRates(storeUrl);
  if (!shippingDetails || !shippingRates) return redirect("/");

  return (
    <div>
      <StoreDefaultShippingDetails data={shippingDetails} storeUrl={storeUrl} />
      <DataTable
        filterValue="countryName"
        data={shippingRates}
        searchPlaceholder="Search by country name..."
        columns={columns}
      />
    </div>
  );
};

export default StoreShippingPage;
