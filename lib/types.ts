import COUNTRIES from "@/data/countries.json";
import {
} from "@/models/product-model";
import { getProductPageData, getRatingStatistics } from "@/queries/product";

export interface DashboardSidebarMenuInterface {
  label: string;
  icon: string;
  link: string;
}

export type SelectMenuOption = (typeof COUNTRIES)[number];

export type ProductPageDataType = Awaited<
  ReturnType<typeof getProductPageData>
>;

export type RatingStatisticsType = Awaited<
  ReturnType<typeof getRatingStatistics>
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

// define a local sortOrder type
export type SortOrder = "asc" | "desc";

export type ReviewFilterType = {
  rating?: number;
  hasImages?: boolean;
};

export type ReviewOrderType = {
  orderBy: "latest" | "oldest" | "highest";
};

export type ReviewDetailsType = {
  id?: string;
  review: string;
  rating: number;
  images: { url: string }[];
  size: string;
  quantity: number;
  variant: string;
  color: string;
};

// export type VariantInfoType = {
//   variantName: string;
//   variantSlug: string;
//   variantImage: string;
//   variantUrl: string;
//   images: ProductVariantImagesModelInput[];
//   sizes: ProductSizeModelInput[];
//   colors: Partial<ProductColorsModelInput>[];
// };
