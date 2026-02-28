import { NextResponse } from "next/server";
import { prisma } from "@/app/_lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/authOptions";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const order = await prisma.order.findUnique({
            where: { id }
        });

        if (!order) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }

        // Fetch user manually to avoid relation issues if needed
        const user = await prisma.user.findUnique({ where: { id: order.userId } });

        return NextResponse.json({ data: { ...order, user } });
    } catch (error) {
        console.error("Order Detail error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();
        const { isPaid, isDelivered } = body;

        const updatedOrder = await prisma.order.update({
            where: { id },
            data: {
                ...(isPaid !== undefined && { isPaid }),
                ...(isDelivered !== undefined && { isDelivered })
            }
        });

        return NextResponse.json({ status: "success", data: updatedOrder });
    } catch (error) {
        console.error("Order Update error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
