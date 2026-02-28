import { NextResponse } from "next/server";
import { prisma } from "@/app/_lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/authOptions";
import { cartItemSchema } from "@/app/_lib/validations";

// GET: Fetch user's cart
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as any).id;

        // Find or create cart for user
        let cart = await prisma.cart.findUnique({
            where: { userId }
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId, items: [] }
            });
        }

        // --- Data Migration / Consistency Check ---
        let items = Array.isArray(cart.items) ? [...(cart.items as any[])] : [];
        let modified = false;

        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            // 0. Ensure productId is synced
            if (!item.productId && item.product?.id) {
                item.productId = item.product.id;
                modified = true;
            }

            // 1. Force ID to be ProductID for perfect consistency
            if (item.productId && item.id !== item.productId) {
                item.id = item.productId;
                modified = true;
            }

            // 2. Ensure 'product' snapshot exists
            if (!item.product && item.productId) {
                const productData = await prisma.product.findUnique({
                    where: { id: item.productId }
                });
                if (productData) {
                    item.product = {
                        id: productData.id,
                        title: productData.title,
                        price: productData.price,
                        imageCover: productData.imageCover,
                        category: productData.category,
                        brand: productData.brand
                    };
                    modified = true;
                }
            }
        }

        if (modified) {
            cart = await prisma.cart.update({
                where: { userId },
                data: { items }
            });
        }
        // ------------------------------------------

        return NextResponse.json({ data: cart });

    } catch (error) {
        console.error("Cart GET error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

// POST: Add item to cart
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const body = await req.json();

        // Validate input
        const validation = cartItemSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { message: validation.error.issues[0].message },
                { status: 400 }
            );
        }

        const { productId, quantity = 1 } = validation.data;

        // 1. Fetch the product to store its snapshot in the cart
        const product = await prisma.product.findUnique({
            where: { id: productId }
        });

        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        // 2. Ensure cart exists
        let cart = await prisma.cart.findUnique({
            where: { userId }
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId, items: [] }
            });
        }

        // 3. Handle items logic (JSON array)
        let items = Array.isArray(cart.items) ? [...(cart.items as any[])] : [];

        // Find if product already exists (check productId or nested product.id)
        const existingItemIndex = items.findIndex(item =>
            item.productId === productId ||
            item.product?.id === productId
        );

        if (existingItemIndex > -1) {
            // Update quantity
            items[existingItemIndex].quantity += quantity;

            // Ensure consistency
            items[existingItemIndex].productId = productId;
            items[existingItemIndex].id = productId;
        } else {
            // Add new item
            items.push({
                id: productId, // Consistent ID
                productId,
                quantity,
                product: {
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    imageCover: product.imageCover,
                    category: product.category,
                    brand: product.brand
                }
            });
        }

        // 4. Update cart
        const updatedCart = await prisma.cart.update({
            where: { userId },
            data: { items }
        });

        return NextResponse.json({
            message: "Item added to cart",
            data: updatedCart
        });

    } catch (error) {
        console.error("Cart POST error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

// DELETE: Clear entire cart
export async function DELETE() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as any).id;

        await prisma.cart.update({
            where: { userId },
            data: { items: [] }
        });

        return NextResponse.json({ message: "Cart cleared" });

    } catch (error) {
        console.error("Cart DELETE error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
