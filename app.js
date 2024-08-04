// app.js
const express = require("express");
const bodyParser = require("body-parser");
const {
  connectDB,
  createCollectionIfNotExists,
  upsertQuiz,
} = require("./config/database");
const { validateQuizData } = require("./controllers/validators");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Set up view engine and middleware
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function run() {
  try {
    const db = await connectDB();
    // Import routes after db connection
    const quizRoutes = require("./routes/quiz");
    app.use('/', quizRoutes(db)); // Pass db to quizRoutes

    const collectionName = "quizzes";
    await createCollectionIfNotExists(db, collectionName);

    // Optional: Check if the collection is empty and insert sample data if it is
    const count = await db.collection(collectionName).countDocuments();
    if (count === 0) {
      const sampleData = require("./config/sampleData");
      const validation = validateQuizData(sampleData);
      if (validation.valid) {
        for (const quiz of sampleData) {
          await upsertQuiz(db, collectionName, quiz);
        }
      } else {
        console.error("Sample data validation failed:", validation.message);
      }
    } else {
      console.log("Collection already contains data.");
    }

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.error("Error initializing database:", err);
    process.exit(1);
  }
}

run().catch(console.dir);
