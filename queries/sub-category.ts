"use server";

import {
  GetAllSubCategoriesModel,
  SubCategoryModel,
  SubCategoryResultModel,
} from "./../models/sub-category-model";
import { pool } from "@/lib/config/db";
import { SubCategoryInput } from "@/models/sub-category-model";
import { currentUser } from "@clerk/nextjs/server";

export const upsertSubCategory = async (subCategory: SubCategoryInput) => {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    // verify admin permissions
    if (user.privateMetadata.role !== "ADMIN")
      throw new Error("Unauthorized Access");

    // Ensure category data is provided
    const [existingSubCategory] = await pool.query<SubCategoryModel[]>(
      "SELECT id FROM sub_categories WHERE name = ? AND url = ? AND id != ? LIMIT 1",
      [subCategory.name, subCategory.url, subCategory.id || 0]
    );

    if (
      Array.isArray(existingSubCategory) &&
      existingSubCategory.length > 0 &&
      existingSubCategory[0].url === subCategory.url
    ) {
      throw new Error(
        "Sub Category with the same name and URL already exists."
      );
    }

    if (subCategory.id) {
      // update existing category
      const [result] = await pool.query<SubCategoryResultModel>(
        "UPDATE sub_categories SET name = ?, image = ?, url = ?, featured = ?, updated_at = NOW() WHERE id = ?",
        [
          subCategory.name,
          subCategory.image,
          subCategory.url,
          subCategory.featured,
          subCategory.id,
        ]
      );
      return { ...result };
    } else {
      // insert new category
      const [result] = await pool.query<SubCategoryResultModel>(
        "INSERT INTO sub_categories (name, image,url, featured, category_id) VALUES (?,?,?,?,?)",
        [
          subCategory.name,
          subCategory.image,
          subCategory.url,
          subCategory.featured,
          subCategory.categoryId,
        ]
      );

      return { ...result };
    }
  } catch (error) {
    console.error("error ", error);
    throw new Error(
      error instanceof Error ? error.message : "An error occurred"
    );
  }
};

export const getAllSubCategories = async () => {
  const [subCategories] = await pool.query<GetAllSubCategoriesModel[]>(
    `SELECT
      sub_categories.id            AS subId,
      sub_categories.name          AS subName,
      sub_categories.image         AS subImage,
      sub_categories.url           AS subUrl,
      sub_categories.featured      AS subFeatured,
      sub_categories.category_id   AS categoryId,

      categories.id                AS catId,
      categories.name              AS catName,
      categories.image             AS catImage,
      categories.url               AS catUrl,
      categories.featured          AS catFeatured

      FROM sub_categories
      INNER JOIN categories
        ON categories.id = sub_categories.category_id
      ORDER BY sub_categories.updated_at DESC;
`
  );
  const result = subCategories.map((row) => ({
    id: row.subId,
    name: row.subName,
    image: row.subImage,
    url: row.subUrl,
    featured: !!row.subFeatured,
    categoryId: row.categoryId,
    category: {
      id: row.catId,
      name: row.catName,
      image: row.catImage,
      url: row.catUrl,
      featured: !!row.catfe,
    },
  }));
  return result;
};

export const getSubCategory = async (subCategoryId: string) => {
  if (!subCategoryId) throw new Error("Please provide sub category ID");
  const [subCategory] = await pool.query<SubCategoryModel[]>(
    "SELECT * FROM sub_categories WHERE id = ?",
    [subCategoryId]
  );

  return subCategory[0];
};

export const deleteSubCategory = async (subCategoryId: string) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorization");

  if (user.privateMetadata.role !== "ADMIN")
    throw new Error("Unathorized Access");

  if (!subCategoryId) throw new Error("Please provide sub category ID");

  const [result] = await pool.query<SubCategoryResultModel>(
    "DELETE FROM sub_categories WHERE id = ?",
    [subCategoryId]
  );
  return { ...result };
};
