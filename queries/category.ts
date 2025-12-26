"use server";

import {
  CategoryInput,
  CategoryModel,
  CategoryResultModel,
} from "./../models/category-model";
import { pool } from "@/lib/config/db";
import { currentUser } from "@clerk/nextjs/server";

export const upsertCategory = async (category: CategoryInput) => {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    // verify admin permissions
    if (user.privateMetadata.role !== "ADMIN")
      throw new Error("Unauthorized Access");

    // Ensure category data is provided
    const [existingCategory] = await pool.query<CategoryModel[]>(
      "SELECT id FROM categories WHERE name = ? AND url = ? AND id != ? LIMIT 1",
      [category.name, category.url, category.id || 0]
    );

    if (
      Array.isArray(existingCategory) &&
      existingCategory.length > 0 &&
      existingCategory[0].url === category.url
    ) {
      throw new Error("Category with the same name and URL already exists.");
    }

    if (category.id) {
      // update existing category
      const [result] = await pool.query<CategoryResultModel>(
        "UPDATE categories SET name = ?, image = ?, url = ?, featured = ?, updated_at = NOW() WHERE id = ?",
        [
          category.name,
          category.image,
          category.url,
          category.featured,
          category.id,
        ]
      );
      return { ...result };
    } else {
      // insert new category
      const [result] = await pool.query<CategoryResultModel>(
        "INSERT INTO categories (name, image,url, featured) VALUES (?,?,?,?)",
        [category.name, category.image, category.url, category.featured]
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
  const [categories] = await pool.query<CategoryModel[]>(
    "SELECT * FROM categories ORDER BY updated_at DESC"
  );
  return categories;
};

export const getCategory = async (categoryId: string) => {
  if (!categoryId) throw new Error("Please provide category ID");
  const [category] = await pool.query<CategoryModel[]>(
    "SELECT * FROM categories WHERE id = ?",
    [categoryId]
  );

  return category[0];
};

export const deleteCategory = async (categoryId: string) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorization");

  if (user.privateMetadata.role !== "ADMIN")
    throw new Error("Unathorized Access");

  if (!categoryId) throw new Error("Please provide category ID");

  const [result] = await pool.query<CategoryResultModel>(
    "DELETE FROM categories WHERE id = ?",
    [categoryId]
  );
  return { ...result };
};
