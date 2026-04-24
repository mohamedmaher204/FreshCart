const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
    console.log("Starting FINAL SYNC...");
    try {
        // 1. Connection check
        await prisma.$connect();
        console.log("DB Connected.");

        // 2. Clear existing (just in case)
        const deleted = await prisma.product.deleteMany({});
        console.log(`Deleted ${deleted.count} old products.`);

        // 3. Fetch and Seed
        const response = await axios.get("https://ecommerce.routemisr.com/api/v1/products?limit=50");
        const externalProducts = response.data.data;
        console.log(`Fetched ${externalProducts.length} products.`);

        for (const p of externalProducts) {
            await prisma.product.create({
                data: {
                    title: p.title,
                    description: p.description,
                    price: p.price,
                    priceAfterDiscount: p.priceAfterDiscount,
                    imageCover: p.imageCover,
                    images: p.images || [],
                    category: p.category.name,
                    brand: p.brand.name,
                    ratingsAverage: p.ratingsAverage,
                    ratingsQuantity: p.ratingsQuantity,
                    quantity: p.quantity,
                    sold: p.sold
                }
            });
        }
        
        fs.writeFileSync('FINAL_STATUS.txt', 'COMPLETED_SUCCESSFULLY');
        console.log("FINAL SYNC COMPLETED.");
    } catch (e) {
        console.error("SYNC FAILED:", e.message);
        fs.writeFileSync('FINAL_STATUS.txt', `FAILED: ${e.message}`);
    } finally {
        await prisma.$disconnect();
    }
}

main();
