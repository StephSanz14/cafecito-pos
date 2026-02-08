import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.string(),                 // tu backend manda "id"
  name: z.string().min(2).max(100),
  price: z.number(),
  stock: z.number(),
  createdAt: z.union([z.string(), z.date()]).optional(),
  updatedAt: z.union([z.string(), z.date()]).optional(),
});

export type Product = z.infer<typeof ProductSchema>;

export const ProductsListResponseSchema = z.object({
  data: z.array(ProductSchema),
  total: z.number().int().min(0),
  page: z.number().int().min(1),
  limit: z.number().int().min(1).max(100),
  message: z.string().optional(),
});

export type ProductsListResponse = z.infer<typeof ProductsListResponseSchema>;