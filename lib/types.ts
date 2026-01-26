import COUNTRIES from "@/data/countries.json";
import { getProductPageData } from "@/queries/product";

export interface DashboardSidebarMenuInterface {
  label: string;
  icon: string;
  link: string;
}

export type SelectMenuOption = (typeof COUNTRIES)[number];

export type ProductPageDataType = Awaited<
  ReturnType<typeof getProductPageData>
>;
