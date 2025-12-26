"use server";

import {
  SubCategoryModel,
  SubCategoryResultModel,
} from "./../models/sub-category-model";
import { pool } from "@/lib/config/db";
import { CategoryModel } from "@/models/category-model";
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

export const getAllCategories = async () => {
  const [subCategories] = await pool.query<CategoryModel[]>(
    "SELECT * FROM sub_categories ORDER BY updated_at DESC"
  );
  return subCategories;
};

export const getCategory = async (subCategoryId: string) => {
  if (!subCategoryId) throw new Error("Please provide category ID");
  const [subCategory] = await pool.query<CategoryModel[]>(
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
