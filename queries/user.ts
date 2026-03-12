/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { pool } from "@/lib/config/db";
import { CartProductType } from "@/lib/types";
import { currentUser } from "@clerk/nextjs/server";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { getShippingDetails } from "./product";
import { StoreModelInput } from "@/models/store-model";
import {
  FreeShippingCountry,
  FreeShippingModel,
} from "@/models/shipping-model";
import { ShippingAddressModel } from "@/models/shipping-address";
import { Country } from "@/models/country-model";
import { CartModel } from "@/models/cart-model";

export const followStore = async (storeId: string) => {
  try {
    // Get the current user
    const user = await currentUser();

    if (!user) throw new Error("Unauthorized.");

    // Ensure the store exists
    const [store] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM stores WHERE id = ?",
      [storeId],
    );
    if (store.length === 0) throw new Error("Store not found");
    // check if the user exists
    const [userData] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM users where id = ? LIMIT 1",
      user.id,
    );
    if (userData.length === 0) throw new Error("User not found");

    // check if the user is already following the store
    const [userFollowingStore] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM follows WHERE user_id = ? AND store_id = ? LIMIT 1",
      [userData[0].id, storeId],
    );

    if (userFollowingStore.length !== 0) {
      // Unfollow
      await pool.query("DELETE FROM follows WHERE id = ? LIMIT 1", [
        userFollowingStore[0].id,
      ]);
      return false;
    } else {
      await pool.query(
        "INSERT INTO follows (user_id, store_id) VALUES (?, ?)",
        [userData[0].id, storeId],
      );
      return true;
    }
  } catch (error) {
    throw error;
  }
};

