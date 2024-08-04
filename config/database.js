const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

let client;

async function connectDB() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    await client.connect();
  }
  return client.db("quiz-app");
}

async function createCollectionIfNotExists(db, collectionName) {
  const collections = await db
    .listCollections({ name: collectionName })
    .toArray();
  if (collections.length === 0) {
    await db.createCollection(collectionName);
    console.log(`Collection '${collectionName}' created.`);
  }
}

async function upsertQuiz(db, collectionName, newQuiz) {
  try {
    const collection = db.collection(collectionName);

    // Check if the quiz with the same title already exists
    const existingQuiz = await collection.findOne({ title: newQuiz.title });

    if (existingQuiz) {
      console.log(`Quiz titled "${newQuiz.title}" already exists.`);
      await collection.updateOne({ title: newQuiz.title }, { $set: newQuiz });
    } else {
      await collection.insertOne(newQuiz);
      console.log(`Quiz titled "${newQuiz.title}" inserted successfully.`);
    }
  } catch (err) {
    console.error("Error upserting quiz:", err);
  }
}

module.exports = {
  connectDB,
  createCollectionIfNotExists,
  upsertQuiz,
};
