import { BrandType } from "../_types/Product.type.tsx";

export async function getAllBrands(): Promise<BrandType[] | null> {
    try {
        const response = await fetch(`https://ecommerce.routemisr.com/api/v1/brands`, {
            next: { revalidate: 3600 } // Cache for 1 hour
        });
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Error fetching brands:", error);
        return null;
    }
}
