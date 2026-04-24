const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
    try {
        await prisma.$connect();
        fs.writeFileSync('CONN_OK.txt', 'CONNECTED');
        const count = await prisma.product.count();
        fs.writeFileSync('COUNT_OK.txt', count.toString());
    } catch (e) {
        fs.writeFileSync('CONN_ERR.txt', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
