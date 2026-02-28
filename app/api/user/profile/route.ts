import { NextResponse } from "next/server";
import { prisma } from "@/app/_lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/authOptions";

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const { name, image } = await req.json();

        if (!name) {
            return NextResponse.json({ message: "Name is required" }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name,
                image
            }
        });

        return NextResponse.json({
            message: "Profile updated successfully",
            data: {
                name: updatedUser.name,
                email: updatedUser.email,
                image: updatedUser.image
            }
        });

    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
