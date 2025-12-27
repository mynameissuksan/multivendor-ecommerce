import { pool } from "@/lib/config/db";
import { StoreModel } from "@/models/store-model";

export const getAllStoreByUserId = async (userId: string) => {
  const [rows] = await pool.query<StoreModel[]>(
    "SELECT * FROM stores WHERE user_id = ?",
    [userId]
  );

  return rows;
};
