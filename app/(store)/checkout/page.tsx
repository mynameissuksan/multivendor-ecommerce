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

  const [cart] = await pool.query<CartModel[]>(
    "SELECT carts.*, cart_items.* FROM carts INNER JOIN cart_items ON carts.id = cart_items.cart_id WHERE carts.user_id = ? LIMIT 1",
    [user.id],
  );

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
          cart={cart}
          countries={countries as Country[]}
        />
      </div>
    </div>
  );
};

export default CheckoutPage;
