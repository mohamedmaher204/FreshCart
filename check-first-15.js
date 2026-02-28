const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const products = await prisma.product.findMany({
        take: 15,
        select: {
            id: true,
            title: true,
            imageCover: true,
            price: true,
            brand: true
        }
    });
    
    console.log("First 15 products:");
    products.forEach((p, i) => {
        console.log(`${i+1}. ${p.title.substring(0, 50)}... (${p.brand}) - ${p.price} EGP`);
    });
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
