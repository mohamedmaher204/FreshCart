import { NextResponse } from "next/server";
import { prisma } from "@/app/_lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/authOptions";
import { orderSchema } from "@/app/_lib/validations";

// GET: Fetch user's orders
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as any).id;

        const orders = await prisma.order.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" }
        });

        // Map local data to match the interface expected by the UI
        const mappedOrders = orders.map(order => ({
            _id: order.id,
            totalOrderPrice: order.totalPrice,
            paymentMethodType: order.paymentMethod,
            isPaid: order.isPaid,
            isDelivered: order.isDelivered,
            createdAt: order.createdAt.toISOString(),
            shippingAddress: order.shippingAddress,
            // Our items are stored as JSON in the schema
            cartItems: (order.items as any[]).map(item => ({
                _id: item.id || item.productId,
                count: item.quantity,
                price: item.product?.price || 0,
                product: {
                    _id: item.productId,
                    title: item.product?.title || "Product",
                    imageCover: item.product?.imageCover || "",
                    brand: { name: item.product?.brand || "Brand" },
                    category: { name: item.product?.category || "Category" }
                }
            }))
        }));

        return NextResponse.json({ data: mappedOrders });

    } catch (error) {
        console.error("Orders GET error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

// POST: Create new order
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const body = await req.json();

        // Validate input
        const validation = orderSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { message: validation.error.issues[0].message },
                { status: 400 }
            );
        }

        const { shippingAddress, paymentMethod = "cash" } = validation.data;

        // 1. Get user's cart
        const cart = await prisma.cart.findUnique({
            where: { userId }
        });

        if (!cart || !Array.isArray(cart.items) || (cart.items as any[]).length === 0) {
            return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
        }

        const cartItems = cart.items as any[];

        // 2. Calculate total price
        const totalCartPrice = cartItems.reduce((acc: number, item: any) => acc + (item.product?.price * item.quantity), 0);

        // 3. Create order
        const order = await prisma.order.create({
            data: {
                userId,
                items: cartItems,
                totalPrice: totalCartPrice,
                paymentMethod,
                shippingAddress,
                isPaid: paymentMethod === "online", // Simple logic: online is "paid" immediately for this demo
                isDelivered: false
            }
        });

        // 4. Update product stocks (Sold & Quantity)
        for (const item of cartItems) {
            await prisma.product.update({
                where: { id: item.productId },
                data: {
                    quantity: { decrement: item.quantity },
                    sold: { increment: item.quantity }
                }
            });

            // 5. Log activity
            await prisma.userActivity.create({
                data: {
                    userId,
                    productId: item.productId,
                    action: "PURCHASE",
                    weight: 5
                }
            });
        }

        // 6. Clear cart
        await prisma.cart.update({
            where: { userId },
            data: { items: [] }
        });

        return NextResponse.json({
            status: "success",
            message: "Order placed successfully",
            data: order
        });

    } catch (error) {
        console.error("Orders POST error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
