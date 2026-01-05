import { CategoryInput } from "./category-model";
import { StoreModelInput } from "./store-model";
import { SubCategoryInput } from "./sub-category-model";

export interface ProductModelInput {
  id?: string;
  stores?: StoreModelInput;
  categories?: CategoryInput;
  product_varian: ProductVariantModelInput[];
  sub_categories?: SubCategoryInput;
  name: string;
  description?: string;
  slug: string;
  brand: string;
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface ProductVariantModelInput {
  id?: string;
  sizes?: ProductSizeModelInput[];
  colors?: ProductColorsModelInput[];
  images?: ProductVariantImagesModelInput[];
  name?: string;
  description?: string;
  slug?: string;
  keywords?: string[];
  is_sale: boolean;
  sku?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductSizeModelInput {
  id?: string;
  name: string;
  product_variant_images: ProductVariantImagesModelInput[];
  size: string;
  quantity: number;
  price: number;
  discount: number;
  created_at: string;
  udpated_at: string;
}

export interface ProductVariantImagesModelInput {
  id: string;
  url?: string;
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
