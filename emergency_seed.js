const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
    console.log("🚀 Starting Emergency Seed...");
    try {
        await prisma.$connect();
        console.log("✅ Database Connected.");

        console.log("⬇️ Fetching products from API...");
        const response = await axios.get("https://ecommerce.routemisr.com/api/v1/products?limit=200");
        const externalProducts = response.data.data;
        console.log(`✅ Fetched ${externalProducts.length} products.`);

        let count = 0;
        for (const p of externalProducts) {
            
            // Generate basic images if none exist
            const imagesArray = p.images && p.images.length > 0 ? p.images : [p.imageCover];

            try {
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
                count++;
            } catch (err) {
                 console.error(`❌ Failed to insert product ${p.title}:`, err.message);
            }
        }
        
        console.log(`🎉 Successfully inserted ${count} products.`);
        
        const total = await prisma.product.count();
        console.log(`📊 Total products in DB: ${total}`);
        
    } catch (e) {
        console.error("❌ CRITICAL ERROR:", e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
