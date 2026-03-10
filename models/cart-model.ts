import { RowDataPacket } from "mysql2";

export interface CartModel extends RowDataPacket {
  id: string;
  user_id: string;
  shipping_fees: string;
  sub_total: string;
  total: string;
  created_at: string;
  updated_at: string;
  product_id: string;
  variant_id: string;
  size_id: string;
  product_slug: string;
  variant_slug: string;
  sku: string;
  name: string;
  image: string;
  size: string;
  price: string;
  quantity: number;
  shipping_fee: string;
  total_price: string;
  cart_id: string;
  store_id: string;
}

interface CartItemModel {
  id: string;
}
