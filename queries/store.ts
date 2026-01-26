"use server";

import { pool } from "@/lib/config/db";
import {
  StoreModel,
  StoreModelInput,
  StoreResultModel,
} from "@/models/store-model";
import { currentUser } from "@clerk/nextjs/server";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { permissionSeller } from "./permission";
import { CountryWithShippingRateModel } from "@/models/shipping-model";

export const getAllStoreByUserId = async (userId: string) => {
  const [rows] = await pool.query<StoreModel[]>(
    "SELECT * FROM stores WHERE user_id = ?",
    [userId],
  );

  return rows;
};

export const upsertStore = async (store: StoreModelInput) => {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized!");
    if (user.privateMetadata.role !== "SELLER") {
      throw new Error("Unauthorized Access");
    }
    if (!store) throw new Error("Please provide store data.");

    // ตรวจสอบข้อมูลซ้ำ ยกเว้น record ตัวเองตอน update
    const [rows] = await conn.query<StoreModel[]>(
      `
      SELECT id, name, email, phone, url
      FROM stores
      WHERE (name = ? OR email = ? OR phone = ? OR url = ?)
        AND (? IS NULL OR id != ?)
      LIMIT 1
      `,
      [
        store.name,
        store.email,
        store.phone,
        store.url,
        store.id ?? null,
        store.id ?? null,
      ],
    );

    if (rows.length > 0) {
      const existingStore = rows[0];
      if (existingStore.name === store.name)
        throw new Error("A store with the same name already exists.");
      if (existingStore.email === store.email)
        throw new Error("A store with the same email already exists.");
      if (existingStore.phone === store.phone)
        throw new Error("A store with the same phone number already exists.");

      if (existingStore.url === store.url)
        throw new Error("A store with the same url already exists.");
    }

    // Update
    if (store.id) {
      await conn.query<StoreResultModel>(
        `
        UPDATE stores
        SET
          name = ?,
          description = ?,
          email = ?,
          phone = ?,
          url = ?,
          cover = ?,
          logo = ?,
          status = ?,
          featured = ?,
          return_policy = ?,
          default_shipping_service = ?,
          default_shipping_fees = ?,
          default_delivery_time_min = ?,
          default_delivery_time_max = ?,
          updated_at = NOW()
        WHERE id = ? 
        `,
        [
          store.name,
          store.description,
          store.email,
          store.phone,
          store.url,
          store.cover,
          store.logo,
          store.status,
          store.featured,
          store.return_policy,
          store.default_shipping_service,
          store.default_shipping_fees,
          store.default_delivery_time_min,
          store.default_delivery_time_max,
          store.id,
        ],
      );

      return { message: "Store updated successfully", status: true };
    }

    // Insert
    const [result] = await conn.query<StoreResultModel>(
      `
      INSERT INTO stores (
        user_id,
        name,
        description,
        email,
        phone,
        url,
        cover,
        logo,
        featured,
        return_policy,
        default_shipping_service,
        default_shipping_fees,
        default_delivery_time_min,
        default_delivery_time_max,
        created_at,
        updated_at
      )
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?, NOW(), NOW())
      `,
      [
        store.user_id,
        store.name,
        store.description,
        store.email,
        store.phone,
        store.url,
        store.cover,
        store.logo,
        store.featured,
        store.return_policy,
        store.default_shipping_service,
        store.default_shipping_fees,
        store.default_delivery_time_min,
        store.default_delivery_time_max,
      ],
    );
    await conn.commit();
    return {
      message: "Store created successfully",
      storeId: result.insertId,
    };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

export const getStoreByUrl = async (url: string) => {
  const [storeDetails] = await pool.query<StoreModel[]>(
    "SELECT * FROM stores WHERE url = ? LIMIT 1",
    [url],
  );

  return storeDetails[0];
};

// fetches the default shipping details for a store based on the store URL.
export const getStoreDefaultShippingDetails = async (storeUrl: string) => {
  // Ensure the store URL is provide
  if (!storeUrl) {
    throw new Error("Store URL is required.");
  }

  try {
    const [store] = await pool.query<(StoreModelInput & RowDataPacket)[]>(
      `SELECT 

      default_shipping_service, 
      default_delivery_time_min, 
      default_delivery_time_max, 
      default_shipping_fee_per_item, 
      default_shipping_fee_for_addional_item,
      default_shipping_fee_per_kg,
      default_shipping_fee_fixed,
      return_policy
      FROM stores WHERE url = ? LIMIT 1`,
      [storeUrl],
    );

    if (store.length === 0) throw new Error("Store not found");

    return store[0];
  } catch (error) {
    throw error;
  }
};

export const updateStoreDefaultShippingDetails = async (
  storeUrl: string,
  details: StoreModelInput,
) => {
  console.log("details ", details);
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized.");

    if (user.privateMetadata.role !== "SELLER")
      throw new Error("Unauthorized Access");

    if (!storeUrl) throw new Error("No shipping details provide to update.");

    // Make sure seller is updating their own store
    const [check_ownership] = await conn.query<RowDataPacket[]>(
      "SELECT id FROM stores WHERE url = ? AND user_id = ?",
      [storeUrl, user.id],
    );

    if (check_ownership.length === 0)
      throw new Error(
        "Make sure you have the permissions to update this store",
      );

    // find and update the store based on storeUrl
    await conn.query<ResultSetHeader>(
      `UPDATE stores SET 
     default_shipping_service = ?, 
     default_shipping_fee_per_item = ?,
     default_shipping_fee_for_addional_item = ?,
     default_shipping_fee_per_kg = ?,
     default_delivery_time_max = ?,
     default_delivery_time_min = ?,
     default_shipping_fee_fixed = ?,
     return_policy = ?,
     updated_at = NOW()

     WHERE url = ? AND user_id = ?`,
      [
        details.default_shipping_service,
        details.default_shipping_fee_per_item,
        details.default_shipping_fee_for_addional_item,
        details.default_shipping_fee_per_kg,
        details.default_delivery_time_max,
        details.default_delivery_time_min,
        details.default_shipping_fee_fixed,
        details.return_policy,
        storeUrl,
        user.id,
      ],
    );
    await conn.commit();
    return {
      ok: true,
    };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

// Retrieves all countries and their shipping rates for s specificaiton store.
// if a country does not have a shipping rate, it is still included in the
export const getStoreShippingRates = async (storeUrl: string) => {
  try {
    const userId = await permissionSeller(storeUrl);

    // Make sure seller is updating their own store
    const [check_ownership] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM stores WHERE url = ? AND user_id = ? LIMIT 1",
      [storeUrl, userId],
    );

    if (check_ownership.length === 0)
      throw new Error(
        "Make sure you have the permissions to udpate this store.",
      );

    // Get store details
    const [store] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM stores WHERE url = ? AND user_id = ? LIMIT 1",
      [storeUrl, userId],
    );

    if (store.length === 0) throw new Error("Store could not be found.");

    // Retrieve all countries
    const [countries] = await pool.query<RowDataPacket[]>(
      "SELECT id,name FROM countries ORDER BY name DESC",
    );

    // Retrieve all shipping rates for specified store
    const [shippingRates] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM shipping_rates WHERE store_id = ?",
      [store[0].id],
    );

    // create a map for quick lookup for shipping rates by country id
    const rateMap = new Map();

    shippingRates.forEach((rate) => {
      rateMap.set(rate.country_id, rate);
    });

    const result = countries.map<CountryWithShippingRateModel>((country) => ({
      countryId: country.id,
      countryName: country.name,
      shippingRate: rateMap.get(country.id) || null,
    }));

    return result;
  } catch (error) {
    throw error;
  }
};

