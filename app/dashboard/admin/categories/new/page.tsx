import CategoryDetail from "@/components/dashboard/forms/category-details";
import React from "react";

const AdminNewCategoriesPage = () => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME;
  if (!cloudName) return null;

  return (
    <div className="w-full">
      <CategoryDetail />
    </div>
  );
};

export default AdminNewCategoriesPage;
