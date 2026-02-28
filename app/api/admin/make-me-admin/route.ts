import { NextResponse } from "next/server";
import { prisma } from "@/app/_lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/authOptions";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ message: "You must be logged in" }, { status: 401 });
        }

        // Upgrade the logged-in user to admin
        const updatedUser = await prisma.user.update({
            where: { email: session.user.email },
            data: { role: "admin" }
        });

        return NextResponse.json({
            message: `Congratulations ${updatedUser.name}! You are now an Admin.`,
            note: "Please log out and log back in for the changes to take effect in your session."
        });

    } catch (error) {
        console.error("Error upgrading user:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
