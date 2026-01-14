/* eslint-disable @typescript-eslint/no-explicit-any */
import { pool } from "@/lib/config/db";

// Helper function to generate a unique slug
export const generateUniqueSlug = async (
  baseSlug: string,
  table: string,
  field: string = "slug",
  separator: string = "-"
) => {
  let slug = baseSlug;
  let suffix = 1;

  while (true) {
    const [existingRecord] = await pool.query<any[]>(
      `SELECT 1 FROM ${table} WHERE ${field} = ? LIMIT 1`,
      [slug]
    );

    if (existingRecord.length === 0) break;
    slug = `${slug}${separator}${suffix}`;
    suffix += 1;
  }

  return slug;
};
