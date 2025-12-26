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
