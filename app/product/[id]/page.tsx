import { getProduct } from '@/app/_services/products.services';
import React from 'react';
import { Metadata } from 'next';
import ProductDetailsClient from './ProductDetailsClient';
import PageLoader from '@/app/_component/ui/PageLoader';

type ProductDetailsProps = {
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ProductDetailsProps): Promise<Metadata> {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        return {
            title: 'Product Not Found | FreshCart',
        }
    }

    return {
        title: `${product.title} | FreshCart`,
        description: product.description || `Buy ${product.title} at the best price on FreshCart. High quality guaranteed.`,
        openGraph: {
            title: product.title,
            description: product.description,
            images: [{ url: product.imageCover }],
        }
    }
}

export default async function ProductDetailsPage({ params }: ProductDetailsProps) {
    const { id } = await params;
    const productData = await getProduct(id);

    if (!productData) {
        return <PageLoader />;
    }

    return (
        <ProductDetailsClient productData={productData} id={id} />
    );
}
