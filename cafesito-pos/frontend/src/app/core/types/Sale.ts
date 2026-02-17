import { z } from 'zod';

export const PaymentMethodSchema = z.enum(['cash', 'card', 'transfer']);
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;

export const SaleItemRequestSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1),
});
export type SaleItemRequest = z.infer<typeof SaleItemRequestSchema>;

export const CreateSaleRequestSchema = z.object({
  customerId: z.string().min(1).optional(),
  paymentMethod: PaymentMethodSchema.optional(),
  items: z.array(SaleItemRequestSchema).min(1),
});
export type CreateSaleRequest = z.infer<typeof CreateSaleRequestSchema>;

// Response
export const SaleItemResponseSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  quantity: z.number().int(),
  unitPrice: z.number(),
  lineTotal: z.number(),
});

export const TicketItemSchema = z.object({
  name: z.string(),
  qty: z.number().int(),
  unitPrice: z.number(),
  lineTotal: z.number(),
});

export const TicketSchema = z.object({
  saleId: z.string(),
  timestamp: z.string(),
  storeName: z.string(),
  items: z.array(TicketItemSchema),
  subtotal: z.number(),
  discount: z.string(),
  total: z.number(),
  paymentMethod: PaymentMethodSchema,
});

export const SaleResponseSchema = z.object({
  saleId: z.string(),
  customerId: z.string().nullable(),
  paymentMethod: PaymentMethodSchema,
  items: z.array(SaleItemResponseSchema),
  subtotal: z.number(),
  discountPercent: z.number(),
  discountAmount: z.number(),
  total: z.number(),
  ticket: TicketSchema,
  createdAt: z.string(),
});

export type SaleResponse = z.infer<typeof SaleResponseSchema>;