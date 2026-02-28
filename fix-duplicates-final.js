const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("🧹 Starting comprehensive cleanup...\n");

    // 1. Get all products
    const allProducts = await prisma.product.findMany({
        orderBy: { createdAt: 'asc' } // Keep oldest version
    });

    console.log(`📦 Total products in DB: ${allProducts.length}`);

    // 2. Group by title to find duplicates
    const titleMap = new Map();
    const toDelete = [];

    for (const product of allProducts) {
        if (titleMap.has(product.title)) {
            // This is a duplicate - mark for deletion
            toDelete.push(product.id);
        } else {
            // First occurrence - keep it
            titleMap.set(product.title, product.id);
        }
    }

    console.log(`🔍 Found ${toDelete.length} duplicate products`);
    console.log(`✅ Will keep ${titleMap.size} unique products\n`);

    if (toDelete.length > 0) {
        // 3. Delete duplicates
        const result = await prisma.product.deleteMany({
            where: {
                id: { in: toDelete }
            }
        });

        console.log(`🗑️  Deleted ${result.count} duplicates`);
    }

    // 4. Final count
    const finalCount = await prisma.product.count();
    console.log(`\n✨ Final unique products: ${finalCount}`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
