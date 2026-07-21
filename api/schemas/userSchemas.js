import { z } from 'zod';

export const updateOwnUserSchema = z.object({
  body: z.object({
    first_name: z.string().min(1).max(100).optional(),
    last_name: z.string().min(1).max(100).optional(),
    email: z.string().email('Invalid email address').optional(),
    phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits').optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});