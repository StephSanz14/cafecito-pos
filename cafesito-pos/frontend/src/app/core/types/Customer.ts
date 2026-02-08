import z from 'zod';

export const CustomerSchema = z.object({
    id: z.string(),
    name: z.string(),
    phoneOrEmail: z.string(),
    purchasesCount: z.number().int().nonnegative(),
    role: z.enum(['customer', 'admin', 'seller']),
    timestamp: z.string(),
});

export const customerArraySchema = z.array(CustomerSchema);

export type Customer = z.infer<typeof CustomerSchema>;

export type CustomerCredentials = Pick<Customer, 'phoneOrEmail'> & { password: string };
export type CustomerForm = Pick<Customer,
 'name' > & { phoneOremail: string };