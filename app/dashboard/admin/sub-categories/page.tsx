import SubCategoryDetail from "@/components/dashboard/forms/sub-category-details";
import DataTable from "@/components/ui/data-table";
import { getAllCategories } from "@/queries/category";
import { getAllSubCategories } from "@/queries/sub-category";
import { columns } from "./columns";

const SubCategories = async () => {
  const subCategories = await getAllSubCategories();
  if (!subCategories) return null;

  const categories = await getAllCategories();

  return (
    <DataTable
      actionButtonText={<>Create subcategory</>}
      modalChildren={<SubCategoryDetail categories={categories} />}
      filterValue="name"
      data={subCategories}
      searchPlaceholder="Search sub category name ..."
      columns={columns}
      newTabLink="/dashboard/admin/sub-categories/new"
    />
  );
};

export default SubCategories;
