/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { pool } from "@/lib/config/db";
import { generateUniqueSlug } from "@/lib/server-utils";
import { ProductModelInput } from "@/models/product-model";
import { StoreModel } from "@/models/store-model";
import { currentUser } from "@clerk/nextjs/server";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import slugify from "slugify";

export const upsertProduct = async (
  product: ProductModelInput,
  storeUrl: string,
) => {
  // console.log("product", product);
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const user = await currentUser();
    if (!user) throw new Error("Unauthenticated.");

    if (user.privateMetadata.role !== "SELLER") {
      throw new Error("Unauthorized Access");
    }

    if (!product) throw new Error("Please provide product data.");

    // check if the product already exists
    // const [existingsProduct] = await pool.query(
    //   "SELECT id FROM products WHERE id = ?",
    //   [product.id]
    // );

    // find the store by url
    const [storeRows] = await conn.query<StoreModel[]>(
      "SELECT * FROM stores WHERE url = ?",
      [storeUrl],
    );

    if (storeRows.length === 0) throw new Error("Store not found");
    const store = storeRows[0];

    // Generate unique slug for product and variant
    const productSlug = await generateUniqueSlug(
      slugify(product.name, {
        lower: true,
        replacement: "-",
        trim: true,
      }),
      "products",
    );

    const variantSlug = await generateUniqueSlug(
      slugify(product.product_varian[0].name, {
        lower: true,
        replacement: "-",
        trim: true,
      }),
      "products_variant",
    );

    let productId: string;
    let variantId: string;

    if (product?.id) {
      // Update existing product
      await conn.query<ResultSetHeader>(
        "UPDATE products SET name = ?, description = ?, slug = ?, brand = ?, category_id = ?, sub_category_id = ?, updated_at = NOW() WHERE id = ? ",
        [
          product.name,
          product.description,
          productSlug,
          product.brand,
          product.categories?.id,
          product.sub_categories?.id,
          product.id,
        ],
      );
      productId = product.id;
    } else {
      // Insert new product
      await conn.query<ResultSetHeader>(
        "INSERT INTO products (store_id, category_id, sub_category_id, name, description, slug, brand) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          store.id,
          product.categories?.id,
          product.sub_categories?.id,
          product.name,
          product.description,
          productSlug,
          product.brand,
        ],
      );

      // Get the inserted product ID
      const [newProduct] = await conn.query<RowDataPacket[]>(
        "SELECT id FROM products WHERE slug = ? ORDER BY created_at DESC LIMIT 1",
        [productSlug],
      );
      productId = newProduct[0]?.id;
    }

    // --------------------- Upsert questions --------------------------------
    await conn.query("DELETE FROM questions WHERE product_id = ?", [productId]);

    const qs = (product.questions ?? []).filter((q) => q.question && q.answer);
    if (qs.length > 0) {
      const values = qs.map(() => "(?, ?, ?, NOW(), NOW())").join(", ");
      const params = qs.flatMap((q) => [q.question, q.answer, productId]);
      await conn.query(
        `INSERT INTO questions (question, answer, product_id, created_at, updated_at)
         VALUES ${values}`,
        params,
      );
    }

    // ------------- Upsert Variant --------------
    const variant = product.product_varian[0];
    if (!variant) throw new Error("Product Variant is required");

    if (variant?.id) {
      // Updated existing variant

      await conn.query<ResultSetHeader>(
        "UPDATE products_variant SET name = ?, description = ?, slug = ?, keywords = ?, is_sale = ?, sku = ?, variant_image = ?, sale_end_date = ? WHERE id = ?",
        [
          variant.name,
          variant.description,
          variant.slug,
          variant.keywords?.join(",") || null,
          variant.is_sale || false,
          variant.sku,
          variant.variant_image,
          variant.sale_end_date,
          variant.id,
        ],
      );

      variantId = variant?.id;
    } else {
      // Insert new variant

      await conn.query<ResultSetHeader>(
        "INSERT INTO products_variant (product_id, name, description, slug, keywords, is_sale, sku, variant_image, sale_end_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          productId,
          variant.name,
          variant.description,
          variantSlug,
          variant.keywords?.join(",") || null,
          variant.is_sale || false,
          variant.sku,
          variant.variant_image,
          variant.sale_end_date,
        ],
      );

      const [newVariant] = await conn.query<RowDataPacket[]>(
        "SELECT id FROM products_variant WHERE slug = ? ORDER BY created_at DESC LIMIT 1",
        [variantSlug],
      );

      variantId = newVariant[0].id;
    }

    // ----------------- Upsert Specs --------------------

    await conn.query(
      "DELETE FROM spces WHERE product_id = ? AND variant_id = ?",
      [productId, variantId],
    );

    const productSpecs = (product.product_specs ?? []).filter(
      (s) => s.name && s.value,
    );
    if (productSpecs.length > 0) {
      const values = productSpecs.map(() => "(?, ?, ?, ?)").join(", ");
      const params = productSpecs.flatMap((s) => [
        s.name,
        s.value,
        productId,
        variantId,
      ]);
      await conn.query(
        `INSERT INTO spces (name, value, product_id, variant_id)
         VALUES ${values}`,
        params,
      );
    }

    // ---------------------------- Handle Images -----------------------------------------
    if (variant.images && variant.images.length > 0) {
      await conn.query(
        "DELETE FROM product_variant_images WHERE products_variant_id = ?",
        [variantId],
      );

      const imgs = (variant.images ?? []).filter((i) => i.url);
      if (imgs.length > 0) {
        const values = imgs
          .map(() => "(UUID(), ?, ?, ?, NOW(), NOW())")
          .join(", ");
        const params = imgs.flatMap((i) => [
          variantId,
          i.url,
          i.url.split("/").pop() ?? "",
        ]);
        await conn.query(
          `INSERT INTO product_variant_images (id, products_variant_id, url, alt, created_at, updated_at)
         VALUES ${values}`,
          params,
        );
      }
    }

    // -------- Handle colors -------
    await conn.query("DELETE FROM colors WHERE products_variant_id = ?", [
      variantId,
    ]);

    const cols = (variant.colors ?? []).filter((c) => c.name);
    if (cols.length > 0) {
      const values = cols.map(() => "(UUID(), ?, ?, NOW(), NOW())").join(", ");
      const params = cols.flatMap((c) => [variantId, c.name]);
      await conn.query(
        `INSERT INTO colors (id, products_variant_id, name, created_at, updated_at)
         VALUES ${values}`,
        params,
      );
    }

    // ------------ Sizes ----------------
    await conn.query("DELETE FROM sizes WHERE products_variant_id = ?", [
      variantId,
    ]);

    const sz = (variant.sizes ?? []).filter((s) => s.size);
    if (sz.length > 0) {
      const values = sz
        .map(() => "(UUID(), ?, ?, ?, ?, ?, NOW(), NOW())")
        .join(", ");
      const params = sz.flatMap((s) => [
        variantId,
        s.size,
        s.quantity,
        s.price,
        s.discount,
      ]);
      await conn.query(
        `INSERT INTO sizes (id, products_variant_id, size, quantity, price, discount, created_at, updated_at)
         VALUES ${values}`,
        params,
      );
    }

    await conn.commit();

    return {
      status: true,
      productId,
      variantId,
      message: product?.id
        ? "Product updated successfully"
        : "Product created successfully",
    };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

