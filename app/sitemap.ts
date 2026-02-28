import { MetadataRoute } from 'next'
import { getAllProduct } from './_services/products.services'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const products = await getAllProduct()

    const productEntries: MetadataRoute.Sitemap = (products || []).map((product: any) => ({
        url: `https://freshcart.vercel.app/product/${product.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
    }))

    return [
        {
            url: 'https://freshcart.vercel.app/',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: 'https://freshcart.vercel.app/products',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: 'https://freshcart.vercel.app/brands',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        ...productEntries,
    ]
}
