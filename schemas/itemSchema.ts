"use client";

import { z } from "zod";

export const itemSchema = z.object({
  _id: z.string(),
  itemname: z
    .string()
    .min(2, { message: "Item Name must be at least 2 characters." })
    .max(20, { message: "Item name must not be more than 20 characters." }),
  category: z
    .string()
    .min(2, { message: "Category must be at least 2 characters." })
    .max(15, { message: "Category must not be more than 15 characters." }),
  quantity: z.number().positive({ message: "Quantity must be greater than 0" }),
  price: z.number().positive({ message: "Price must be greater than 0" }),
  unit: z.enum(["kg", "ltr", "pc"], {
    errorMap: () => ({ message: "Unit must be one of: kg, ltr, pc." }),
  }),
});
