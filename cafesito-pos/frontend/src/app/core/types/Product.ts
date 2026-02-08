import { z } from 'zod';

export const ProductSchema = z.object({
  _id: z.string(),
  name: z.string().min(2).max(100),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Product = z.infer<typeof ProductSchema>;
export const ProductArraySchema = z.array(ProductSchema);
