import { NextResponse } from "next/server";
import { prisma } from "@/app/_lib/prisma";
import axios from "axios";

export async function GET(req: Request) {
    try {
        let allProducts: any[] = [];
        let currentPage = 1;
        let hasMorePages = true;

        // 1. Fetch ALL pages from external API
        while (hasMorePages) {
            const response = await axios.get(
                `https://ecommerce.routemisr.com/api/v1/products?page=${currentPage}&limit=40`
            );

            const pageData = response.data.data;
            const metadata = response.data.metadata;

            if (!pageData || pageData.length === 0) {
                hasMorePages = false;
                break;
            }

            allProducts = [...allProducts, ...pageData];

            // Check if there are more pages
            if (metadata && currentPage < metadata.numberOfPages) {
                currentPage++;
            } else {
                hasMorePages = false;
            }
        }

        if (allProducts.length === 0) {
            return NextResponse.json({ message: "No products found in external API" }, { status: 404 });
        }

        let createdCount = 0;
        let skippedCount = 0;

        // 2. Insert into our DB (skip duplicates)
        for (const p of allProducts) {
            // Check if product already exists by title
            const exists = await prisma.product.findFirst({
                where: { title: p.title }
            });

            if (!exists) {
                await prisma.product.create({
                    data: {
                        title: p.title,
                        description: p.description,
                        price: p.price || 0,
                        priceAfterDiscount: p.priceAfterDiscount,
                        imageCover: p.imageCover,
                        images: p.images || [],
                        category: p.category?.name || "Uncategorized",
                        brand: p.brand?.name || "Unknown",
                        ratingsAverage: p.ratingsAverage || 0,
                        ratingsQuantity: p.ratingsQuantity || 0,
                        quantity: p.quantity || 0,
                        sold: p.sold || 0
                    }
                });
                createdCount++;
            } else {
                skippedCount++;
            }
        }

        return NextResponse.json({
            message: "Seeding complete! All products imported.",
            created: createdCount,
            skipped: skippedCount,
            totalFetched: allProducts.length,
            pagesProcessed: currentPage
        });

    } catch (error: any) {
        console.error("Seeding error:", error);
        return NextResponse.json(
            { message: "Internal server error", error: error.message },
            { status: 500 }
        );
    }
}
