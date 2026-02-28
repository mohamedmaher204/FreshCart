import { NextResponse } from "next/server";
import { prisma } from "@/app/_lib/prisma";
import axios from "axios";

export async function GET(req: Request) {
    try {
        // Fetch from DummyJSON API (more reliable and has variety)
        const response = await axios.get("https://dummyjson.com/products?limit=100");
        const dummyProducts = response.data.products;

        if (!dummyProducts || dummyProducts.length === 0) {
            return NextResponse.json({ message: "No products found in DummyJSON API" }, { status: 404 });
        }

        let createdCount = 0;
        let skippedCount = 0;

        // Map DummyJSON products to our schema
        for (const p of dummyProducts) {
            // Check if product already exists by title
            const exists = await prisma.product.findFirst({
                where: { title: p.title }
            });

            if (!exists) {
                await prisma.product.create({
                    data: {
                        title: p.title,
                        description: p.description,
                        price: parseFloat(p.price),
                        priceAfterDiscount: p.discountPercentage > 0
                            ? parseFloat((p.price * (1 - p.discountPercentage / 100)).toFixed(2))
                            : null,
                        imageCover: p.thumbnail || p.images[0],
                        images: p.images || [],
                        category: p.category || "Uncategorized",
                        brand: p.brand || "Generic",
                        ratingsAverage: p.rating || 4.5,
                        ratingsQuantity: p.stock || 0,
                        quantity: p.stock || 100,
                        sold: 0
                    }
                });
                createdCount++;
            } else {
                skippedCount++;
            }
        }

        return NextResponse.json({
            message: "DummyJSON products imported successfully!",
            created: createdCount,
            skipped: skippedCount,
            totalFetched: dummyProducts.length
        });

    } catch (error: any) {
        console.error("Seeding error:", error);
        return NextResponse.json(
            { message: "Internal server error", error: error.message },
            { status: 500 }
        );
    }
}
