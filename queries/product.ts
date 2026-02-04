"use server";

import {
  ProductColorsModelInput,
  ProductSpecsModel,
  ProductVariantImagesModelInput,
  ProductVariantModelInput,
  QuestionsModel,
  VariantSpecsModel,
} from "@/models/product-model";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { pool } from "@/lib/config/db";
import { generateUniqueSlug } from "@/lib/server-utils";
import {
  ProductModelInput,
  ProductSizeModelInput,
} from "@/models/product-model";
import { StoreModel, StoreModelInput } from "@/models/store-model";
import { currentUser } from "@clerk/nextjs/server";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import slugify from "slugify";

// Cookies
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import { FreeShippingModel, ShippingRate } from "@/models/shipping-model";
import { ReviewModelInput } from "@/models/review-model";
import { SortOrder } from "@/lib/types";

const productVariantSqlColumn = `
   -- Variant Info
       pv.id AS variant_id,
       pv.name AS variant_name,
       pv.description AS variant_description,
       pv.slug AS variant_slug,
       pv.keywords AS variant_keywords,
       pv.is_sale AS variant_is_sale,
       pv.sku AS variant_sku,
       pv.sales AS variant_sales,
       pv.sale_end_date,
       pv.product_id as variant_product_id,
       pv.weight as variant_weight,
       pv.variant_image AS variant_image `;

const categorySqlColumn = `    
       -- Category Info
       c.id AS category_id,
       c.name AS category_name,
       c.url AS category_url,
       c.image AS category_image `;

const subCategorySqlColumn = `   
       -- Sub Category Info
       sc.id AS sub_category_id,
       sc.name AS sub_category_name,
       sc.url AS sub_category_url,
       sc.image AS sub_category_image `;

const storeSqlColumn = ` 
       -- Store Info
       s.id AS store_id,
       s.name AS store_name,
       s.url AS store_url `;

const productSqlColumn = ` 
       -- Product Info
       p.id AS product_id,
       p.name AS product_name,
       p.description AS product_description,
       p.slug AS product_slug,
       p.brand AS product_brand,
       p.rating AS product_rating,
       p.sales as product_sales `;

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
        "UPDATE products_variant SET name = ?, description = ?, slug = ?, keywords = ?, is_sale = ?, sku = ?, variant_image = ?, sale_end_date = ?, weight = ? WHERE id = ?",
        [
          variant.name,
          variant.description,
          variant.slug,
          variant.keywords?.join(",") || null,
          variant.is_sale || false,
          variant.sku,
          variant.variant_image,
          variant.sale_end_date,
          variant.weight,
          variant.id,
        ],
      );

      variantId = variant?.id;
    } else {
      // Insert new variant

      await conn.query<ResultSetHeader>(
        "INSERT INTO products_variant (product_id, name, description, slug, keywords, is_sale, sku, variant_image, sale_end_date, weight) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
          variant.weight,
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
      "DELETE FROM specs WHERE product_id = ? AND variant_id = ?",
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
        `INSERT INTO specs (name, value, product_id, variant_id)
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
async function queryAllProductsStore(storeId: string) {
  try {
    const sql = `SELECT 
       ${productSqlColumn},
       ${categorySqlColumn},
       ${subCategorySqlColumn},
       ${storeSqlColumn}

     FROM products p
     INNER JOIN categories c ON p.category_id = c.id
     INNER JOIN sub_categories sc ON p.sub_category_id = sc.id
     INNER JOIN stores s ON p.store_id = s.id
     WHERE s.id = ?
     ORDER BY p.id`;

    const [rows] = await pool.query<RowDataPacket[]>(sql, [storeId]);

    return rows;
  } catch (error) {
    throw error;
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

  // console.log('variantId ====> ',variantIds)

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

async function queryVariantByProductId(productId: string[]) {
  const [variantRows] = await pool.query<RowDataPacket[]>(
    `SELECT ${productVariantSqlColumn} FROM products_variant pv WHERE product_id IN (?) ORDER BY pv.id`,
    [productId],
  );
  return variantRows;
}

async function queryVariantSpecs(variantIds: string) {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT id, name, value FROM specs WHERE variant_id = ?`,
    [variantIds],
  );
  return rows;
}

