import CheckoutContainer from "@/components/store/checkout/container";
import { pool } from "@/lib/config/db";
import { CartModel } from "@/models/cart-model";
import { Country } from "@/models/country-model";
import { getUserShippingAddresses } from "@/queries/user";
import { currentUser } from "@clerk/nextjs/server";
import { RowDataPacket } from "mysql2";
import { redirect } from "next/navigation";
import React from "react";

const CheckoutPage = async () => {
  const user = await currentUser();
  if (!user) redirect("/cart");

  const [cartRows] = await pool.query<RowDataPacket[]>(
    `SELECT carts.*, 
      carts.id as cart_id,
      carts.user_id as user_id,
      carts.shipping_fees as shipping_fees,
      carts.sub_total as sub_total,
      carts.total as total,
     
      cart_items.id as cart_item_id,
      cart_items.product_id,
      cart_items.variant_id,
      cart_items.size_id,
      cart_items.product_slug,
      cart_items.variant_slug,
      cart_items.sku,
      cart_items.name,
      cart_items.image,
      cart_items.size,
      cart_items.price,
      cart_items.quantity,
      cart_items.shipping_fee,
      cart_items.total_price,
      cart_items.cart_id,
      cart_items.store_id
     FROM carts INNER JOIN cart_items ON carts.id = cart_items.cart_id 
     WHERE carts.user_id = ?`,
    [user.id],
  );

  const cart = cartRows[0];

  const formatCart = {
    id: cart.cart_id,
    user_id: cart.user_id,
    total: cart.total,
    shipping_fees: cart.shipping_fees,
    sub_total: cart.sub_total,

    cart_items: cartRows.map((item) => {
      return {
        id: item.cart_item_id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        size_id: item.size_id,
        product_slug: item.product_slug,
        variant_slug: item.variant_slug,
        sku: item.sku,
        name: item.name,
        image: item.image,
        size: item.size,
        price: item.price,
        quantity: item.quantity,
        shipping_fee: item.shipping_fee,
        total_price: item.total_price,
        cart_id: item.cart_id,
        store_id: item.store_id,
      };
    }),
  } as CartModel;

  if (cart.length === 0) return redirect("/cart");

  const [countries] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM countries ORDER BY name DESC",
  );

  // get user shipping address
  const address = await getUserShippingAddresses();

  return (
    <div className="bg-[#f4f4f4] min-h-screen">
      <div className="max-w-300 mx-auto py-5 px-2">
        <CheckoutContainer
          addresses={address}
          cart={formatCart}
          countries={countries as Country[]}
        />
      </div>
    </div>
  );
};

export default CheckoutPage;
