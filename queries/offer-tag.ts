import { pool } from "@/lib/config/db";
import { OfferTagModel } from "@/models/offer-tag-model";
import { RowDataPacket } from "mysql2";

export const getAllOfferTags = async () => {
  const [offerTags] = await pool.query<RowDataPacket[]>(
    `SELECT 
    
    offer_tags.id as offer_id,
    offer_tags.name as offer_name,
    offer_tags.url as offer_url,
    offer_tags.created_at as offer_created,
    offer_tags.updated_at as offer_updated,

    products.id as product_id,
    products.name as product_name,
    products.description,
    products.slug,
    products.brand,
    products.rating


    FROM offer_tags 
    LEFT JOIN products ON offer_tags.id = products.offer_tag_id
    ORDER BY offer_tags.created_at DESC, products.created_at DESC
    `
  );

  const dataMap = new Map<string, OfferTagModel>();
  for (const row of offerTags) {
    if (!dataMap.has(row.offer_id)) {
      dataMap.set(row.offer_id, {
        id: row.offer_id,
        name: row.offer_name,
        url: row.offer_url,
        created_at: row.offer_created,
        updated_at: row.offer_updated,
        products: [],
      });
    }

    if (row.product_id) {
      dataMap.get(row.offer_id)?.products?.push({
        id: row.prdouct_id,
        name: row.product_name,
        description: row.description,
        brand: row.brand,
        slug: row.slug,
        product_varian: [],
      });
    }
  }
  return Array.from(dataMap.values());
};
