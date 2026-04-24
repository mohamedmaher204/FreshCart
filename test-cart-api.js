// Test MongoDB connection and cart collection
const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://mm486486486_db_user:Mohamed012@cluster0.zlfhon7.mongodb.net/freshcart?retryWrites=true&w=majority&appName=Cluster0";

async function test() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");
        
        const db = client.db("freshcart");
        const collections = await db.listCollections().toArray();
        console.log("📦 Collections:", collections.map(c => c.name));
        
        // Check Cart collection
        const cartCol = db.collection("Cart");
        const cartCount = await cartCol.countDocuments();
        console.log("🛒 Cart documents:", cartCount);
        
        // Check if there are any carts with invalid items
        const carts = await cartCol.find({}).limit(3).toArray();
        console.log("🛒 Sample carts:", JSON.stringify(carts, null, 2));
        
    } catch (err) {
        console.error("❌ Error:", err.message);
    } finally {
        await client.close();
    }
}

test();