// get product by store
export const getProductMainInfo = async (productId: string) => {
  try {
    const [productRows] = await pool.query<RowDataPacket[]>(
      `SELECT p.id, p.name, p.description, p.brand, c.id as category_id, s.id as sub_category_id, p.store_id,
     pv.id as pv_id,
     pv.name as pv_name,
     pv.variant_image as pv_image,
     pv.description as pv_description,
     pv.slug as pv_slug,
     pv.keywords as pv_keywords,
     pv.is_sale as pv_is_sale,
     pv.sale_end_date as pv_sale_end_date,
     pv.sku as pv_sku,
     

     sizes.id as size_id,
     sizes.size as size_name,
     sizes.quantity as quantity,
     sizes.price as price,
     sizes.discount as discount

     FROM products p
     INNER JOIN categories c ON p.category_id = c.id
     INNER JOIN sub_categories s ON p.sub_category_id = s.id
     INNER JOIN products_variant pv ON pv.product_id = p.id
     INNER JOIN sizes ON sizes.products_variant_id = pv.id
     WHERE p.id = ? LIMIT 1`,
      [productId],
    );

    if (productRows.length === 0) return null;

    const product = productRows[0];

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      brand: product.brand,
      product_varian: [
        {
          id: product.pv_id,
          name: product.pv_name,
          variant_image: product.pv_image,
          description: product.pv_description,
          slug: product.pv_slug,
          keywords: product.pv_keywords,
          is_sale: product.pv_is_sale,
          sale_end_date: product.pv_sale_end_date,
          sku: product.pv_sku,
          sizes: [
            {
              size: product.size_name,
              quantity: product.quantity,
              price: product.price,
              discount: product.discount,
            },
          ],
        },
      ],
      categories: {
        id: product.category_id,
      },
      sub_categories: {
        id: product.sub_category_id,
      },
      stores: {
        id: product.store_id,
      },
    } as ProductModelInput;
  } catch (error) {
    throw error;
  }
};

