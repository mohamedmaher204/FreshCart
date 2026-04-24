const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient({
  log: ['info', 'warn', 'error'],
  errorFormat: 'pretty',
});

async function testConnection() {
  console.log("------------------------------------------");
  console.log("🔍 Testing Database Connection...");
  console.log("📍 URL:", process.env.DATABASE_URL?.replace(/:([^:@]+)@/, ':****@')); // Hide password
  
  const timer = setTimeout(() => {
    console.error("\n❌ CONNECTION TIMED OUT (Took more than 15s)");
    console.error("👉 Likely Cause: Your IP is not whitelisted in MongoDB Atlas Network Access.");
    console.error("👉 Or: A firewall is blocking port 27017.");
    process.exit(1);
  }, 15000);

  try {
    await prisma.$connect();
    clearTimeout(timer);
    console.log("\n✅ SUCCESS: Connected to database!");
    
    // Check if models exist
    console.log("📝 Checking data counts...");
    const userCount = await prisma.user.count();
    const productCount = await prisma.product.count();
    
    console.log(`👥 Users: ${userCount}`);
    console.log(`🛍️ Products: ${productCount}`);
    
    if (productCount === 0) {
      console.warn("⚠️ Warning: Your database is empty!");
    } else {
      console.log("🎉 Everything looks good!");
    }

  } catch (err) {
    clearTimeout(timer);
    console.error("\n❌ CONNECTION FAILED:");
    
    if (err.message.includes('Authentication failed')) {
      console.error("👉 Likely Cause: Incorrect Password or Username in .env");
    } else if (err.message.includes('DNS')) {
      console.error("👉 Likely Cause: The Cluster URL in .env is incorrect or Cluster was deleted.");
    } else {
      console.error(err.message);
    }
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

testConnection();
