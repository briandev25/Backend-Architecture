import { z } from 'zod';
import { passwordRegex } from '../utils/password.js';

 export const validateNewUser = z.object({
    username:z.string().trim().min(5,"Username is too short").max(32,"Maximum characters reached!!!"),
    email:z.email().trim().toLowerCase(),
    password:z.string().min(6,"Password should be at least six characters").regex(passwordRegex,"Password must include uppercase, lowercase, and a number"),
})
export const validateLogin = z.object({
 email: z
    .string()
    .email("Invalid email format")
    .transform((val) => val.trim().toLowerCase()),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .transform((val) => val.trim()),
});

export const validateProfileUpdate = z.object({
  bio: z.string().max(160, "Bio cannot exceed 160 characters").optional(),
  avatarUrl: z.string().url("Invalid URL format").optional(),
  location: z.string().max(100, "Location cannot exceed 100 characters").optional(),
});