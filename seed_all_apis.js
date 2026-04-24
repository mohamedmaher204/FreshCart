const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const prisma = new PrismaClient();

async function main() {
    try {
        await prisma.$connect();
        console.log("✅ Database Connected.");

        console.log("⬇️ Fetching products from RouteMisr...");
        const responseRoute = await axios.get("https://ecommerce.routemisr.com/api/v1/products?limit=200");
        const routeProducts = responseRoute.data.data || [];
        console.log(`✅ Fetched ${routeProducts.length} from RouteMisr.`);

        let inserted = 0;
        let skipped = 0;

        for (const p of routeProducts) {
            const exists = await prisma.product.findFirst({ where: { title: p.title } });
            if (!exists) {
                const imagesArray = p.images && p.images.length > 0 ? p.images : [p.imageCover];
                await prisma.product.create({
                    data: {
                        title: p.title,
                        description: p.description,
                        price: p.price,
                        priceAfterDiscount: p.priceAfterDiscount,
                        imageCover: p.imageCover,
                        images: imagesArray,
                        category: p.category.name,
                        brand: p.brand.name,
                        ratingsAverage: p.ratingsAverage || 4.5,
                        ratingsQuantity: p.ratingsQuantity || 0,
                        quantity: p.quantity || 10,
                        sold: p.sold || 0
                    }
                });
                inserted++;
            } else { skipped++; }
        }

        console.log("⬇️ Fetching products from DummyJSON...");
        const responseDummy = await axios.get("https://dummyjson.com/products?limit=150");
        const dummyProducts = responseDummy.data.products || [];
        console.log(`✅ Fetched ${dummyProducts.length} from DummyJSON.`);

        for (const p of dummyProducts) {
            const exists = await prisma.product.findFirst({ where: { title: p.title } });
            if (!exists) {
                await prisma.product.create({
                    data: {
                        title: p.title,
                        description: p.description,
                        price: parseFloat(p.price),
                        priceAfterDiscount: p.discountPercentage > 0
                            ? parseFloat((p.price * (1 - p.discountPercentage / 100)).toFixed(2))
                            : null,
                        imageCover: p.thumbnail || p.images[0],
                        images: p.images || [],
                        category: p.category || "Uncategorized",
                        brand: p.brand || "Generic",
                        ratingsAverage: p.rating || 4.5,
                        ratingsQuantity: p.stock || 0,
                        quantity: p.stock || 100,
                        sold: 0
                    }
                });
                inserted++;
            } else { skipped++; }
        }

        console.log(`🎉 Process complete! Inserted: ${inserted}, Skipped (Already exist): ${skipped}`);
        const total = await prisma.product.count();
        console.log(`📊 Total products in DB now: ${total}`);

    } catch (e) {
        console.error("❌ ERROR:", e.message);
    } finally {
        await prisma.$disconnect();
    }
}
main();