// หา Store ID จาก URL
async function getStoreIdByUrl(storeUrl: string): Promise<string> {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT id FROM stores WHERE url = ? LIMIT 1",
    [storeUrl],
  );

  if (rows.length === 0) {
    throw new Error("Store not found");
  }

  return rows[0].id;
}

// Query products พร้อมข้อมูล related tables
async function queryProducts(storeId: string) {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT 
       -- Product Info
       p.id AS product_id,
       p.name AS product_name,
       p.description AS product_description,
       p.slug AS product_slug,
       p.brand AS product_brand,
       p.rating AS product_rating,
       
       -- Category Info
       c.id AS category_id,
       c.name AS category_name,
       c.url AS category_url,
       c.image AS category_image,
      
       -- Sub Category Info
       sc.id AS sub_category_id,
       sc.name AS sub_category_name,
       sc.url AS sub_category_url,
       sc.image AS sub_category_image,
       
       -- Variant Info
       pv.id AS variant_id,
       pv.name AS variant_name,
       pv.description AS variant_description,
       pv.slug AS variant_slug,
       pv.keywords AS variant_keywords,
       pv.is_sale AS variant_is_sale,
       pv.sku AS variant_sku,
       
       -- Store Info
       s.id AS store_id,
       s.name AS store_name,
       s.url AS store_url

     FROM products p
     INNER JOIN categories c ON p.category_id = c.id
     INNER JOIN sub_categories sc ON p.sub_category_id = sc.id
     INNER JOIN products_variant pv ON p.id = pv.product_id
     INNER JOIN stores s ON p.store_id = s.id
     WHERE s.id = ?
     ORDER BY p.id, pv.id`,
      [storeId],
    );
    await conn.commit();
    return rows;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

// Query variant images สำหรับ variants ทั้งหมด

async function queryVariantImages(variantIds: string[]) {
  if (variantIds.length === 0) return [];

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT id, products_variant_id, url, alt, created_at, updated_at
     FROM product_variant_images 
     WHERE products_variant_id IN (?)`,
    [variantIds],
  );

  return rows;
}

// Query variant colors สำหรับ variants ทั้งหมด
async function queryVariantColors(variantIds: string[]) {
  if (variantIds.length === 0) return [];

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT id, products_variant_id, name, created_at, updated_at
     FROM colors 
     WHERE products_variant_id IN (?)`,
    [variantIds],
  );

  return rows;
}

// Query variant sizes สำหรับ variants ทั้งหมด

async function queryVariantSizes(variantIds: string[]) {
  if (variantIds.length === 0) return [];

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT id, products_variant_id, size, quantity, price, discount, created_at, updated_at
     FROM sizes 
     WHERE products_variant_id IN (?)`,
    [variantIds],
  );

  return rows;
}

