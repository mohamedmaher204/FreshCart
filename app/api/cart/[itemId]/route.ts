import { NextResponse } from "next/server";
import { prisma } from "@/app/_lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/authOptions";
import { updateQuantitySchema } from "@/app/_lib/validations";

// PUT: Update item quantity
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ itemId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const { itemId } = await params;
        const body = await req.json();

        // Validate input
        const validation = updateQuantitySchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { message: validation.error.issues[0].message },
                { status: 400 }
            );
        }

        const { quantity } = validation.data;

        // Fetch cart
        const cart = await prisma.cart.findUnique({
            where: { userId }
        });

        if (!cart) {
            return NextResponse.json({ message: "Cart not found" }, { status: 404 });
        }

        // --- More Resilient Item Lookup ---
        let itemsBase = cart.items;
        let items: any[] = [];

        if (Array.isArray(itemsBase)) {
            items = [...itemsBase];
        } else if (itemsBase && typeof itemsBase === 'object') {
            items = Object.values(itemsBase);
        }

        const searchId = String(itemId).trim();

        const itemIndex = items.findIndex(item => {
            const id = item.id ? String(item.id).trim() : null;
            const pId = item.productId ? String(item.productId).trim() : null;
            const nestedId = item.product?.id ? String(item.product.id).trim() : null;

            return id === searchId || pId === searchId || nestedId === searchId;
        });

        if (itemIndex === -1) {
            return NextResponse.json({ message: "Item not found in cart" }, { status: 404 });
        }

        // Update quantity
        items[itemIndex].quantity = quantity;

        // Ensure consistency (id and productId)
        if (!items[itemIndex].id) items[itemIndex].id = itemId;
        if (!items[itemIndex].productId && items[itemIndex].product?.id) items[itemIndex].productId = items[itemIndex].product.id;

        const updatedCart = await prisma.cart.update({
            where: { userId },
            data: { items }
        });

        return NextResponse.json({
            message: "Quantity updated",
            data: items[itemIndex]
        });

    } catch (error) {
        console.error("CartItem PUT error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

// DELETE: Remove item from cart
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ itemId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const { itemId } = await params;

        // Fetch cart
        const cart = await prisma.cart.findUnique({
            where: { userId }
        });

        if (!cart) {
            return NextResponse.json({ message: "Cart not found" }, { status: 404 });
        }

        // --- Robust Item Removal ---
        let itemsBase = cart.items;
        let items: any[] = [];

        if (Array.isArray(itemsBase)) {
            items = [...itemsBase];
        } else if (itemsBase && typeof itemsBase === 'object') {
            items = Object.values(itemsBase);
        }

        const searchId = String(itemId).trim();
        const initialLength = items.length;

        const newItems = items.filter(item => {
            const id = item.id ? String(item.id).trim() : null;
            const pId = item.productId ? String(item.productId).trim() : null;
            const nestedId = item.product?.id ? String(item.product.id).trim() : null;

            return id !== searchId && pId !== searchId && nestedId !== searchId;
        });

        if (initialLength === newItems.length) {
            return NextResponse.json({ message: "Item not found in cart" }, { status: 404 });
        }

        await prisma.cart.update({
            where: { userId },
            data: { items: newItems }
        });

        return NextResponse.json({ message: "Item removed from cart" });

    } catch (error) {
        console.error("CartItem DELETE error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
