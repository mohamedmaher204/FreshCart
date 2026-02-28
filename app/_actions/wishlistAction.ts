"use server"
import { prisma } from "@/app/_lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/authOptions";
import { revalidatePath } from "next/cache";
import { wishlistSchema } from "../_lib/validations";

// Add to Wishlist
export async function addToWishlist(productId: string) {
    try {
        const validation = wishlistSchema.safeParse({ productId });
        if (!validation.success) {
            return { success: false, message: validation.error.issues[0].message };
        }

        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return { success: false, message: "Please login first (Session not found)" };
        }

        const userId = (session.user as any).id;

        // Ensure we don't have duplicates
        await prisma.userActivity.deleteMany({
            where: {
                userId,
                productId,
                action: "FAVORITE"
            }
        });

        // Create new record
        await prisma.userActivity.create({
            data: {
                userId,
                productId,
                action: "FAVORITE",
                weight: 4
            }
        });

        revalidatePath("/");
        return { success: true, message: "Added to wishlist" };
    } catch (error: any) {
        console.error("Add to Wishlist error:", error);
        return { success: false, message: "Failed to add to wishlist" };
    }
}

// Remove from Wishlist
export async function removeFromWishlist(productId: string) {
    try {
        const validation = wishlistSchema.safeParse({ productId });
        if (!validation.success) {
            return { success: false, message: validation.error.issues[0].message };
        }

        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return { success: false, message: "Please login first" };
        }

        const userId = (session.user as any).id;

        // Delete the activity record
        await prisma.userActivity.deleteMany({
            where: {
                userId,
                productId,
                action: "FAVORITE"
            }
        });

        revalidatePath("/");
        return { success: true, message: "Removed from wishlist" };
    } catch (error: any) {
        console.error("Remove from Wishlist error:", error);
        return { success: false, message: "Failed to remove from wishlist" };
    }
}

// Get User Wishlist
export async function getUserWishlist() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return { success: false, message: "Please login first", data: [] };
        }

        const userId = (session.user as any).id;

        const activities = await prisma.userActivity.findMany({
            where: {
                userId,
                action: "FAVORITE"
            },
            include: {
                product: true
            },
            orderBy: { timestamp: "desc" }
        });

        const wishlist = activities.map(activity => activity.product);

        return { success: true, data: wishlist };
    } catch (error: any) {
        console.error("Fetch Wishlist error:", error);
        return { success: false, message: "Failed to fetch wishlist", data: [] };
    }
}
