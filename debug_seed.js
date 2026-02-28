const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const fs = require('fs');

const prisma = new PrismaClient();
const LOG_FILE = 'debug_seed.log';

function log(msg) {
    const timestamp = new Date().toISOString();
    const line = `[${timestamp}] ${msg}\n`;
    console.log(msg);
    fs.appendFileSync(LOG_FILE, line);
}

async function main() {
    try {
        log("=== STARTING DEBUG SEED ===");
        
        // 1. Test Fetch
        log("Step 1: Fetching 1 product from API...");
        const response = await axios.get("https://ecommerce.routemisr.com/api/v1/products?limit=1");
        if (!response.data || !response.data.data) {
            log("FAILED: No data from API");
            return;
        }
        const p = response.data.data[0];
        log(`SUCCESS: Fetched product: ${p.title}`);

        // 2. Test DB Connection
        log("Step 2: Connecting to Prisma...");
        await prisma.$connect();
        log("SUCCESS: Connected to DB");

        // 3. Test Insert
        log("Step 3: Checking if product exists...");
        const exists = await prisma.product.findFirst({
            where: { title: p.title }
        });

        if (!exists) {
            log("Product not found, creating...");
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
            log("SUCCESS: Product created!");
        } else {
            log("Product already exists.");
        }

        const count = await prisma.product.count();
        log(`Current DB Count: ${count}`);

    } catch (error) {
        log(`CRITICAL ERROR: ${error.message}`);
        if(error.stack) log(error.stack);
    } finally {
        await prisma.$disconnect();
        log("=== FINISHED ===");
    }
}

// Clear log file
if (fs.existsSync(LOG_FILE)) fs.unlinkSync(LOG_FILE);

main();
