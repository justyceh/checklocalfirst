import { z } from 'zod';

const slugParam = z.string().min(1, 'Invalid business slug');

export const businessSlugParamSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({
    slug: slugParam,
  }),
});

export const updateBusinessSchema = z.object({
  query: z.object({}).optional(),
  params: z.object({
    slug: slugParam,
  }),
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().optional(),
    address: z.string().max(255).optional(),
    city: z.string().max(100).optional(),
    state: z.string().length(2, 'State must be a 2-letter code').optional(),
    zip: z.string().regex(/^\d{5}$/, 'Zip must be 5 digits').optional(),
    phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits').optional(),
    email: z.string().email('Invalid email address').optional(),
  }),
});

export const createServiceSchema = z.object({
  query: z.object({}).optional(),
  params: z.object({
    slug: slugParam,
  }),
  body: z.object({
    name: z.string().min(1, 'Service name is required').max(100),
    description: z.string().optional(),
    category_id: z.coerce.number().int().positive('category_id is required'),
  }),
});

export const updateServiceSchema = z.object({
  query: z.object({}).optional(),
  params: z.object({
    slug: slugParam,
    id: z.coerce.number().int().positive('Invalid service id'),
  }),
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().optional(),
    category_id: z.coerce.number().int().positive('category_id is required'),
  }),
});

export const serviceIdParamSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({
    slug: slugParam,
    id: z.coerce.number().int().positive('Invalid service id'),
  }),
});