const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Starting cleanup of duplicate products...");

        // 1. Fetch all products (just ID and Title to save memory)
        const products = await prisma.product.findMany({
            select: {
                id: true,
                title: true
            }
        });

        console.log(`Total products checked: ${products.length}`);

        const seenTitles = new Set();
        const duplicates = [];

        // 2. Identify duplicates
        for (const product of products) {
            if (seenTitles.has(product.title)) {
                duplicates.push(product.id);
            } else {
                seenTitles.add(product.title);
            }
        }

        console.log(`Found ${duplicates.length} duplicates.`);

        if (duplicates.length === 0) {
            console.log("No duplicates found. Database is clean.");
            return;
        }

        // 3. Delete duplicates
        console.log("Deleting duplicates...");
        const result = await prisma.product.deleteMany({
            where: {
                id: {
                    in: duplicates
                }
            }
        });

        console.log(`Successfully deleted ${result.count} duplicate products.`);
        
        const finalCount = await prisma.product.count();
        console.log(`Remaining unique products: ${finalCount}`);

    } catch (error) {
        console.error("Error during cleanup:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
