import React from 'react'
import { prisma } from '@/app/_lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/_lib/authOptions'
import { notFound, redirect } from 'next/navigation'
import OrderManager from '../OrderManager'

async function getOrderDetail(id: string) {
    try {
        const order = await prisma.order.findUnique({
            where: { id }
        });

        if (!order) return null;

        // Fetch user manually
        const user = await prisma.user.findUnique({ where: { id: order.userId } });

        return { ...order, user };
    } catch (error) {
        console.error("Error fetching order detail:", error);
        return null;
    }
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
        redirect('/login?callbackUrl=/admin/orders');
    }

    const { id } = await params;
    const order = await getOrderDetail(id);

    if (!order) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-10 max-w-7xl">
            <OrderManager order={order} />
        </div>
    );
}