//
export const upsertShippngRate = async (
  storeUrl: string,
  shippingRate: CountryWithShippingRateModel,
) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const userId = await permissionSeller(storeUrl);

    const [check_ownership] = await conn.query<RowDataPacket[]>(
      "SELECT id FROM stores WHERE url = ? AND user_id = ?",
      [storeUrl, userId],
    );

    if (check_ownership.length === 0)
      throw new Error(
        "Make sure you have the permissions to update this store",
      );

    if (!shippingRate) throw new Error("Please provide shipping rate data.");

    if (!shippingRate.countryId)
      throw new Error("Please provide a valid country ID.");

    // get store id
    const [store] = await conn.query<RowDataPacket[]>(
      "SELECT id FROM stores WHERE url = ? AND user_id = ? LIMIT 1",
      [storeUrl, userId],
    );

    if (store.length === 0)
      throw new Error("Please provide a valid store URL.");

    // upsert the shipping rate into the db
    const shipping = shippingRate.shippingRate;

    const columns = [
      "country_id",
      "shipping_service",
      "shipping_fee_per_item",
      "shipping_fee_additional_item",
      "shipping_fee_per_kg",
      "shipping_fee_fixed",
      "delivery_time_min",
      "delivery_time_max",
      "return_policy",
      "store_id",
    ];

    const values = [
      shipping.country_id,
      shipping.shipping_service,
      shipping.shipping_fee_per_item,
      shipping.shipping_fee_additional_item,
      shipping.shipping_fee_per_kg,
      shipping.shipping_fee_fixed,
      shipping.delivery_time_min,
      shipping.delivery_time_max,
      shipping.return_policy,
      store[0].id,
    ];

    const placeholder = columns.map(() => "?").join(", ");
    const placeholderUpdate = columns.map((v) => `${v} = ?`).join(", ");

    const [existing] = await conn.query<RowDataPacket[]>(
      "SELECT id FROM shipping_rates WHERE country_id = ? LIMIT 1",
      [shipping.country_id],
    );

    if (existing.length === 0) {
      // insert
      const sql = `INSERT INTO shipping_rates (${columns.join(
        ", ",
      )}) VALUES (${placeholder})`;

      await conn.query<ResultSetHeader>(sql, values);
    } else {
      // update
      const sql = `UPDATE shipping_rates SET ${placeholderUpdate}, updated_at = NOW() WHERE country_id = '${shipping.country_id}'`;
      await conn.query<ResultSetHeader>(sql, values);
    }
    await conn.commit();
    return {
      message:
        existing.length === 0
          ? "Store default shipping details has been added."
          : "Store default shipping details has been updated.",
    };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

// export const getStoreById = async (storeId: string) => {
//   const [rows] = await pool.query(
//     "SELECT * FROM stores WHERE store_id = ?",
//     [],
//   );
// };
