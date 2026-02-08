import { z } from 'zod';

export const RoleSchema = z.enum(['admin', 'seller', 'customer']);
export type Role = z.infer<typeof RoleSchema>;

export const LoginRequestSchema = z.object({
  phoneOrEmail: z.string().min(3),
  password: z.string().min(4),
});
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const LoginResponseSchema = z.object({
  token: z.string().min(1),
  refreshToken: z.string().min(1),
  role: RoleSchema, 
});
export type LoginResponse = z.infer<typeof LoginResponseSchema>;

export const RegisterRequestSchema = z.object({
  name: z.string().min(2),
  phoneOrEmail: z.string().min(3),
  password: z.string().min(4),
});
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;

export const ExistsResponseSchema = z.object({
  exists: z.boolean(),
});
export type ExistsResponse = z.infer<typeof ExistsResponseSchema>;