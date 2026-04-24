const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const count = await prisma.product.count();
    console.log(`Product Count: ${count}`);
    const first = await prisma.product.findFirst();
    console.log('First product:', JSON.stringify(first, null, 2));
  } catch (e) {
    console.error('Check failed:', e);
  } finally {
    await prisma.$disconnect();
  }
}

check();
