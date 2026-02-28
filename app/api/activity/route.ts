import { NextResponse } from "next/server";
import { prisma } from "@/app/_lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/authOptions";
import { activitySchema } from "@/app/_lib/validations";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
        }

        const body = await req.json();

        // Validate input
        const validation = activitySchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { message: validation.error.issues[0].message },
                { status: 400 }
            );
        }

        const { productId, action } = validation.data;

        // Define weights for different actions
        const weights: Record<string, number> = {
            'VIEW': 1,
            'WISHLIST': 2,
            'ADD_TO_CART': 3,
            'PURCHASE': 5
        };

        const weight = weights[action] || 1;
        const userId = (session.user as any).id;

        const activity = await prisma.userActivity.create({
            data: {
                userId,
                productId,
                action,
                weight,
            }
        });

        return NextResponse.json({ status: "success", data: activity });

    } catch (error) {
        console.error("Activity tracking error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
