const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
    let logOutput = "";
    function log(msg) {
        console.log(msg);
        logOutput += msg + "\n";
    }

    try {
        log("-----------------------------------------");
        log("Starting Product Seeding Process (Direct execution)...");
        log("-----------------------------------------");

        // 1. Fetch data
        log("Fetching products from API...");
        const response = await axios.get("https://ecommerce.routemisr.com/api/v1/products?limit=50");
        
        if (!response.data || !response.data.data) {
            log("FAILED: No data received from external API.");
            fs.writeFileSync('result_seed.txt', logOutput);
            return;
        }

        const externalProducts = response.data.data;
        log(`Successfully fetched ${externalProducts.length} products.`);

        let createdCount = 0;
        let skippedCount = 0;

        // 2. Insert
        log("Inserting products...");
        
        for (const p of externalProducts) {
            try {
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
                } else {
                    skippedCount++;
                }
            } catch (innerError) {
                log(`Error inserting product "${p.title}": ${innerError.message}`);
            }
        }

        log("\n-----------------------------------------");
        log("Seeding Summary:");
        log(`- New Products Added: ${createdCount}`);
        log(`- Products Skipped: ${skippedCount}`);
        log(`- Total Processed: ${externalProducts.length}`);
        
        const finalCount = await prisma.product.count();
        log(`Total Products in Database: ${finalCount}`);
        log("-----------------------------------------");

        fs.writeFileSync('result_seed.txt', logOutput);

    } catch (error) {
        log(`\nCRITICAL ERROR: ${error.message}`);
        fs.writeFileSync('result_seed.txt', logOutput);
    } finally {
        await prisma.$disconnect();
    }
}

main();
