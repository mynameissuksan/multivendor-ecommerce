"use server";

import { pool } from "@/lib/config/db";
import { ReviewDetailsType } from "@/lib/types";
import { currentUser } from "@clerk/nextjs/server";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { randomUUID } from "crypto";
import { ReviewModelInput } from "@/models/review-model";

export const upsertReview = async (
  productId: string,
  review: ReviewDetailsType,
) => {
  const conn = await pool.getConnection();
  const randomReviewId = randomUUID();

  try {
    await conn.beginTransaction();

    const user = await currentUser();

    if (!user) throw new Error("Unauthorized.");

    if (!productId) throw new Error("Product ID is required.");
    if (!review) throw new Error("Please provide review data.");

    // check for existing review
    // const [existingReview] = await pool.query<RowDataPacket[]>(
    //   "SELECT id FROM reviews WHERE user_id = ? AND product_id = ? LIMIT 1",
    //   [user.id, productId],
    // );

    // if(existingReview.length > 0) {
    // update review
    // }

    // upsert review into the db
    const placeholders = new Array(9).fill("?").join(",");
    const params = [
      // adapt these fields to match ReviewDetailsType
      randomReviewId,
      review.variant ?? null,
      review.review ?? null,
      review.rating ?? null,
      review.color ?? null,
      review.size ?? null,
      review.quantity ?? null,
      user.id,
      productId,
    ];

    await conn.query<ResultSetHeader>(
      `INSERT INTO reviews (id, variant, review, rating, color, size, quantity, user_id, product_id) VALUES (${placeholders})`,
      params,
    );

    if (review.images.length > 0) {
      const placeholdersImgReview = new Array(3).fill("?").join(",");

      for (let i = 0; i < review.images.length; i++) {
        const image = review.images[i];

        await conn.query<ResultSetHeader>(
          `INSERT INTO review_images (url, alt, review_id) VALUES (${placeholdersImgReview}) `,
          [image.url, "alt", randomReviewId],
        );
      }
    }

    const [productReviews] = await pool.query<RowDataPacket[]>(
      "SELECT rating FROM reviews WHERE product_id = ?",
      [productId],
    );

    // Calculate rating
    const ratings = productReviews
      .map((r) => Number(r.rating))
      .filter((n) => Number.isFinite(n));

    const averageRating =
      ratings.length > 0
        ? Number(
            (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1),
          )
        : 0;

    // update the product rating
    await conn.query<ResultSetHeader>(
      `UPDATE products SET rating = ?, num_reviews = ? WHERE id = ?`,
      [averageRating, productReviews.length, productId],
    );

    await conn.commit();

    const [reviewData] = await pool.query<RowDataPacket[]>(
      `SELECT 
       reviews.*,
       u.id as user_id,
       u.name as user_name,
       u.picture

       FROM reviews 
       INNER JOIN users u ON reviews.user_id = u.id
       WHERE user_id = ? AND product_id = ? 
       ORDER BY created_at DESC LIMIT 1`,
      [user.id, productId],
    );

    return {
      ok: true,
      data: {
        id: reviewData[0].id,
        review: reviewData[0].review,
        variant: reviewData[0].variant,
        rating: reviewData[0].rating,
        color: reviewData[0].color,
        size: reviewData[0].size,
        quantity: reviewData[0].quantity,
        user: {
          id: reviewData[0].user_id,
          name: reviewData[0].user_name,
          picture: reviewData[0].picture,
        },
      } as ReviewModelInput,
    };
  } catch (error) {
    await conn.rollback();
    console.log(error);
    throw error;
  } finally {
    conn.release();
  }
};
