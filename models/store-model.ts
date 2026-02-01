import { ResultSetHeader, RowDataPacket } from "mysql2";
import { FollowModelInput } from "./follow-model";

export interface StoreModelInput {
  id?: string;
  user_id?: string;
  follows?: FollowModelInput[];
  name?: string;
  description?: string;
  email?: string;
  phone?: string;
  url?: string;
  cover?: string;
  logo?: string;
  status?: string;
  average_rating?: number;
  featured?: boolean;
  return_policy?: string;
  default_shipping_service?: string;
  default_shipping_fees?: number;
  default_delivery_time_min?: number;
  default_delivery_time_max?: number;
  default_shipping_fee_per_item?: number;
  default_shipping_fee_for_addional_item?: number;
  default_shipping_fee_per_kg?: number;
  default_shipping_fee_fixed?: number;
  created_at?: string;
  updated_at?: string;
}

export interface StoreModel extends RowDataPacket {
  id: string;
  user_id: string;
  name: string;
  description: string;
  email: string;
  phone: string;
  url: string;
  cover: string;
  logo: string;
  status: string;
  average_rating: number;
  featured: boolean;
  return_policy: string;
  default_shipping_service: string;
  default_shipping_fees: string;
  default_delivery_time_min: number;
  default_delivery_time_max: number;
  created_at: string;
  updated_at: string;
}

export interface StoreResultModel extends ResultSetHeader {
  id: string;
  user_id: string;
  name: string;
  description: string;
  email: string;
  phone: string;
  url: string;
  cover: string;
  logo: string;
  status: string;
  average_rating: number;
  featured: boolean;
  return_policy: string;
  default_shipping_service: string;
  default_shipping_fees: string;
  default_delivery_time_min: number;
  default_delivery_time_max: number;
  created_at: string;
  updated_at: string;
}

// export interface NestedProductStoreModel {
//   store: StoreModelInput;
//   product: ProductModelInput[];
//   sub_category: SubCategoryInput[];
//   category: CategoryInput[];

// }
