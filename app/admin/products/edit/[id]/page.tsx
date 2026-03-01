export const dynamic = 'force-dynamic';

import React from 'react'
import { prisma } from '@/app/_lib/prisma'
import { notFound } from 'next/navigation'
import EditProductForm from '@/app/_component/admin/EditProductForm'

interface EditProductPageProps {
    params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
    const { id } = await params;

    const product = await prisma.product.findUnique({
        where: { id }
    });

    if (!product) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto">
            <EditProductForm initialData={JSON.parse(JSON.stringify(product))} />
        </div>
    )
}
