const { MongoClient } = require("mongodb");

// Chaîne de connexion MongoDB
const uri = "mongodb+srv://ahmedlamti:smarthouse123@smart-house.pvs0v.mongodb.net/";

async function main() {
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const database = client.db("smart_house");
    const collection = database.collection("users");

    // Document utilisateur à insérer
    const user = {
      user_id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      password_hash: "hashed_password",
      phone: "123456789",
      created_at: new Date(),
      updated_at: new Date()
    };

    const result = await collection.insertOne(user);
    console.log(`Document inséré avec l'ID : ${result.insertedId}`);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
