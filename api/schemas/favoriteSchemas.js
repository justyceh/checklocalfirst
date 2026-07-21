import { z } from 'zod';

export const addFavoriteSchema = z.object({
  body: z.object({
    business_id: z.coerce.number().int().positive('business_id is required'),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const removeFavoriteParamSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({
    business_id: z.coerce.number().int().positive('Invalid business id'),
  }),
});