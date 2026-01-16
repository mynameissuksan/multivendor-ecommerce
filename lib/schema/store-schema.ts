import * as z from "zod";

export const StoreShippingSchema = z.object({
  returnPolicy: z.string().optional().default(""),
  defaultShippingService: z.string().optional().default(""),
  // เปลี่ยนจาก z.number({message: "..."}) เป็น z.number().min(0)
  defaultShippingFeePerItem: z.coerce
    .number()
    .min(0, "Must be 0 or greater")
    .default(0),
  defaultShippingFeeForAdditionalItem: z.coerce
    .number()
    .min(0, "Must be 0 or greater")
    .default(0),
  defaultShippingFeePerKg: z.coerce
    .number()
    .min(0, "Must be 0 or greater")
    .default(0),
  defaultShippingFeeFixed: z.coerce
    .number()
    .int()
    .min(0, "Must be 0 or greater")
    .default(0),
  defaultDeliveryTimeMin: z.coerce
    .number()
    .int()
    .min(1, "Must be at least 1")
    .default(1),
  defaultDeliveryTimeMax: z.coerce
    .number()
    .int()
    .min(1, "Must be at least 1")
    .default(1),
});
