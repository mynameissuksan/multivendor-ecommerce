"use server";

import { pool } from "@/lib/config/db";
import { currentUser } from "@clerk/nextjs/server";
import { RowDataPacket } from "mysql2";

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