async function queryProductSpecs(productId: string) {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT id, name, value FROM specs WHERE product_id = ?`,
    [productId],
  );

  return rows;
}

async function queryFollowStoreCountByStoreId(storeId: string) {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT COUNT(*) as follow_count FROM follows WHERE store_id = ? ",
    [storeId],
  );
  return rows[0].follow_count;
}

// query questions
async function queryQuestions(productId: string[]) {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT id, question, answer FROM questions WHERE product_id IN (?)`,
    [productId],
  );
  return rows;
}

// query review prdouct
async function queryReviewsProduct(productId: string) {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT 
     r.id as review_id, 
     r.variant, 
     r.review, 
     r.rating, 
     r.color, 
     r.likes,
     r.size, 
     r.quantity, 
     r.created_at, 
     r.product_id,

     ri.url as image_url,
     ri.alt as image_review_alt,
     ri.review_id as ri_review_id,

     u.id as user_id,
     u.name as user_name,
     u.email as user_email,
     u.picture as user_picture,
     u.role as user_role

     FROM reviews r
     LEFT JOIN review_images ri ON ri.review_id = r.id
     INNER JOIN users u ON r.user_id = u.id
     WHERE r.product_id = ?
     LIMIT 2`,
    [productId],
  );

  const dataMap = new Map<string, ReviewModelInput>();
  for (const review of rows) {
    if (!dataMap.has(review.review_id)) {
      dataMap.set(review.review_id, {
        id: review.review_id,
        variant: review.variant,
        review: review.review,
        rating: review.rating,
        color: review.color,
        size: review.size,
        quantity: review.quantity,
        likes: review.likes,
        created_at: review.created_at,
        updated_at: review.updated_at,
        user: {
          id: review.user_id,
          name: review.user_name,
          email: review.user_email,
          picture: review.user_picture,
          role: review.user_role,
        },
        review_image: [],
      });
    }
    const getMapId = dataMap.get(review.review_id)?.id;

    const filterId = rows.find((f) => f.ri_review_id === getMapId);

    if (filterId) {
      dataMap.get(review.review_id)?.review_image.push({
        id: review.ri_review_id,
        url: review.image_url,
        alt: review.image_review_alt,
        review_id: review.review_id,
      });
    }
  }

  // console.log(dataMap);

  return Array.from(dataMap.values());
}

// แปลง raw data เป็น ProductModelInput
function mapProductsData(
  productRows: RowDataPacket[],
  images: RowDataPacket[],
  colors: RowDataPacket[],
  sizes: RowDataPacket[],
  variantRows?: RowDataPacket[],
  freeShipping?: FreeShippingModel,
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
        sales: row.product_sales,

        free_shipping: freeShipping,

        stores: {
          id: row.store_id,
          name: row.store_name,
          url: row.store_url,
          logo: row.store_logo,
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

        product_varian: variantRows
          ?.filter((v) => v.variant_product_id === row.product_id)
          .map((v) => {
            return {
              id: v.variant_id,
              name: v.variant_name,
              description: v.variant_description,
              slug: v.variant_slug,
              keywords: v.variant_keywords,
              weight: v.variant_weight,
              is_sale: v.variant_is_sale,
              sku: v.variant_sku,
              sales: v.variant_sales,
              product_id: v.variant_product_id,
              sale_end_date: v.variant_sale_end_date,
              url: `/product/${row.product_slug}/${v.variant_slug}`,
              variant_image: v.variant_image,

              images: images
                .filter((img) => img.products_variant_id === v.variant_id)
                .map((img) => ({
                  id: img.id,
                  url: img.url,
                  alt: img.alt,
                  created_at: img.created_at,
                  updated_at: img.updated_at,
                })) as ProductVariantImagesModelInput[],
              colors: colors
                .filter((c) => c.products_variant_id === v.variant_id)
                .map((c) => ({
                  id: c.id,
                  name: c.name,
                  products_variant_id: c.products_variant_id,
                  created_at: c.created_at,
                  updated_at: c.updated_at,
                })) as ProductColorsModelInput[],
              sizes: sizes
                .filter((s) => s.products_variant_id === v.variant_id)
                .map((s) => ({
                  id: s.id,
                  size: s.size,
                  quantity: s.quantity,
                  price: s.price,
                  discount: s.discount,
                  created_at: s.created_at,
                  updated_at: s.updated_at,
                })) as ProductSizeModelInput[],
            };
          }) as ProductVariantModelInput[],
      });
    }
  }

  return Array.from(productMap.values());
}

//  Main

//  ดึงข้อมูล products ทั้งหมดของ store พร้อม variants, images, colors, sizes แสดงข้อมูลเก่าพร้อมอัพเดทสินค้า
export async function getAllStoreProducts(
  storeUrl: string,
): Promise<ProductModelInput[]> {
  try {
    // 1. หา Store ID
    const storeId = await getStoreIdByUrl(storeUrl);

    // 2. Query products และ variants
    const productRows = await queryAllProductsStore(storeId);

    // console.log("productRows", productRows);

    if (productRows.length === 0) {
      return [];
    }

    // 3. เก็บ variant IDs ทั้งหมด
    // const variantIds = [...new Set(productRows.map((row) => row.variant_id))];
    const productsIds = productRows.map((row) => row.product_id);

    const variantRows = await queryVariantByProductId(productsIds);

    // console.log("variantRows ----> ", variantRows);

    // console.log("variantIds", variantIds);

    const variantIds = variantRows.map((v) => v.variant_id);

    // 4. Query related data แบบ parallel
    const [images, colors, sizes] = await Promise.all([
      queryVariantImages(variantIds),
      queryVariantColors(variantIds),
      queryVariantSizes(variantIds),
    ]);

    // 5. Map ข้อมูลเป็น ProductModelInput
    const products = mapProductsData(
      productRows,
      images,
      colors,
      sizes,
      variantRows,
    );

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

  const whereClause: string[] = [];
  const values: string[] = [];

  // Apply store filter using store URL
  if (filters.store) {
    const [store] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM stores WHERE url = ? LIMIT 1",
      [filters.category],
    );

    if (store.length !== 0) {
      whereClause.push(" WHERE p.store_id = ? ");
      values.push(store[0].id);
    }
  }

  // Apply category filter where url
  if (filters.category) {
    const [category] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM categories WHERE url = ? LIMIT 1",
      [filters.category],
    );

    if (category.length !== 0) {
      whereClause.push(" WHERE p.category_id = ? ");
      values.push(category[0].id);
    }
  }

  // Apply sub category filter where url
  if (filters.subCategory) {
    const [sub] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM sub_categories WHERE url = ? LIMIT 1",
      [filters.subCategory],
    );

    if (sub.length !== 0) {
      whereClause.push(" WHERE p.sub_category_id = ? ");
      values.push(sub[0].id);
    }

    // console.log("whereClause ====> ", whereClause);
    // console.log("values ====> ", values);
  }

  const sql = `
    SELECT 
       ${productSqlColumn},
       ${categorySqlColumn},
       ${subCategorySqlColumn},
       ${storeSqlColumn}

     FROM products p
     INNER JOIN categories c ON p.category_id = c.id
     INNER JOIN sub_categories sc ON p.sub_category_id = sc.id
     INNER JOIN stores s ON p.store_id = s.id
     ${whereClause}
     ORDER BY p.id DESC
     LIMIT ? OFFSET ?
  `;

  const [rows] = await pool.query<RowDataPacket[]>(sql, [
    ...values,
    limit,
    offset,
  ]);

  // Transform the products with filtered variants into ProductsCartType structure
  // const productWithFilteredVariants = rows.map((product) => {
  //   // filter the variants base on the filters
  //   // Transform the filtered variants into the variants structure
  //   // Extract variant images for the prdouct
  // });

  if (rows.length === 0) return;

  const [variantRows] = await pool.query<RowDataPacket[]>(
    `SELECT ${productVariantSqlColumn} FROM products_variant pv WHERE pv.product_id IN (?) AND pv.is_sale = 1`,
    [rows.map((r) => r.product_id)],
  );

  const variantIds = variantRows.map((row) => row.variant_id);

  // 4. Query related data แบบ parallel
  const [images, colors, sizes] = await Promise.all([
    queryVariantImages(variantIds),
    queryVariantColors(variantIds),
    queryVariantSizes(variantIds),
  ]);

  // 5. Map ข้อมูลเป็น ProductModelInput
  const products = mapProductsData(rows, images, colors, sizes, variantRows);

  // console.log("products", products);

  // ถ้าจะทำ pagination จริง ต้องมี COUNT แยก (ดูด้านล่าง)
  const totalCount = rows.length;
  const totalPages = Math.ceil(totalCount / limit);

  return {
    products,
    totalPages,
    currentPage,
    totalCount,
  };
};

export const getProductBySlug = async (slug: string) => {
  try {
    //   Fetch the prodcut from the db using the provided slug
    const [rows] = await pool.query<RowDataPacket[]>(
      `
      SELECT 
      -- product info
      p.id as pd_id,
      p.slug as pd_slug,


      -- variant info
      pv.id as pv_id,
      pv.slug as pv_slug

      FROM products p
      INNER JOIN products_variant pv ON p.id = pv.product_id
      WHERE p.slug = ?
      `,
      [slug],
    );

    const mapData = new Map<string, ProductModelInput>();

    for (const row of rows) {
      if (!mapData.has(row.pd_id)) {
        mapData.set(row.pd_id, {
          id: row.pd_id,
          name: "",
          slug: row.pd_slug,
          brand: "",
          product_varian: [],
        });
      }

      if (row.pd_id) {
        mapData.get(row.pd_id)?.product_varian.push({
          id: row.pv_id,
          name: row.pv_name,
          slug: row.pv_slug,
          images: [],
        });
      }
    }

    const value = Array.from(mapData.values());
    return value[0];
  } catch (error) {
    throw error;
  }
};

// getProductPageData
// Retrieves datails of a specific product variant from the db
export const getProductPageData = async (productSlug: string) => {
  // Retrieve product variant details from the db
  const product = await retrieveProductDetails(productSlug);

  if (!product) return;

  const userCountry = await getUserCountry();

  const productShippingDetails = await getShippingDetails(
    product.shippingFeeMethod,
    userCountry,
    product.store!,
    product.freeShipping,
  );

  // console.log(productShippingDetails)

  return { ...product, shippingDetails: productShippingDetails };
};

// helper funcitons
export const retrieveProductDetails = async (productSlug: string) => {
  // get Current user
  const user = await currentUser();

  const sql = `
     SELECT 
       ${productSqlColumn},
       ${categorySqlColumn},
       ${subCategorySqlColumn},
       ${storeSqlColumn},

     -- addition
     oft.id as oft_id,
     oft.name as oft_name,
     oft.url as oft_url,
     s.logo as store_logo,
     p.shipping_fee_method

     -- follows info
     
     
     FROM products p
     LEFT JOIN offer_tags oft ON p.offer_tag_id = oft.id
     INNER JOIN categories c ON p.category_id = c.id
     INNER JOIN sub_categories sc ON p.sub_category_id = sc.id
     INNER JOIN stores s ON p.store_id = s.id
     WHERE p.slug = ? 
     LIMIT 1
   `;

  const [rows] = await pool.query<RowDataPacket[]>(sql, [productSlug]);

  if (rows.length === 0) {
    throw new Error("Product not found");
  }

  // Query all variants for this product
  const [variantRows] = await pool.query<RowDataPacket[]>(
    `SELECT ${productVariantSqlColumn} FROM products_variant pv WHERE pv.product_id = ? AND pv.is_sale = 1 ORDER BY pv.id`,
    [rows[0].product_id],
  );

  // console.log(variantRows)

  if (variantRows.length === 0) {
    // throw new Error("No variants found for this product");
    return;
  }

  const variantIds = [...new Set(variantRows.map((row) => row.variant_id))];

  const productId = rows[0].product_id;

  // Query related data in parallel
  const [
    images,
    colors,
    sizes,
    variantSpecs,
    questions,
    productSpecs,
    follower,
    isUserFollowingStore,
    ratingStatistics,
    freeShipping,
    reviews,
  ] = await Promise.all([
    // prodcut variant images
    queryVariantImages(variantIds),
    // product colors
    queryVariantColors(variantIds),
    // prodcut sizes
    queryVariantSizes(variantIds),
    //  product specs
    queryVariantSpecs(variantIds[0]),
    // product qestion
    queryQuestions([productId]),
    queryProductSpecs(productId),
    // Fetch store followers
    queryFollowStoreCountByStoreId(rows[0].store_id),
    // user following store
    checkIfUserFollowingStore(rows[0].store_id, user?.id),
    // reviews rating
    getRatingStatistics(productId),
    // get free shipping
    queryFreeShipping(productId),
    // get prdouct reviews list
    queryReviewsProduct(productId),
  ]);

  // Map products data with ordered variants
  const products = mapProductsData(
    rows,
    images,
    colors,
    sizes,
    variantRows,
    freeShipping,
  );

  return {
    offerTag: {
      offer_tag_id: rows[0].oft_id as string,
      offer_tag_name: rows[0].oft_name as string,
      offer_tag_url: rows[0].oft_url as string,
    },
    productSpecs: productSpecs as ProductSpecsModel[],
    variantSpecs: variantSpecs as VariantSpecsModel[],
    questions: questions as QuestionsModel[],
    followersCount: follower,
    isUserFollowingStore,
    reviews: reviews,
    numReviews: 1000,
    reviewsStatistics: ratingStatistics,
    rating: ratingStatistics.rating,
    relatedProducts: [],
    products: products,
    freeShipping: products[0].free_shipping as FreeShippingModel,
    store: products[0].stores,
    shippingFeeMethod: rows[0].shipping_fee_method as string,
  };
};

const getUserCountry = async () => {
  const userCountryCookie = (await getCookie("userCountry", { cookies })) || "";
  const defaultCountry = { name: "United States", code: "US" };

  try {
    const parsedCountry = JSON.parse(userCountryCookie);
    if (
      parsedCountry &&
      typeof parsedCountry === "object" &&
      "name" in parsedCountry &&
      "code" in parsedCountry
    ) {
      return parsedCountry;
    }
    return defaultCountry;
  } catch (error) {
    console.log("Failed to parse userCountryCookie", error);
  }
};

// Retrieves and calculates shipping details based on user country and product.
export const getShippingDetails = async (
  shippingFeeMethod: string,
  userCountry: { name: string; code: string; city: string },
  store: StoreModelInput,
  freeShipping: FreeShippingModel,
) => {
  let shippingDetails = {
    shippingFeeMethod,
    shippingService: "",
    shippingFee: 0,
    extraShippingFee: 0,
    deliveryTimeMin: 0,
    deliveryTimeMax: 0,
    returnPolicy: "",
    countryCode: userCountry.code,
    countryName: userCountry.name,
    city: userCountry.city,
    isFreeShipping: false,
  };

  const [country] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM countries WHERE name = ? AND code = ? LIMIT 1",
    [userCountry.name, userCountry.code],
  );

  if (country.length !== 0) {
    // Retrieve shipping rate for the country
    const [shippingRate] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM shipping_rates WHERE country_id = ? AND store_id = ? LIMIT 1",
      [country[0].id, store.id],
    );

    const shipping = shippingRate[0] as ShippingRate;

    const returnPolicy = shipping?.return_policy || store.return_policy;
    const shippingService =
      shipping?.shipping_service || store.default_shipping_service;
    const shippingPerKg =
      shipping?.shipping_fee_per_kg || store.default_shipping_fee_per_kg;
    const shippingFeePerItem =
      shipping?.shipping_fee_per_item || store.default_shipping_fee_per_item;
    const shippingFeeForAdditionItem =
      shipping?.shipping_fee_additional_item ||
      store.default_shipping_fee_for_addional_item;
    const shippingFeeFixed =
      shipping?.shipping_fee_fixed || store.default_shipping_fee_fixed;
    const deliveryTimeMin =
      shipping?.delivery_time_min || store.default_delivery_time_min;
    const deliveryTimeMax =
      shipping?.delivery_time_max || store.default_delivery_time_max;

    // check for free shipping
    if (freeShipping) {
      const freeShippingCountries = freeShipping.free_shipping_country;
      const checkFreeShipping = freeShippingCountries?.find(
        (c) => c.country_id === country[0].id,
      );

      if (checkFreeShipping) {
        shippingDetails.isFreeShipping = true;
      }
    } else {
      shippingDetails = {
        shippingFeeMethod,
        shippingService: shippingService || "",
        shippingFee: 0,
        extraShippingFee: 0,
        deliveryTimeMin: deliveryTimeMin || 0,
        deliveryTimeMax: deliveryTimeMax || 0,
        returnPolicy: returnPolicy || "",
        countryCode: userCountry.code,
        countryName: userCountry.name,
        city: userCountry.city,
        isFreeShipping: shippingDetails.isFreeShipping,
      };

      const { isFreeShipping } = shippingDetails;
      switch (shippingFeeMethod) {
        case "ITEM":
          shippingDetails.shippingFee = isFreeShipping
            ? 0
            : shippingFeePerItem || 0;
          shippingDetails.extraShippingFee = isFreeShipping
            ? 0
            : shippingFeeForAdditionItem || 0;
          break;
        case "WEIGHT":
          shippingDetails.shippingFee = isFreeShipping ? 0 : shippingPerKg || 0;
          break;
        case "FIXED":
          shippingDetails.shippingFee = isFreeShipping
            ? 0
            : shippingFeeFixed || 0;
          break;

        default:
          break;
      }
    }

    // console.log("shippingDetails ", shippingDetails);

    return shippingDetails;
  }
  return false;
};

const queryFreeShipping = async (productId: string) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT 
        fs.id as fsp_id,
        fs.product_id,

        fsc.id as fspc_id,
        fsc.country_id
        FROM free_shippings fs
        LEFT JOIN free_shipping_countries fsc ON fsc.free_shipping_id = fs.id
        WHERE fs.product_id = ? LIMIT 1`,
      [productId],
    );

    if (rows.length === 0) return;

    return {
      id: rows[0].fsp_id as string,
      product_id: rows[0].product_id as string,
      free_shipping_country: [
        {
          id: rows[0].fspc_id as string,
          country_id: rows[0].country_id as string,
        },
      ],
    } as FreeShippingModel;
  } catch (error) {
    throw error;
  }
};

