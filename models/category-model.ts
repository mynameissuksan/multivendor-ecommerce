import { ResultSetHeader, RowDataPacket } from "mysql2";

export interface CategoryModel extends RowDataPacket {
  id: string;
  name?: string;
  image: string;
  url?: string;
  featured?: boolean;
}

export interface CategoryResultModel extends ResultSetHeader {
  id?: string;
  name?: string;
  image?: string;
  url?: string;
  featured?: boolean;
}

// สำหรับ input เมื่อสร้างหรืออัพเดท category
export interface CategoryInput {
  id?: string;
  name: string;
  image: string;
  url: string;
  featured: boolean;
}
