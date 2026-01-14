"use server";

import { pool } from "@/lib/config/db";
import { RowDataPacket } from "mysql2";

export async function updatedVariantImage() {
  try {
    // Fetch all product variants that have images
    const [variantsRows] = await pool.query<RowDataPacket[]>(
      `SELECT  
       products_variant.id as variant_id,
       product_variant_images.url,
       product_variant_images.alt
       FROM products_variant 
       INNER JOIN product_variant_images ON products_variant.id = product_variant_images.products_variant_id
       ORDER BY products_variant.id, product_variant_images.id`
    );

    // Group images by variant_id
    const variantsMap = new Map<
      string,
      { id: string; images: Array<{ url: string; alt: string }> }
    >();

    for (const row of variantsRows) {
      const variantId = row!.variant_id as string;

      if (!variantsMap.has(variantId)) {
        variantsMap.set(variantId, {
          id: variantId,
          images: [],
        });
      }

      variantsMap.get(variantId)?.images.push({
        url: row.url,
        alt: row.alt,
      });
    }

    // Update each variant with the first image URL
    for (const [variantId, variant] of variantsMap) {
      if (variant.images.length > 0) {
        const firstImage = variant.images[0];

        await pool.query(
          "UPDATE products_variant SET variant_image = ?, updated_at = NOW() WHERE id = ?",
          [firstImage.url, variantId]
        );

        console.log(
          `Updated variant ${variant.id} with images ${firstImage.url}`
        );
      }
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
