import { Producttype } from './../_types/Product.type';









const domain = process.env.NEXTAUTH_URL || "http://localhost:3000"; // Fallback for server-side

export async function getAllProduct(): Promise<Producttype[] | null> {
    try {
        // Determine base URL based on environment
        const baseUrl = typeof window === 'undefined' ? domain : '';

        const response = await fetch(`${baseUrl}/api/products`, {
            cache: 'no-store', // Ensure fresh data, or use 'next: { revalidate: ... }'
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch products: ${response.status}`);
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.log("Error fetching products:", error);
        return null;
    }
}

export async function getProduct(id: string): Promise<Producttype | null> {
    try {
        const baseUrl = typeof window === 'undefined' ? domain : '';

        const response = await fetch(`${baseUrl}/api/products/${id}`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch product: ${response.status}`);
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.log("Error fetching product details:", error);
        return null;
    }
}





