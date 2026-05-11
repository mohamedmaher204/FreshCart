import { Producttype } from './../_types/Product.type';









import { prisma } from '../_lib/prisma';

const domain = process.env.NEXTAUTH_URL || "http://localhost:3000"; 

export async function getAllProduct(): Promise<Producttype[] | null> {
    try {
        // If on server, query database directly for speed and reliability
        if (typeof window === 'undefined') {
            const products = await prisma.product.findMany();
            return JSON.parse(JSON.stringify(products)); 
        }

        // If on client, use fetch
        const response = await fetch(`/api/products`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch products: ${response.status}`);
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        return null;
    }
}

export async function getProduct(id: string): Promise<Producttype | null> {
    try {
        // If on server, query database directly
        if (typeof window === 'undefined') {
            if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) return null;
            
            const product = await prisma.product.findUnique({
                where: { id }
            });
            return product ? JSON.parse(JSON.stringify(product)) : null;
        }

        // If on client, use fetch
        const response = await fetch(`/api/products/${id}`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch product: ${response.status}`);
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Error fetching product details:", error);
        return null;
    }
}





