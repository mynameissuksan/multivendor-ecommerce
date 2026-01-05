"use server";

import { pool } from "@/lib/config/db";
import {
  StoreModel,
  StoreModelInput,
  StoreResultModel,
} from "@/models/store-model";
import { currentUser } from "@clerk/nextjs/server";

export const getAllStoreByUserId = async (userId: string) => {
  const [rows] = await pool.query<StoreModel[]>(
    "SELECT * FROM stores WHERE user_id = ?",
    [userId]
  );

  return rows;
};

export const upsertStore = async (store: StoreModelInput) => {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized!");
    if (user.privateMetadata.role !== "SELLER") {
      throw new Error("Unauthorized Access");
    }
    if (!store) throw new Error("Please provide store data.");

    // ตรวจสอบข้อมูลซ้ำ ยกเว้น record ตัวเองตอน update
    const [rows] = await pool.query<StoreModel[]>(
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
      ]
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
      await pool.query<StoreResultModel>(
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
        ]
      );

      return { message: "Store updated successfully", status: true };
    }

    // Insert
    const [result] = await pool.query<StoreResultModel>(
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
      ]
    );

    return {
      message: "Store created successfully",
      storeId: result.insertId,
    };
  } catch (error) {
    throw error;
  }
};

export const getStoreByUrl = async (url: string) => {
  const [storeDetails] = await pool.query<StoreModel[]>(
    "SELECT * FROM stores WHERE url = ? LIMIT 1",
    [url]
  );
  return storeDetails[0];
};
