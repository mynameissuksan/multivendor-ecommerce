import { UserModel } from "./user-model";

export interface ReviewModelInput {
  id: string;
  review_image: ReviewImageModel[];
  user: UserModel;
  variant: string;
  review: string;
  rating: number;
  color: string;
  size: string;
  quantity: number;
  likes: number;
  user_id?: string;
  product_id?: string;
  created_at?: string;
  updated_at?: string;
}

interface ReviewImageModel {
  id: string;
  url: string;
  alt: string;
  review_id: string;
  created_at?: string;
  updated_at?: string;
}
