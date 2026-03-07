import * as z from "zod";

export const ShippingAddressSchema = z.object({
  countryId: z
    .string({
      message: "Country must be a valid string.",
    })
    .optional(),
  firstName: z
    .string({
      message: "First name must be a valid string.",
    })
    .min(2, { message: "First name should be at least 2 characters long." })
    .max(50, { message: "First name cannot exceed 50 characters." })
    .regex(/^[a-zA-Z]+$/, {
      message: "No special characters are allowed in name.",
    }),

  lastName: z
    .string({
      message: "Last name must be a valid string.",
    })
    .min(2, { message: "Last name should be at least 2 characters long." })
    .max(50, { message: "Last name cannot exceed 50 characters." })
    .regex(/^[a-zA-Z]+$/, {
      message: "No special characters are allowed in name.",
    }),
  phone: z
    .string({
      message: "Phone number must be a string",
    })
    .regex(/^\+?\d+$/, { message: "Invalid phone number format." }),

  address1: z
    .string({
      message: "Address line 1 must be a valid string.",
    })
    .min(5, { message: "Address line 1 should be at least 5 characters long." })
    .max(100, { message: "Address line 1 cannot exceed 100 characters." }),

  address2: z
    .string({
      message: "Address line 2 must be a valid string.",
    })
    .max(100, { message: "Address line 2 cannot exceed 100 characters." })
    .optional(),

  state: z
    .string({
      message: "State must be a valid string.",
    })
    .min(2, { message: "State should be at least 2 characters long." })
    .max(50, { message: "State cannot exceed 50 characters." }),

  city: z
    .string({
      message: "City must be a valid string.",
    })
    .min(2, { message: "City should be at least 2 characters long." })
    .max(50, { message: "City cannot exceed 50 characters." }),

  zip_code: z
    .string({
      message: "Zip code must be a valid string.",
    })
    .min(2, { message: "Zip code should be at least 2 characters long." })
    .max(10, { message: "Zip code cannot exceed 10 characters." }),

  default: z.boolean().default(false),
});
