import { NextResponse } from "next/server";
import { prisma } from "@/app/_lib/prisma";

export async function GET() {
    try {
        // 1. Fetch all products with key identifying fields
        const products = await prisma.product.findMany({
            select: {
                id: true,
                title: true,
                imageCover: true,
                price: true,
                brand: true,
                category: true,
                createdAt: true
            },
            orderBy: {
                createdAt: 'asc' // Keep oldest
            }
        });

        // 2. Create unique key based on image + price + brand
        const seenProducts = new Map<string, string>(); // uniqueKey -> id to keep
        const duplicates: string[] = [];

        for (const product of products) {
            // Create a unique fingerprint for this product
            const uniqueKey = `${product.imageCover}|${product.price}|${product.brand}`;

            if (seenProducts.has(uniqueKey)) {
                // This is a duplicate (same image, price, brand)
                duplicates.push(product.id);
            } else {
                // First occurrence - keep it
                seenProducts.set(uniqueKey, product.id);
            }
        }

        if (duplicates.length === 0) {
            return NextResponse.json({
                message: "No visual duplicates found.",
                totalProducts: products.length,
                uniqueProducts: seenProducts.size
            });
        }

        // 3. Delete duplicates
        const result = await prisma.product.deleteMany({
            where: {
                id: {
                    in: duplicates
                }
            }
        });

        const finalCount = await prisma.product.count();

        return NextResponse.json({
            message: "Smart cleanup complete! Removed visual duplicates.",
            deletedCount: result.count,
            remainingProducts: finalCount,
            uniqueProducts: seenProducts.size
        });

    } catch (error: any) {
        return NextResponse.json(
            { message: "Error during cleanup", error: error.message },
            { status: 500 }
        );
    }
}
