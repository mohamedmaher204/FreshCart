const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Testing connection to MongoDB Atlas...");
    await prisma.$connect();
    console.log("Connected successfully!");
    const users = await prisma.user.count();
    console.log("Current user count:", users);
  } catch (e) {
    console.error("Connection failed!");
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
