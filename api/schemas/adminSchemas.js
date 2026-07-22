import { z } from 'zod';

// GET/DELETE /businesses/:id, GET/DELETE /users/:id — id is a numeric string in the URL for businesses,
// but a UUID string for users. Handle separately since they're different types.

export const businessIdParamSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({
    id: z.coerce.number().int().positive('Invalid business id'),
  }),
});

export const userIdParamSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({
    id: z.string().uuid('Invalid user id'),
  }),
});

export const updateBusinessStatusSchema = z.object({
  query: z.object({}).optional(),
  params: z.object({
    id: z.coerce.number().int().positive('Invalid business id'),
  }),
  body: z.object({
    status: z.enum(['pending', 'approved', 'suspended', 'rejected'], {
      errorMap: () => ({ message: 'Invalid status value' }),
    }),
  }),
});
export const adminServiceIdParamSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({
    id: z.coerce.number().int().positive('Invalid service id'),
  }),
});

export const adminUpdateServiceSchema = z.object({
  query: z.object({}).optional(),
  params: z.object({
    id: z.coerce.number().int().positive('Invalid service id'),
  }),
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().optional(),
    category_id: z.coerce.number().int().positive().optional(),
  }),
});