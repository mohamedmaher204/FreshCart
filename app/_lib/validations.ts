import { z } from "zod";

export const egyptianPhoneSchema = z.string().regex(/^01[0125][0-9]{8}$/, "Invalid Egyptian phone number (11 digits starting with 01)");

export const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name is too long"),
    email: z.string().email("Invalid email address"),
    phone: egyptianPhoneSchema,
    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(100, "Password is too long"),
    rePassword: z.string().min(6, "Confirm password must be at least 6 characters"),
}).refine((data) => data.password === data.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"],
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export const cartItemSchema = z.object({
    productId: z.string().min(1, "Product ID is required"),
    quantity: z.number().int().min(1, "Quantity must be at least 1").optional(),
});

export const updateQuantitySchema = z.object({
    quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

export const activitySchema = z.object({
    productId: z.string().min(1, "Product ID is required"),
    action: z.enum(['VIEW', 'ADD_TO_CART', 'PURCHASE', 'WISHLIST']),
});

export const shippingAddressSchema = z.object({
    details: z.string().min(5, "Address details are too short"),
    phone: egyptianPhoneSchema,
    city: z.string().min(2, "City is required"),
});

export const orderSchema = z.object({
    shippingAddress: shippingAddressSchema,
    paymentMethod: z.enum(['cash', 'online']).optional(),
});

export const productSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    price: z.coerce.number().min(0, "Price must be positive"),
    priceAfterDiscount: z.coerce.number().min(0).optional().nullable(),
    quantity: z.coerce.number().int().min(0, "Quantity must be positive"),
    category: z.string().min(1, "Category is required"),
    brand: z.string().min(1, "Brand is required"),
    imageCover: z.string().url("Must be a valid URL"),
    images: z.array(z.string().url()).optional(),
});

export type ProductInput = z.infer<typeof productSchema>;

export const wishlistSchema = z.object({
    productId: z.string().min(1, "Product ID is required"),
});
