import CategoryDetail from "@/components/dashboard/forms/category-details";
import DataTable from "@/components/ui/data-table";
import { getAllCategories } from "@/queries/category";
import { columns } from "./columns";

const AdminCategoriesPage = async () => {
  const categories = await getAllCategories();
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME;

  if (!cloudName) return null;

  if (!categories) return null;

  return (
    <DataTable
      heading="Details"
      searchPlaceholder="search category"
      filterValue="name"
      data={categories}
      actionButtonText="Create Ccategory"
      modalChildren={<CategoryDetail />}
      columns={columns}
    />
  );
};

export default AdminCategoriesPage;