// แปลง raw data เป็น ProductModelInput
function mapProductsData(
  productRows: RowDataPacket[],
  images: RowDataPacket[],
  colors: RowDataPacket[],
  sizes: RowDataPacket[],
): ProductModelInput[] {
  // สร้าง Map เพื่อ group products
  const productMap = new Map<string, ProductModelInput>();

  for (const row of productRows) {
    // ถ้ายังไม่มี product ใน Map ให้สร้างใหม่
    if (!productMap.has(row.product_id)) {
      productMap.set(row.product_id, {
        id: row.product_id,
        name: row.product_name,
        description: row.product_description,
        slug: row.product_slug,
        brand: row.product_brand,
        rating: row.product_rating,

        stores: {
          id: row.store_id,
          name: row.store_name,
          url: row.store_url,
        },

        categories: {
          id: row.category_id,
          name: row.category_name,
          url: row.category_url,
          image: row.category_image,
        },

        sub_categories: {
          id: row.sub_category_id,
          name: row.sub_category_name,
          url: row.sub_category_url,
          image: row.sub_category_image,
        },

        product_varian: [],
      });
    }

    const product = productMap.get(row.product_id)!;

    // เช็คว่า variant นี้มีอยู่แล้วหรือยัง (กรณีที่ join ซ้ำ)
    const variantExists = product.product_varian.some(
      (v) => v.id === row.variant_id,
    );

    if (!variantExists) {
      // เพิ่ม variant ใหม่
      product.product_varian.push({
        id: row.variant_id,
        name: row.variant_name,
        description: row.variant_description,
        slug: row.variant_slug,
        keywords: row.variant_keywords?.split(",").filter(Boolean) || [],
        is_sale: Boolean(row.variant_is_sale),
        sku: row.variant_sku,

        images: images
          .filter((img) => img.products_variant_id === row.variant_id)
          .map((img) => ({
            id: img.id,
            url: img.url,
            alt: img.alt,
            created_at: img.created_at,
            updated_at: img.updated_at,
          })),

        colors: colors
          .filter((c) => c.products_variant_id === row.variant_id)
          .map((c) => ({
            id: c.id,
            name: c.name,
            products_variant_id: c.products_variant_id,
            created_at: c.created_at,
            updated_at: c.updated_at,
          })),

        sizes: sizes
          .filter((s) => s.products_variant_id === row.variant_id)
          .map((s) => ({
            id: s.id,
            size: s.size,
            quantity: s.quantity,
            price: s.price,
            discount: s.discount,
            created_at: s.created_at,
            updated_at: s.updated_at,
          })),
      });
    }
  }

  return Array.from(productMap.values());
}

//  Main

//  ดึงข้อมูล products ทั้งหมดของ store พร้อม variants, images, colors, sizes
export async function getAllStoreProducts(
  storeUrl: string,
): Promise<ProductModelInput[]> {
  try {
    // 1. หา Store ID
    const storeId = await getStoreIdByUrl(storeUrl);

    // 2. Query products และ variants
    const productRows = await queryProducts(storeId);

    // console.log("productRows", productRows);

    if (productRows.length === 0) {
      return [];
    }

    // 3. เก็บ variant IDs ทั้งหมด
    const variantIds = [...new Set(productRows.map((row) => row.variant_id))];
    // const variantIds = productRows.map((row) => row.variant_id);

    // console.log("variantIds", variantIds);

    // 4. Query related data แบบ parallel
    const [images, colors, sizes] = await Promise.all([
      queryVariantImages(variantIds),
      queryVariantColors(variantIds),
      queryVariantSizes(variantIds),
    ]);

    // 5. Map ข้อมูลเป็น ProductModelInput
    const products = mapProductsData(productRows, images, colors, sizes);

    // console.log('products',products)

    return products;
  } catch (error) {
    console.error("Error in getAllStoreProducts:", error);
    throw error;
  }
}

// Delete Product
export const deleteProduct = async (productId: string) => {
  try {
    const user = await currentUser();

    if (!user) throw new Error("Unauthorized.");

    if (
      user.privateMetadata.role !== "SELLER" &&
      user.privateMetadata.role !== "ADMIN"
    )
      throw new Error("Unauthorized Access");

    if (!productId) throw new Error("Please provide product id");

    const [res] = await pool.query<ResultSetHeader>(
      "DELETE FROM products WHERE id = ?",
      [productId],
    );

    return res;
  } catch (error) {
    throw error;
  }
};

export const getProducts = async (
  filters: any = {},
  sortBy: string = "",
  page: number = 1,
  pageSize: number = 10,
) => {
  const currentPage = Math.max(1, page);
  const limit = Math.max(1, Math.min(pageSize, 50));
  const offset = (currentPage - 1) * limit;

  const sql = `
    SELECT *
    FROM products
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?;
  `;

  const [rows] = await pool.query<RowDataPacket[]>(sql, [limit, offset]);

  // Transform the products with filtered variants into ProductsCartType structure
  const productWithFilteredVariants = rows.map((product) => {
    // filter the variants base on the filters
    // Transform the filtered variants into the variants structure
    // Extract variant images for the prdouct
  });

  // ถ้าจะทำ pagination จริง ต้องมี COUNT แยก (ดูด้านล่าง)
  const totalCount = rows.length;
  const totalPages = Math.ceil(totalCount / limit);

  return {
    products: rows as ProductModelInput[],
    totalPages,
    currentPage,
    totalCount,
  };
};
