import { pool } from "@/lib/config/db";
import { clerkClient } from "@clerk/nextjs/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { RowDataPacket } from "mysql2";
import { NextRequest } from "next/server";

// ResultSetHeader ใช้สำหรับ INSERT, UPDATE, DELETE
// RowDataPacket เป็น type ที่ mysql2 ใช้สำหรับผลลัพธ์จาก SELECT query

interface DbUser extends RowDataPacket {
  email: string;
  role: string;
}

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    // when user is created or updated
    if (evt.type === "user.created" || evt.type === "user.updated") {
      const data = evt.data;

      const [dbUser] = await pool.query<DbUser[]>(
        "SELECT email, role FROM users WHERE email = ? LIMIT 1",
        [data?.email_addresses[0]?.email_address]
      );

      if (Array.isArray(dbUser) && dbUser.length === 0) {
        // Insert new user with default role

        // insert
        await pool.query(
          "INSERT INTO users (id, name, email, picture, role) VALUES (?,?,?,?,?)",
          [
            data.id,
            `${data.first_name} ${data.last_name ?? ""}`,
            data.email_addresses[0].email_address,
            data.image_url,
            "USER",
          ]
        );
      } else {
        console.log("555 role = ", data.private_metadata.role);

        // update
        await pool.query(
          "UPDATE users SET name = ?, email = ?, picture = ?, role = ? WHERE email = ?",
          [
            `${data.first_name} ${data.last_name ?? ""}`,
            data.email_addresses[0].email_address,
            data.image_url,
            data.private_metadata.role,
            data.email_addresses[0].email_address,
          ]
        );
      }

      (await clerkClient()).users.updateUserMetadata(data.id, {
        privateMetadata: {
          role: data.private_metadata.role,
        },
      });
    }

    // when user is deleted
    if (evt.type === "user.deleted") {
      const data = evt.data;
      const userId = data.id;
      await pool.query("DELETE FROM users WHERE id = ?", [userId]);
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
