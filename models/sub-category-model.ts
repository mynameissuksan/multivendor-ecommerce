import { ResultSetHeader, RowDataPacket } from "mysql2";

export interface SubCategoryModel extends RowDataPacket {
  id: string;
  name?: string;
  image: string;
  url?: string;
  featured?: boolean;
  updatedAt?: Date;
  categoryId: string;
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
  id?: string;
  name: string;
  image: string;
  url: string;
  featured: boolean;
  categoryId: string;
}
