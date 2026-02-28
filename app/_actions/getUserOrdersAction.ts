"use server"
import { prisma } from "@/app/_lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/authOptions";

export async function getUserOrders() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return {
                success: false,
                message: "User not authenticated",
                data: []
            }
        }

        const userId = (session.user as any).id;

        const orders = await prisma.order.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" }
        });

        // Map data to match UI expectations
        const mappedOrders = orders.map(order => ({
            _id: order.id,
            totalOrderPrice: order.totalPrice,
            paymentMethodType: order.paymentMethod,
            isPaid: order.isPaid,
            isDelivered: order.isDelivered,
            createdAt: order.createdAt.toISOString(),
            shippingAddress: order.shippingAddress,
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

        return {
            success: true,
            data: mappedOrders
        }

    } catch (error: any) {
        console.error("Error fetching orders:", error.message);
        return {
            success: false,
            message: "Failed to fetch orders",
            data: []
        }
    }
}
