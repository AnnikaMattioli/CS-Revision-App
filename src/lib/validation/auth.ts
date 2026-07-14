import { z } from "zod";

export const signInSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const signUpSchema = signInSchema.extend({
  displayName: z.string().trim().min(2, "Enter at least 2 characters.").max(50),
});

export const resetPasswordSchema = z.object({ email: z.email("Enter a valid email address.") });

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
