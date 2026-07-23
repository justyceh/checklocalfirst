import { z } from 'zod';

export const signupUserSchema = z.object({
  body: z.object({
    firstname: z.string().min(1, 'First name is required').max(100),
    lastname: z.string().min(1, 'Last name is required').max(100),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits').optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const signupBusinessSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Business name is required').max(100),
    description: z.string().optional(),
    address: z.string().min(1, 'Address is required'),
    email: z.string().email('Invalid business email'),
    phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
    state: z.string().length(2, 'State must be a 2-letter code'),
    city: z.string().min(1, 'City is required'),
    zip: z.string().regex(/^\d{5}$/, 'Zip must be 5 digits'),
    firstname: z.string().min(1, 'First name is required').max(100),
    lastname: z.string().min(1, 'Last name is required').max(100),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const adminCreateUserSchema = z.object({
  body: z.object({
    firstname: z.string().min(1).max(100),
    lastname: z.string().min(1).max(100),
    email: z.string().email(),
    password: z.string().min(8),
    phone: z.string().regex(/^\d{10}$/).optional(),
  }),
  params: z.object({
    account_type: z.enum(['user', 'admin', 'business'], {
      errorMap: () => ({ message: 'account_type must be user, admin, or business' }),
    }),
  }),
  query: z.object({}).optional(),
});
export const adminCreateComppedUserSchema = z.object({
  body: z.object({
    firstname: z.string().min(1).max(100),
    lastname: z.string().min(1).max(100),
    email: z.string().email(),
    password: z.string().min(8),
    phone: z.string().regex(/^\d{10}$/).optional(),
    is_premium: z.boolean().optional().default(false),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const adminCreateComppedBusinessSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100),
    description: z.string().optional(),
    address: z.string().min(1),
    email: z.string().email(),
    phone: z.string().regex(/^\d{10}$/),
    state: z.string().length(2),
    city: z.string().min(1),
    zip: z.string().regex(/^\d{5}$/),
    firstname: z.string().min(1).max(100),
    lastname: z.string().min(1).max(100),
    password: z.string().min(8),
    business_tier: z.enum(['basic', 'premium']).optional().default('basic'),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});