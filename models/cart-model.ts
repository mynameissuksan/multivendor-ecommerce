import { RowDataPacket } from "mysql2";

export interface CartModel extends RowDataPacket {
  id: string;
  user_id: string;
  shipping_fees: number;
  total: number;
  sub_total: number;
  created_at: string;
  updated_at: string;
  cart_items: CartItemModel[];
}

export interface CartItemModel {
  id: string;
  product_id: string;
  variant_id: string;
  size_id: string;
  product_slug: string;
  variant_slug: string;
  sku: string;
  name: string;
  image: string;
  size: string;
  updated_at: string;
  price: number;
  quantity: number;
  shipping_fee: number;
  total_price: number;
  cart_id: string;
  store_id: string;
  created_at: string;
}
