import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Category name is required').max(100),
    slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Slug must be lowercase with words separated by hyphens'),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const categoryIdParamSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({
    id: z.coerce.number().int().positive('Invalid category id'),
  }),
});