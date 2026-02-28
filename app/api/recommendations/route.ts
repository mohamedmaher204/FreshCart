import { NextResponse } from "next/server";
import { prisma } from "@/app/_lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/authOptions";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        // If not logged in, return top-selling products as a fallback
        if (!session || !session.user) {
            const topProducts = await prisma.product.findMany({
                take: 10,
                orderBy: { sold: 'desc' }
            });
            return NextResponse.json({ data: topProducts });
        }

        const userId = (session.user as any).id;

        // HEURISTIC RECOMMENDATION ENGINE LOGIC:
        // 1. Get recent user activity
        const recentActivity = await prisma.userActivity.findMany({
            where: { userId },
            take: 20,
            orderBy: { timestamp: 'desc' },
            select: { productId: true, action: true, weight: true }
        });

        // 2. Score products based on interaction weights
        const scores: Record<string, number> = {};
        recentActivity.forEach(activity => {
            scores[activity.productId] = (scores[activity.productId] || 0) + activity.weight;
        });

        // 3. Get categories the user is interested in (based on high-scored products)
        const topProductIds = Object.keys(scores).sort((a, b) => scores[b] - scores[a]).slice(0, 5);

        const topProducts = await prisma.product.findMany({
            where: { id: { in: topProductIds } },
            select: { category: true }
        });

        const interestingCategories = [...new Set(topProducts.map(p => p.category))];

        // 4. Fetch recommendations
        // Logic: Products from interesting categories that the user hasn't bought/viewed much yet
        const recommendedProducts = await prisma.product.findMany({
            where: {
                category: { in: interestingCategories },
                id: { notIn: topProductIds } // Avoid repeating what they just saw
            },
            take: 10,
            orderBy: [
                { ratingsAverage: 'desc' },
                { sold: 'desc' }
            ]
        });

        // If not enough recommendations, fill with top rated
        if (recommendedProducts.length < 4) {
            const fallback = await prisma.product.findMany({
                where: { id: { notIn: topProductIds } },
                take: 10 - recommendedProducts.length,
                orderBy: { ratingsAverage: 'desc' }
            });
            return NextResponse.json({ data: [...recommendedProducts, ...fallback] });
        }

        return NextResponse.json({ data: recommendedProducts });

    } catch (error) {
        console.error("Recommendation error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
