import { ProductModelInput } from "./product-model";

export interface OfferTagModel {
  id?: string;
  name: string;
  url: string;
  products?: ProductModelInput[];
  created_at?: string;
  updated_at?: string;
}
