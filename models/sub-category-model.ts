import { ResultSetHeader, RowDataPacket } from "mysql2";
import { CategoryInput, CategoryModel } from "./category-model";

export interface SubCategoryModel extends RowDataPacket {
  id: string;
  name?: string;
  image: string;
  url?: string;
  featured?: boolean;
  categoryId: string;
  category?: CategoryModel;
}

export interface GetAllSubCategoriesModel extends RowDataPacket {
  subId: string;
  subName: string;
  subImage: string;
  subUrl: string;
  subFeatured: number;
  categoryId: string;

  catId: string;
  catName: string;
  catImage: string;
  catUrl: string;
  catFeatured: number;
}

// json sub categories and categories in floler queries
export interface NestedSubCategories {
  id: string;
  name: string;
  image: string;
  url: string;
  featured: boolean;
  categoryId: string;
  category: {
    id: string;
    name: string;
    image: string;
    url: string;
    featured: boolean;
  };
}

export interface SubCategoryResultModel extends ResultSetHeader {
  id?: string;
  name?: string;
  image?: string;
  url?: string;
  featured?: boolean;
  categoryId: string;
}

// สำหรับ input เมื่อสร้างหรืออัพเดท sub category
export interface SubCategoryInput {
  id: string;
  name: string;
  image: string;
  url: string;
  featured: boolean;
  categoryId: string;
  category?: CategoryInput;
}
