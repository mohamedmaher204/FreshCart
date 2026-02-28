const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
  try {
    const count = await prisma.product.count();
    console.log(`Verified Product Count: ${count}`);
    fs.writeFileSync('result.txt', `Verified Product Count: ${count}`);
  } catch (e) {
    console.error(e);
    fs.writeFileSync('result.txt', `Error: ${e.message}`);
  } finally {
    await prisma.$disconnect();
  }
}

main();
