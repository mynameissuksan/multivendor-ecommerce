import { RowDataPacket } from "mysql2";

export interface StoreModel extends RowDataPacket {
  id: string;
  userId: string;
  name: string;
  description: string;
  email: string;
  phone: string;
  url: string;
  cover: string;
  logo: string;
  status: string;
  averageRating: number;
  featured: boolean;
  returnPolicy: string;
  defaultShippingService: string;
  defaultShippingFees: string;
  defaultDeliveryTimeMin: number;
  defaultDeliveryTimeXax: number;
  createdAt: string;
  updatedAt: string;
}
