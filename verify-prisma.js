const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Checking Prisma Models...");
    console.log("Keys on prisma object:", Object.keys(prisma).filter(k => !k.startsWith('_')));
    
    try {
        const cartCount = await prisma.cart.count();
        console.log("Cart count:", cartCount);
        
        // Try to access cartItem
        if (prisma.cartItem) {
            console.log("prisma.cartItem is accessible!");
        } else {
            console.log("prisma.cartItem is NOT accessible.");
        }
    } catch (error) {
        console.error("Error accessing models:", error.message);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
