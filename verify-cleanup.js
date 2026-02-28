const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const count = await prisma.product.count();
        console.log(`Product Count: ${count}`);
        
        // Check for duplicates
        const products = await prisma.product.groupBy({
            by: ['title'],
            _count: {
                title: true
            },
            having: {
                title: {
                    _count: {
                        gt: 1
                    }
                }
            }
        });
        
        if (products.length > 0) {
            console.log(`Found ${products.length} titles with duplicates still.`);
        } else {
            console.log("No duplicates found by title.");
        }

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
