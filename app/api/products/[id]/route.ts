import { NextResponse } from "next/server";
import { prisma } from "@/app/_lib/prisma";
import { productSchema } from "@/app/_lib/validations";

type Params = { params: Promise<{ id: string }> }

export async function GET(req: Request, { params }: Params) {
    try {
        const { id } = await params;
        const product = await prisma.product.findUnique({ where: { id } });

        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ data: product });
    } catch (error) {
        console.error("Error fetching product:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: Params) {
    try {
        const { id } = await params;
        const body = await req.json();

        const validation = productSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { message: validation.error.issues[0].message },
                { status: 400 }
            );
        }

        const data = validation.data;
        const updated = await prisma.product.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                price: data.price,
                priceAfterDiscount: data.priceAfterDiscount ?? null,
                quantity: data.quantity,
                imageCover: data.imageCover,
                images: data.images || [],
                category: data.category,
                brand: data.brand,
            }
        });

        return NextResponse.json({ data: updated });
    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: Params) {
    try {
        const { id } = await params;

        // Use a transaction to ensure both activities and product are deleted
        await prisma.$transaction(async (tx) => {
            // 1. Delete associated activities first to avoid relation errors
            await tx.userActivity.deleteMany({
                where: { productId: id }
            });

            // 2. Finally delete the product
            await tx.product.delete({
                where: { id }
            });
        });

        return NextResponse.json({ message: "Product deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting product:", error);
        // If product doesn't exist, we'll hit this catch (prisma.product.delete throws for 404)
        if (error.code === 'P2025') {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
