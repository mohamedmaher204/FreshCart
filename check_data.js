const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function check() {
  try {
    const count = await prisma.product.count();
    fs.writeFileSync('data_status.txt', `COUNT:${count}`);
  } catch (e) {
    fs.writeFileSync('data_status.txt', `ERROR:${e.message}`);
  } finally {
    await prisma.$disconnect();
  }
}

check();
