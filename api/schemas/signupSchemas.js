import { z } from 'zod';

export const landingSignupSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(100),
    email: z.string().email('Invalid email address'),
    source: z.enum(
      ['Instagram', 'TikTok', 'Google', 'Facebook', "Good ol' fashioned word of mouth"],
      { errorMap: () => ({ message: 'Invalid source value' }) }
    ),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});