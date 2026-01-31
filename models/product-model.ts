import { CategoryInput } from "./category-model";
import { FreeShippingModel } from "./shipping-model";
import { StoreModelInput } from "./store-model";
import { SubCategoryInput } from "./sub-category-model";

export interface ProductModelInput {
  id?: string;
  stores?: StoreModelInput;
  categories?: CategoryInput;
  product_varian: ProductVariantModelInput[];
  product_specs?: ProductSpecsModel[];
  questions?: QuestionsModel[];
  free_shipping?: FreeShippingModel;
  sub_categories?: SubCategoryInput;
  name: string;
  description?: string;

  shipping_fee_method?: string;
  slug?: string;
  brand: string;
  rating?: number;
  sales?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProductVariantModelInput {
  id?: string;
  sizes?: ProductSizeModelInput[];
  colors?: ProductColorsModelInput[];
  images: ProductVariantImagesModelInput[];
  product_id?: string;
  variant_specs?: VariantSpecsModel[];
  weight?: number;
  name: string;
  variant_image?: string;
  description?: string;
  slug?: string;
  keywords?: string[];
  is_sale?: boolean;
  sale_end_date?: string;
  url?: string;
  sku?: string;
  sales?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProductSizeModelInput {
  id?: string;
  product_variant_images?: ProductVariantImagesModelInput[];
  size: string;
  quantity: number;
  price: number;
  discount: number;
  created_at?: string;
  udpated_at?: string;
}

export interface ProductVariantImagesModelInput {
  id?: string;
  url: string;
  alt?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductColorsModelInput {
  id?: string;
  name?: string;
  alt?: string;
  products_variant_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductSpecsModel {
  id?: string;
  name: string;
  value: string;
}

export interface VariantSpecsModel {
  id?: string;
  name: string;
  value: string;
}

export interface QuestionsModel {
  id?: string;
  question: string;
  answer: string;
}
