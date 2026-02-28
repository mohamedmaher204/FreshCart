import { NextResponse } from "next/server";
import { prisma } from "@/app/_lib/prisma";
import { productSchema } from "@/app/_lib/validations";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");
        const brand = searchParams.get("brand");
        const keyword = searchParams.get("keyword"); // Search query
        const minPrice = parseFloat(searchParams.get("minPrice") || "0");
        const maxPrice = parseFloat(searchParams.get("maxPrice") || "9999999");
        const sort = searchParams.get("sort") || "newest";

        const page = parseInt(searchParams.get("page") || "1");
        const limitParam = searchParams.get("limit");
        // Default to a large number to show "everything" initially, 
        // but allow overrides for pagination.
        const limit = limitParam === "all" ? 1000 : parseInt(limitParam || "200");
        const skip = (page - 1) * limit;

        const where: any = {
            price: {
                gte: minPrice,
                lte: maxPrice
            }
        };

        if (category) where.category = category;
        if (brand) where.brand = brand;
        if (keyword) {
            where.OR = [
                { title: { contains: keyword, mode: 'insensitive' } },
                { description: { contains: keyword, mode: 'insensitive' } }
            ];
        }

        let orderBy: any = { createdAt: "desc" };
        if (sort === "price-asc") orderBy = { price: "asc" };
        if (sort === "price-desc") orderBy = { price: "desc" };
        if (sort === "rating") orderBy = { ratingsAverage: "desc" };
        if (sort === "sold") orderBy = { sold: "desc" };

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                skip,
                take: limit,
                orderBy,
            }),
            prisma.product.count({ where }),
        ]);

        return NextResponse.json({
            results: total,
            metadata: {
                currentPage: page,
                numberOfPages: Math.ceil(total / limit),
                limit,
            },
            data: products
        });

    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // 1. Validate Input
        const validation = productSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { message: validation.error.issues[0].message },
                { status: 400 }
            );
        }

        const data = validation.data;

        // 2. Create Product
        const product = await prisma.product.create({
            data: {
                title: data.title,
                description: data.description,
                price: data.price,
                priceAfterDiscount: data.priceAfterDiscount,
                quantity: data.quantity,
                imageCover: data.imageCover,
                images: data.images || [],
                category: data.category,
                brand: data.brand,
                ratingsAverage: 4.5,
                ratingsQuantity: 0
            }
        });

        return NextResponse.json({ data: product }, { status: 201 });
    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
