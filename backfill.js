const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    console.log("Fixing Products...");
    const act = await prisma.$runCommandRaw({
      update: "Product",
      updates: [
        {
          q: { sold: { $exists: false } },
          u: { $set: { sold: 0, ratingsAverage: 4.5, ratingsQuantity: 0, createdAt: { $date: new Date().toISOString() } } },
          multi: true
        }
      ]
    });
    console.log("Products fixed!", act);
  } catch(e) {
    console.error(e);
  } finally {
    prisma.$disconnect();
  }
}
run();
