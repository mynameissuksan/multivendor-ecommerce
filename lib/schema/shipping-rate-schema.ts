import * as z from "zod";

export const ShippingRateFormSchema = z.object({
  shippingService: z
    .string({
      message: "Shipping service name is required.",
    })
    .min(2, {
      message: "Shipping service name must be at least 2 characters long.",
    })
    .max(50, { message: "Shipping service name cannot exceed 50 characters." }),
  countryId: z.string().uuid().optional(),
  countryName: z.string().optional(),
  shippingFeePerItem: z.coerce.number(),
  shippingFeeForAdditionalItem: z.coerce.number(),
  shippingFeePerKg: z.coerce.number(),
  shippingFeeFixed: z.coerce.number(),
  deliveryTimeMin: z.coerce.number(),
  deliveryTimeMax: z.coerce.number(),
  returnPolicy: z.coerce.string().min(1, "Return policy is required."),
});
