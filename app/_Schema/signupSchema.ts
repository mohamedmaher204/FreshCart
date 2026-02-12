import * as z from "zod"

export const signupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.string().email("Invalid email address"),
    phone: z.string().regex(/^01[0125][0-9]{8}$/, "Invalid Egyptian phone number (11 digits starting with 01)"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    rePassword: z.string().min(6, "Confirm password must be at least 6 characters long"),
}).refine((data) => data.password === data.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"],
});

export type SignupSchema = z.infer<typeof signupSchema>;
