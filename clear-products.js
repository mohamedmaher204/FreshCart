const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Clearing all products...");
        const result = await prisma.product.deleteMany({});
        console.log(`Deleted ${result.count} products.`);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
