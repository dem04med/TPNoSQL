const { MongoClient } = require("mongodb");
require("dotenv").config();

const connectionString = process.env.MONGODB_URI;
console.log("Connection string:", connectionString);

const client = new MongoClient(connectionString);

let db;

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    db = client.db(process.env.DB_NAME || "sample_mflix");
    return db;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

module.exports = {
  connectToDatabase,
  getDb: () => db,
};