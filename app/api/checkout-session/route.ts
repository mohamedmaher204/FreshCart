import { NextResponse } from "next/server";
import { prisma } from "@/app/_lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/authOptions";
import { shippingAddressSchema } from "@/app/_lib/validations";
import Stripe from "stripe";

export async function POST(req: Request) {
    try {
        if (!process.env.STRIPE_SECRET_KEY) {
            return NextResponse.json({ message: "Stripe configuration missing" }, { status: 500 });
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const body = await req.json();

        // Validate shipping address
        const validation = shippingAddressSchema.safeParse(body.shippingAddress);
        if (!validation.success) {
            return NextResponse.json(
                { message: validation.error.issues[0].message },
                { status: 400 }
            );
        }

        const shippingAddress = validation.data;

        // 1. Get user's cart
        const cart = await prisma.cart.findUnique({
            where: { userId }
        });

        if (!cart) {
            return NextResponse.json({ message: "Cart not found" }, { status: 404 });
        }

        const cartItems = typeof cart.items === "string" ? JSON.parse(cart.items || "[]") : (Array.isArray(cart.items) ? cart.items : []);

        if (cartItems.length === 0) {
            return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
        }

        // 2. Prepare Stripe line items
        const line_items = cartItems.map((item: any) => {
            const productData: any = {
                name: item.product.title || "Product",
                metadata: {
                    productId: item.productId
                }
            };

            // Only add image if it's a valid absolute HTTPS URL (Stripe requirement)
            const imageUrl = item.product?.imageCover;
            if (imageUrl && typeof imageUrl === "string" && imageUrl.startsWith("https://")) {
                productData.images = [imageUrl];
            }

            return {
                price_data: {
                    currency: "egp",
                    product_data: productData,
                    unit_amount: Math.round((item.product?.price || 0) * 100), // Stripe expects amounts in cents
                },
                quantity: item.quantity,
            };
        });

        // 3. Create Stripe Checkout Session
        const stripeSession = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",
            success_url: `${process.env.NEXTAUTH_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXTAUTH_URL}/checkout`,
            customer_email: session.user.email as string,
            metadata: {
                userId,
                shippingAddress: JSON.stringify(shippingAddress),
            },
        });

        return NextResponse.json({
            status: "success",
            url: stripeSession.url
        });

    } catch (error: any) {
        console.error("Stripe Checkout Error:", error);
        return NextResponse.json({ message: error.message || "Internal server error" }, { status: 500 });
    }
}
