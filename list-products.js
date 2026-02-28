const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Listing All Products...");
        const products = await prisma.product.findMany({
            select: { title: true, category: true, brand: true, price: true }
        });
        
        console.log(`Total Count: ${products.length}`);
        console.log("---------------------------------------------------");
        products.forEach((p, i) => {
            console.log(`${i+1}. [${p.category}] ${p.brand} - ${p.title} (${p.price})`);
        });
        console.log("---------------------------------------------------");

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
