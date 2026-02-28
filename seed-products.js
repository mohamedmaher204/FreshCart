const { PrismaClient } = require('@prisma/client');
const axios = require('axios');

const prisma = new PrismaClient();

async function main() {
    try {
        console.log("-----------------------------------------");
        console.log("Starting Product Seeding Process...");
        console.log("-----------------------------------------");

        // 1. Fetch data from external API
        console.log("Fetching products from https://ecommerce.routemisr.com/api/v1/products...");
        const response = await axios.get("https://ecommerce.routemisr.com/api/v1/products?limit=50");
        
        if (!response.data || !response.data.data) {
            console.error("FAILED: No data received from external API.");
            return;
        }

        const externalProducts = response.data.data;
        console.log(`Successfully fetched ${externalProducts.length} products.`);

        let createdCount = 0;
        let skippedCount = 0;

        // 2. Insert into our DB
        console.log("Inserting products into local MongoDB...");
        
        for (const p of externalProducts) {
            try {
                // Check if product already exists
                const exists = await prisma.product.findFirst({
                    where: { title: p.title }
                });

                if (!exists) {
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
                    createdCount++;
                    process.stdout.write("✔"); 
                } else {
                    skippedCount++;
                    process.stdout.write(".");
                }
            } catch (innerError) {
                console.error(`\nError inserting product "${p.title}":`, innerError.message);
            }
        }

        console.log("\n\n-----------------------------------------");
        console.log("Seeding Summary:");
        console.log(`- New Products Added: ${createdCount}`);
        console.log(`- Products Skipped (Already Exist): ${skippedCount}`);
        console.log(`- Total Products Processed: ${externalProducts.length}`);
        console.log("-----------------------------------------");

        const finalCount = await prisma.product.count();
        console.log(`Total Products in Database: ${finalCount}`);

    } catch (error) {
        console.error("\nCRITICAL SEEDING ERROR:", error.message);
        if (error.response) {
             console.error("API Response Data:", error.response.data);
             console.error("API Status:", error.response.status);
        }
    } finally {
        await prisma.$disconnect();
    }
}

main();
