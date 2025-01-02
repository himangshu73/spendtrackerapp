"use client";

import { z } from "zod";

export const itemSchema = z.object({
  itemname: z
    .string()
    .min(2, { message: "Item Name must be at least 2 characters." })
    .max(50, { message: "Item name must not be more than 50 characters." }),
  quantity: z
    .string()
    .transform((value) => Number(value))
    .refine((value) => !isNaN(value) && value > 0, {
      message: "Quantity must be a positive number",
    }),
  price: z
    .string()
    .transform((value) => Number(value))
    .refine((value) => !isNaN(value) && value > 0, {
      message: "Price must be a positive number.",
    }),
  unit: z.enum(["kg", "ltr", "pc"], {
    errorMap: () => ({ message: "Unit must be one of: kg, ltr, pc." }),
  }),
});
