import SubCategoryDetail from "@/components/dashboard/forms/sub-category-details";
import { getAllCategories } from "@/queries/category";
import React from "react";

const AdminNewSubCategoryPage = async () => {
  const categories = await getAllCategories();
  return <SubCategoryDetail categories={categories} />;
};

export default AdminNewSubCategoryPage;
