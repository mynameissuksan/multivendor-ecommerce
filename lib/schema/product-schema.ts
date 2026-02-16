import { SHIPPING_FEE_MOETHOD } from "@/models/product-model";
import * as z from "zod";

// Product schema
export const ProductFormSchema = z.object({
  name: z
    .string({
      message: "Product name must be a valid text.",
    })
    .min(2, { message: "Product name should be at least 2 characters long." })
    .max(200, { message: "Product name cannot exceed 200 characters." }),
  description: z
    .string({
      message: "Product description must be a valid text.",
    })
    .min(30, {
      message: "Product description should be at least 30 characters long.",
    }),
  variantName: z
    .string({
      message: "Product variant name must be a valid text.",
    })
    .min(2, {
      message: "Product variant name should be at least 2 characters long.",
    })
    .max(100, { message: "Product variant name cannot exceed 100 characters." })
    .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_ -]+$/, {
      message:
        "Product variant name may only contain letters, numbers, spaces, hyphens, and underscores, without consecutive special characters.",
    }),
  variantDescription: z
    .string({
      message: "Product variant description must be a valid text.",
    })
    .optional(),
  images: z
    .object({ url: z.string() })
    .array()
    .min(3, "Please upload at least 3 images for the product.")
    .max(6, "You can upload up to 6 images for the product."),
  variantImage: z
    .object({ url: z.string() })
    .array()
    .length(1, { message: "Choose a product variant image." }),
  categoryId: z
    .string({
      message: "Product category ID must be a valid UUID.",
    })
    .uuid(),
  subCategoryId: z
    .string({
      message: "Product sub-category ID must be a valid UUID.",
    })
    .uuid(),

  brand: z
    .string({
      message: "Product brand must be a valid text.",
    })
    .min(2, {
      message: "Product brand should be at least 2 characters long.",
    })
    .max(50, {
      message: "Product brand cannot exceed 50 characters.",
    }),
  sku: z
    .string({
      message: "Product SKU must be a valid text.",
    })
    .min(6, {
      message: "Product SKU should be at least 6 characters long.",
    })
    .max(50, {
      message: "Product SKU cannot exceed 50 characters.",
    }),
  keywords: z
    .string({
      message: "Keywords must be valid text.",
    })
    .array()
    .min(5, {
      message: "Please provide at least 5 keywords.",
    })
    .max(10, {
      message: "You can provide up to 10 keywords.",
    }),
  colors: z
    .object({ color: z.string() })
    .array()
    .min(1, "Please provide at least one color.")
    .refine((colors) => colors.every((c) => c.color.length > 0), {
      message: "All color inputs must be filled.",
    }),
  sizes: z
    .object({
      size: z.string(),
      quantity: z
        .number()
        .min(1, { message: "Quantity must be greater than 0." }),
      price: z.number().min(0.01, { message: "Price must be greater than 0." }),
      discount: z.number().min(0),
    })
    .array()
    .min(1, "Please provide at least one size.")
    .refine(
      (sizes) =>
        sizes.every((s) => s.size.length > 0 && s.price > 0 && s.quantity > 0),
      {
        message: "All size inputs must be filled correctly.",
      },
    ),
  product_specs: z
    .object({
      name: z.string(),
      value: z.string(),
    })
    .array()
    .min(1, {
      message: "Please provide at least one product spac.",
    })
    .refine((ps) => ps.every((s) => s.name.length > 0 && s.value.length > 0), {
      message: "All product specs inputs must be filled correctly.",
    }),
  variant_specs: z
    .object({
      name: z.string(),
      value: z.string(),
    })
    .array()
    .min(1, {
      message: "Please provide at least one variant spac.",
    })
    .refine((vs) => vs.every((s) => s.name.length > 0 && s.value.length > 0), {
      message: "All variant specs inputs must be filled correctly.",
    }),
  isSale: z.boolean().default(false).optional(),
  saleEndDate: z.string().optional(),
  weight: z.number().min(0.01, {
    message: "Please provide a valid product weight.",
  }),
  questions: z
    .array(
      z.object({
        question: z.string().optional(),
        answer: z.string().optional(),
      }),
    )
    .optional(),
  freeShippingForAllCountries: z.boolean().default(false),
  freeShippingCountriesIds: z
    .object({
      id: z.string().optional(),
      label: z.string(),
      value: z.string(),
    })
    .array()
    .optional()
    .refine(
      (ids) => ids?.every((item) => item.label && item.value),
      "Each country must have a valid name and ID.",
    )
    .default([]),
  shippingFeeMethod: z.enum(SHIPPING_FEE_MOETHOD),
});