// save user cart
export const saveUserCart = async (
  cartProduct: CartProductType[],
): Promise<boolean> => {
  try {
    const user = await currentUser();

    if (!user) throw new Error("Unautorized");

    const userId = user.id;

    // search for existing user cart
    const [userCart] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM carts WHERE user_id = ? LIMIT 1",
      [userId],
    );

    // Delete any existing user cart
    if (userCart.length > 0) {
      await pool.query("DELETE FROM carts WHERE user_id = ?", [userId]);
    }

    // fetch product, variant and size data from the db for validation
    const validatedCartItems = await Promise.all(
      cartProduct.map(async (cartProduct) => {
        const { productId, variantId, sizeId, quantity } = cartProduct;

        // fetch the product, variant size from the db
        const [rows] = await pool.query<RowDataPacket[]>(
          `
        SELECT
          p.id  AS product_id,
          p.slug AS product_slug,
          p.name AS product_name,
          p.shipping_fee_method AS shipping_fee_method,

          s.id  AS store_id,
          s.return_policy,
          s.default_shipping_service,
          s.default_shipping_fee_per_kg,
          s.default_shipping_fee_per_item,
          s.default_shipping_fee_for_addional_item,
          s.default_shipping_fee_fixed,
          s.default_delivery_time_min,
          s.default_delivery_time_max,

          v.id  AS variant_id,
          v.slug AS variant_slug,
          v.sku AS sku,
          v.name AS variant_name,
          v.weight AS weight,

          z.id  AS size_id,
          z.quantity AS quantity,
          z.discount AS discount,
          z.price AS price,
          z.size AS size,

          i.id  AS image_id,
          i.url AS image_url,
          
          fs.id AS free_shipping_id
          
        FROM products p
        INNER JOIN stores s ON s.id = p.store_id
        INNER JOIN products_variant v ON v.product_id = p.id AND v.id = ?
        LEFT JOIN sizes z ON z.products_variant_id = v.id
        LEFT JOIN product_variant_images i ON i.products_variant_id = v.id
        LEFT JOIN free_shippings fs ON fs.product_id = p.id
        WHERE p.id = ?
  `,
          [variantId, productId],
        );

        const data = rows[0];

        const [freeShippingRow] = await pool.query<RowDataPacket[]>(
          "SELECT * FROM free_shipping_countries WHERE free_shipping_id = ?",
          [data["free_shipping_id"]],
        );

        const storesMap = {
          id: data["store_id"],
          return_policy: data["return_policy"],
          default_shipping_service: data["default_shipping_service"],
          default_shipping_fee_per_kg: data["default_shipping_fee_per_kg"],
          default_shipping_fee_per_item: data["default_shipping_fee_per_item"],
          default_shipping_fee_for_addional_item:
            data["default_shipping_fee_for_addional_item"],
          default_shipping_fee_fixed: data["default_shipping_fee_fixed"],
          default_delivery_time_min: data["default_delivery_time_min"],
          default_delivery_time_max: data["default_delivery_time_max"],
        } as StoreModelInput;

        const freeShipppingMap = {
          free_shipping_country: freeShippingRow as FreeShippingCountry[],
        } as FreeShippingModel;

        if (rows.length === 0 || data["size_id"] === null) {
          throw new Error(
            `Invalid product, variant, or size combiation for product id ${productId}, variant id ${variantId} size id ${sizeId}`,
          );
        }

        // Validate stock and price
        const validQty = Math.min(quantity, data["quantity"]);

        const price = data["discount"]
          ? Number(data["price"]) -
            Number(data["price"]) * (Number(data["discount"]) / 100)
          : Number(data["price"]);

        // calculate shipping details
        const countryCookie = await getCookie("userCountry", { cookies });
        let details = {
          shippingFee: 0,
          extraShippingFee: 0,
          isFreeShipping: false,
        };

        if (countryCookie) {
          const country = JSON.parse(countryCookie);
          const temp_details = await getShippingDetails(
            data["shipping_fee_method"],
            country,
            storesMap,
            freeShipppingMap,
          );

          if (typeof temp_details !== "boolean") {
            details = temp_details;
          }
        }

        let shippingFee = 0;
        const shippingFeeMethod = data["shipping_fee_method"];
        if (shippingFeeMethod === "ITEM") {
          shippingFee =
            quantity === 1
              ? details.shippingFee
              : Number(details.shippingFee) +
                Number(details.extraShippingFee) * Number(quantity - 1);
        } else if (shippingFeeMethod === "WEIGHT") {
          shippingFee =
            Number(details.shippingFee) *
            Number(data["weight"]) *
            Number(quantity);
        } else if (shippingFeeMethod === "FIXED") {
          shippingFee = details.shippingFee;
        }

        const totalPrice = price * validQty + shippingFee;

        return {
          productId,
          variantId,
          productSlug: data["product_slug"],
          variantSlug: data["variant_slug"],
          sizeId,
          storeId: data["store_id"],
          sku: data["sku"],
          name: `${data["product_name"]} - ${data["variant_name"]}`,
          images: data["image_url"],
          size: data["size"],
          quantity: validQty,
          price,
          shippingFee,
          totalPrice,
        };
      }),
    );

    // Recalculate the cart's total price and shipping fees
    const subTotal = validatedCartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    const shippingFees = validatedCartItems.reduce(
      (acc, item) => acc + item.shippingFee,
      0,
    );

    const total = Number(subTotal) + Number(shippingFees);

    // save the validated items to the cart in the db
    await pool.query<ResultSetHeader>(
      "INSERT INTO carts (user_id, shipping_fees, sub_total, total) VALUES (?, ?, ?, ?)",
      [userId, shippingFees, Number(subTotal), total],
    );

    const [cartId] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM carts WHERE user_id = ? LIMIT 1",
      [userId],
    );

    for (let i = 0; i < validatedCartItems.length; i++) {
      const item = validatedCartItems[i];

      await pool.query<ResultSetHeader>(
        `INSERT INTO cart_items (
            product_id, variant_id, size_id, product_slug,
            variant_slug, sku, name, image, size, price,
            quantity, shipping_fee, total_price, cart_id,
            store_id
      )  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.productId,
          item.variantId,
          item.sizeId,
          item.productSlug,
          item.variantSlug,
          item.sku,
          item.name,
          item.images,
          item.size,
          item.price,
          item.quantity,
          item.shippingFee,
          item.totalPrice,
          cartId[0]["id"],
          item.storeId,
        ],
      );
    }

    return true;
  } catch (error) {
    throw error;
  }
};

// get user shipping addresses
export const getUserShippingAddresses = async () => {
  try {
    const user = await currentUser();

    if (!user) throw new Error("Unautorized");

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT 
       pa.id as ship_adr_id,
       pa.*,
       c.*
       FROM shipping_address pa 
       INNER JOIN countries c ON pa.country_id = c.id 
       WHERE user_id = ?`,
      [user.id],
    );

    const shipping: ShippingAddressModel[] = rows.map((item) => ({
      id: item.ship_adr_id,
      first_name: item.first_name,
      last_name: item.last_name,

      phone: item.phone,
      address1: item.address1,
      address2: item.address2,
      state: item.state,
      city: item.city,
      zip_code: item.zip_code,
      country_id: item.country_id,
      country: {
        name: item.name,
        code: item.code,
      },
      user_id: item.user_id,
      addr_default: item.addr_default,
    }));

    return shipping;
  } catch (error) {
    throw error;
  }
};

