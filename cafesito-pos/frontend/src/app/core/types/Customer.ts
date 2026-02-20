import z from 'zod';

export const RoleSchema = z.enum(['customer', 'admin', 'seller']);

export const CustomerSchema = z.object({
    id: z.string(),
    name: z.string(),
    phoneOrEmail: z.string(),
    purchasesCount: z.number().int().nonnegative(),
    role: RoleSchema.optional(), 
    timestamp: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

export const customerArraySchema = z.array(CustomerSchema);

export type Customer = z.infer<typeof CustomerSchema>;

export type CustomerCredentials = Pick<Customer, 'phoneOrEmail'> & { password: string };
export type CustomerForm = Pick<Customer,
 'name' > & { phoneOrEmail: string };

 export const CustomerLookResponseSchema = z.object({
    found: z.boolean(),
    customer:CustomerSchema.optional(),
 });

export type CustomerLookResponse = z.infer<typeof CustomerLookResponseSchema>;