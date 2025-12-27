import * as z from "zod";

// category form schema
export const CategoryFormSchema = z.object({
  name: z.string().min(2).max(50),

  image: z
    .object({
      url: z.string(),
    })
    .array()
    .length(1, "Choose a category image."),
  url: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Use lowercase letters, numbers and hyphens only",
    }),
  featured: z.boolean(),
});

// sub category form schema
export const SubCategoryFormSchema = z.object({
  name: z.string().min(2).max(50),

  image: z
    .object({
      url: z.string(),
    })
    .array()
    .length(1, "Choose a category image."),
  url: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Use lowercase letters, numbers and hyphens only",
    }),
  featured: z.boolean(),
  categoryId: z.string(),
});

// Store schema
export const StoreFormSchema = z.object({
  name: z
    .string({
      error: "Store name is required",
    })
    .min(2, { error: "Store name must be at least 2 characters long." })
    .max(50, { error: "Store name cannot exceed 50 characters." })
    .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_ -]+$/, {
      error:
        "Only letters, numbers, space, hyphen, and underscore are allowed in the store name, and consecutive occurrences of hyphens, underscores, or spaces are not permitted.",
    }),
  description: z
    .string({
      error: "Store description is required",
    })
    .min(30, {
      error: "Store description must be at least 30 characters long.",
    })
    .max(500, { error: "Store description cannot exceed 500 characters." }),
  email: z
    .string({
      error: "Store email is required",
    })
    .email({ error: "Invalid email format." }),
  phone: z
    .string({
      error: "Store phone number is required",
    })
    .regex(/^\+?\d+$/, { error: "Invalid phone number format." }),
  logo: z.object({ url: z.string() }).array().length(1, "Choose a logo image."),
  cover: z
    .object({ url: z.string() })
    .array()
    .length(1, "Choose a cover image."),
  url: z
    .string({
      error: "Store url is required",
    })
    .min(2, { error: "Store url must be at least 2 characters long." })
    .max(50, { error: "Store url cannot exceed 50 characters." })
    .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_-]+$/, {
      error:
        "Only letters, numbers, hyphen, and underscore are allowed in the store url, and consecutive occurrences of hyphens, underscores, or spaces are not permitted.",
    }),
  featured: z.boolean().default(false).optional(),
  status: z.string().default("PENDING").optional(),
});
