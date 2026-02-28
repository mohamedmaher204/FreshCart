import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/_lib/prisma";
import { registerSchema } from "@/app/_lib/validations";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Validate input
        const validation = registerSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { message: validation.error.issues[0].message },
                { status: 400 }
            );
        }

        const { name, email, password, phone } = validation.data;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone: phone as any, // Adding phone support
            } as any,
        });

        return NextResponse.json(
            { message: "User registered successfully", userId: user.id },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