const checkIfUserFollowingStore = async (storeId: string, userId?: string) => {
  let isUserFollowingStore = false;

  if (userId) {
    const [storeFollowInfo] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM follows WHERE store_id = ? AND user_id = ? LIMIT 1",
      [storeId, userId],
    );

    if (storeFollowInfo.length !== 0) {
      isUserFollowingStore = true;
    }
  }

  return isUserFollowingStore;
};

type RatingRow = RowDataPacket & {
  rating: number;
  count: number;
  sum_rating: number;
};

export const getRatingStatistics = async (productId: string) => {
  const [rows] = await pool.query<RatingRow[]>(
    `SELECT rating, COUNT(*) as count, SUM(rating) as sum_rating FROM reviews WHERE product_id = ? GROUP BY rating ORDER BY rating ASC`,
    [productId],
  );

  const totalReviews = rows.reduce((sum, r) => sum + Number(r.count), 0);
  const sumRating = rows.reduce((sum, r) => sum + Number(r.sum_rating), 0);

  // index 0..4 = rating 1..5
  const ratingCounts = Array(5).fill(0);

  for (const r of rows) {
    const rating = Number(r.rating);
    const count = Number(r.count);

    if (rating >= 1 && rating <= 5) {
      ratingCounts[rating - 1] = count;
    }
  }

  const res = {
    ratingStatistics: ratingCounts.map((count, index) => ({
      rating: index + 1,
      numReviews: count as number,
      percentage:
        totalReviews > 0 ? Math.floor((count / totalReviews) * 100) : 0,
    })),
    reviewsWithImagesCount: 0,
    totalReviews,
    rating: sumRating / totalReviews,
  };

  // console.log(res);
  return res;
};

export const getProductFilteredReviews = async (
  productId: string,
  filters: { rating?: number; hasImages: boolean },
  sort: { orderBy: "latest" | "oldest" | "highest" } | undefined,
  page: number = 1,
  pageSize: number = 2,
) => {
  const reviewFilter: any = {
    productId,
  };

  // Apply rating  filter if provided

  if (filters.rating) {
    const rating = filters.rating;
    reviewFilter.rating = {
      in: [rating, rating + 0.5],
    };
  }

  // Apply image filter if provided
  if (filters.hasImages) {
    reviewFilter.images = {
      some: {},
    };
  }

  // Set sorting order using local SortOrder type
  const sortOption: { createdAt?: SortOrder; rating: SortOrder } =
    sort && sort.orderBy === "latest"
      ? { createdAt: "desc" }
      : sort && sort.orderBy == "oldest"
        ? { createdAt: "asc" }
        : { rating: "desc" };

  // Calculate pagination parameters
  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  // Fetch review from the db
  // join images, users
  const reviews = await pool.query("SELECT * FROM reviews WHERE order by sortOption")

  return reviews;

};