export const upsertShippingAddresss = async (address: ShippingAddressModel) => {
  try {
    const user = await currentUser();

    if (!user) throw new Error("Unautorized.");

    if (!address) throw new Error("Please provide address data.");

    if (address.addr_default) {
      const [addressRows] = await pool.query<RowDataPacket[]>(
        "SELECT id FROM shipping_address WHERE id = ? LIMIT 1",
        [address.id],
      );

      if (addressRows.length > 0) {
        try {
          await pool.query<ResultSetHeader>(
            `UPDATE shipping_address 
             SET 
             updated_at = NOW(),
             addr_default = 0
             WHERE user_id = ? AND addr_default = 1`,
            [address.user_id],
          );
        } catch (error) {
          throw error;
        }
      }
    }

    if (address.id) {
      await pool.query<ResultSetHeader>(
        `UPDATE shipping_address 
             SET 
             first_name = ?, 
             last_name = ?, 
             phone = ?, 
             address1 = ?, 
             address2 = ?,
             state = ?, 
             city = ?, 
             zip_code = ?, 
             country_id = ?,
             updated_at = NOW(),
             addr_default = ?
             WHERE id = ?`,
        [
          address.first_name,
          address.last_name,
          address.phone,
          address.address1,
          address.address2,
          address.state,
          address.city,
          address.zip_code,
          address.country_id,
          address.addr_default,
          address.id,
        ],
      );
    } else {
      await pool.query<ResultSetHeader>(
        `INSERT INTO shipping_address
        (first_name,	
         last_name,
         phone,	
         address1,
         address2,	
         state,
         city,	
         addr_default,	
         zip_code,
         country_id,
         user_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          address.first_name,
          address.last_name,
          address.phone,
          address.address1,
          address.address2,
          address.state,
          address.city,
          address.addr_default,
          address.zip_code,
          address.country_id,
          user.id,
        ],
      );
    }
    return {
      ok: true,
    };
  } catch (error) {
    throw error;
  }
};

export const placeOrder = async (
  shippingAddress: ShippingAddressModel,
  cartId: string,
) => {
  const user = await currentUser();

  if (!user) throw new Error("Unautorized.");

  const [cartRows] = await pool.query<RowDataPacket[]>(
    `SELECT carts.*, cart_items.*
     FROM carts  
     INNER JOIN cart_items ON carts.id = cart_items.cart_id
     WHERE carts.id = ?`,
    [cartId],
  );

  const cart = cartRows as CartModel[];

  if (cartRows.length === 0) throw new Error("Cart not found");

  // fetch product, variant and size data from the db for validation
  const validatedCartItems = await Promise.all(
    cart.map(async (cartProduct) => {
      const { product_id, variant_id, size_id, quantity } = cartProduct;

      // fetch the product, variant size from the db
      const [rows] = await pool.query<RowDataPacket[]>(
        `
        SELECT
          p.id  AS product_id,
          p.slug AS product_slug,
          p.name AS product_name,
          p.shipping_fee_method AS shipping_fee_method,

          s.id  AS store_id,
          s.return_policy,
          s.default_shipping_service,
          s.default_shipping_fee_per_kg,
          s.default_shipping_fee_per_item,
          s.default_shipping_fee_for_addional_item,
          s.default_shipping_fee_fixed,
          s.default_delivery_time_min,
          s.default_delivery_time_max,

          v.id  AS variant_id,
          v.slug AS variant_slug,
          v.sku AS sku,
          v.name AS variant_name,
          v.weight AS weight,

          z.id  AS size_id,
          z.quantity AS quantity,
          z.discount AS discount,
          z.price AS price,
          z.size AS size,

          i.id  AS image_id,
          i.url AS image_url,
          
          fs.id AS free_shipping_id
          
        FROM products p
        INNER JOIN stores s ON s.id = p.store_id
        INNER JOIN products_variant v ON v.product_id = p.id AND v.id = ?
        LEFT JOIN sizes z ON z.products_variant_id = v.id
        LEFT JOIN product_variant_images i ON i.products_variant_id = v.id
        LEFT JOIN free_shippings fs ON fs.product_id = p.id
        WHERE p.id = ?
  `,
        [variant_id, product_id],
      );

      const data = rows[0];

      const [freeShippingRow] = await pool.query<RowDataPacket[]>(
        "SELECT * FROM free_shipping_countries WHERE free_shipping_id = ?",
        [data["free_shipping_id"]],
      );

      const storesMap = {
        id: data["store_id"],
        return_policy: data["return_policy"],
        default_shipping_service: data["default_shipping_service"],
        default_shipping_fee_per_kg: data["default_shipping_fee_per_kg"],
        default_shipping_fee_per_item: data["default_shipping_fee_per_item"],
        default_shipping_fee_for_addional_item:
          data["default_shipping_fee_for_addional_item"],
        default_shipping_fee_fixed: data["default_shipping_fee_fixed"],
        default_delivery_time_min: data["default_delivery_time_min"],
        default_delivery_time_max: data["default_delivery_time_max"],
      } as StoreModelInput;

      const freeShipppingMap = {
        free_shipping_country: freeShippingRow as FreeShippingCountry[],
      } as FreeShippingModel;

      if (rows.length === 0 || data["size_id"] === null) {
        throw new Error(
          `Invalid product, variant, or size combiation for product id ${product_id}, variant id ${variant_id} size id ${size_id}`,
        );
      }

      // Validate stock and price
      const validQty = Math.min(quantity, data["quantity"]);

      const price = data["discount"]
        ? Number(data["price"]) -
          Number(data["price"]) * (Number(data["discount"]) / 100)
        : Number(data["price"]);

      // calculate shipping details
      const countryId = shippingAddress.country_id;

      const [temp_country] = await pool.query<RowDataPacket[]>(
        "SELECT id FROM countries WHERE id = ? LIMIT 1",
        [countryId],
      );

      if (temp_country.length === 0)
        throw new Error("Failded  to get shipping details for order");

      let details = {
        shippingFee: 0,
        extraShippingFee: 0,
        isFreeShipping: false,
      };

      const country = {
        name: temp_country[0].name,
        code: temp_country[0].code,
        city: "",
      };

      if (country) {
        const temp_details = await getShippingDetails(
          data["shipping_fee_method"],
          country,
          storesMap,
          freeShipppingMap,
        );

        if (typeof temp_details !== "boolean") {
          details = temp_details;
        }
      }

      let shippingFee = 0;
      const shippingFeeMethod = data["shipping_fee_method"];
      if (shippingFeeMethod === "ITEM") {
        shippingFee =
          quantity === 1
            ? details.shippingFee
            : Number(details.shippingFee) +
              Number(details.extraShippingFee) * Number(quantity - 1);
      } else if (shippingFeeMethod === "WEIGHT") {
        shippingFee =
          Number(details.shippingFee) *
          Number(data["weight"]) *
          Number(quantity);
      } else if (shippingFeeMethod === "FIXED") {
        shippingFee = details.shippingFee;
      }

      const totalPrice = price * validQty + shippingFee;

      return {
        productId: product_id,
        variantId: variant_id,
        productSlug: data["product_slug"],
        variantSlug: data["variant_slug"],
        sizeId: size_id,
        storeId: data["store_id"],
        sku: data["sku"],
        name: `${data["product_name"]} - ${data["variant_name"]}`,
        images: data["image_url"],
        size: data["size"],
        quantity: validQty,
        price,
        shippingFee,
        totalPrice,
      };
    }),
  );

  console.log("validate", validatedCartItems);
};
