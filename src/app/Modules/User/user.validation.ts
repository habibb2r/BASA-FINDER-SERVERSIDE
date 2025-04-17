import { z } from 'zod';

const userSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(50, { message: 'Name must be at most 50 characters long' }),

  email: z.string().email({ message: 'Invalid email address' }),

  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .max(100, { message: 'Password must be at most 100 characters long' }),
});

const UpdateUserValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().optional(),
    role: z.enum(['admin', 'customer']).optional().default('customer'),
    isBlocked: z.boolean().optional().default(false),
  }),
});

export const UserValidation = { userSchema, UpdateUserValidationSchema };
