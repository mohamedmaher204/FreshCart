import { NextResponse } from "next/server";
import { prisma } from "@/app/_lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/authOptions";

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
        const { role } = body;

        if (!role || !['user', 'admin'].includes(role)) {
            return NextResponse.json({ message: "Invalid role" }, { status: 400 });
        }

        // Prevent self-demotion for safety (optional but good)
        if (id === (session.user as any).id && role === 'user') {
            return NextResponse.json({ message: "Cannot demote yourself" }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { role }
        });

        return NextResponse.json({ status: "success", data: updatedUser });
    } catch (error) {
        console.error("User Role Update error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
