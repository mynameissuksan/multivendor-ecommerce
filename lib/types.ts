import COUNTRIES from "@/data/countries.json";
import { getProductPageData, getShippingDetails } from "@/queries/product";

export interface DashboardSidebarMenuInterface {
  label: string;
  icon: string;
  link: string;
}

export type SelectMenuOption = (typeof COUNTRIES)[number];

export type ProductPageDataType = Awaited<
  ReturnType<typeof getProductPageData>
>;

export type CartProductType = {
  productId: string;
  variantId: string;
  productSlug: string;
  variantSlug: string;
  name: string;
  images: string;
  variantImage: string;
  sizeId: string;
  size: string;
  quantity: number;
  price: number;
  stock: number;
  weight: number;
  shippingMethod: string;
  variantName: string;
  shippingService: string;
  shippingFee: number;
  extraShippingFee: number;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  freeShipping: boolean;
};
