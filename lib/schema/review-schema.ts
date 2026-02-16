import * as z from "zod";

// Add review schema
export const AddReviewSchema = z.object({
  variantName: z.string().min(1, "Variant is required."),
  rating: z.number().min(1, "Please rate this product."),
  size: z.string().min(1, "Please select a size."), // Ensures size cannot be empty
  review: z
    .string()
    .min(
      10,
      "Your feedback matters! Please write a review of minimum 10 characters.",
    ), // Ensures review cannot be empty
  quantity: z.string().default("1"),
  images: z
    .object({ url: z.string() })
    .array()
    .max(3, "You can upload up to 3 images for the review."),
  color: z.string({ message: "Color is required." }),
});
