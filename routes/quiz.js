const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");

module.exports = function (db) {
  // const db = client.db("quiz-app");

  // router.post("/upsert-quiz", async (req, res) => {
  //   const db = client.db("quiz-app");
  //   const collectionName = "quizzes";

  //   const newQuiz = req.body.quiz; // Expecting JSON data with a quiz object

  //   try {
  //     await upsertQuiz(db, collectionName, newQuiz);
  //     res.send("Quiz upserted successfully.");
  //   } catch (err) {
  //     res.status(500).send("Error upserting quiz.");
  //   }
  // });

  router.get("/quizzes", async (req, res) => {
    try {
      const quizzes = await quizController.getQuizzes(db);
      console.log("Received quizzes:", quizzes);
      res.render("quizzes", { quizzes });
    } catch (err) {
      console.error("Error fetching quizzes:", err);
      res.status(500).send("Error fetching quizzes.");
    }
  });

  router.get("/quiz/:id", async (req, res) => {
    const quizId = req.params.id;
    try {
      const quiz = await quizController.getQuizById(db, quizId);
      res.render("quiz", { quiz: quiz, result: null, score: null });
    } catch (err) {
      res.status(404).send("Quiz not found");
    }
  });

  router.post("/quiz/:id", async (req, res) => {
    const quizId = req.params.id;
    const userAnswers = req.body.answers;

    try {
      const score = await quizController.submitQuiz(db, quizId, userAnswers);
      res.render("quiz", {
        quiz: await quizController.getQuizById(db, quizId),
        result: `Your score is: ${score}`,
        score: score,
      });
    } catch (err) {
      res.status(500).send("Error submitting quiz.");
    }
  });

  // Route to insert quizzes
  // router.post("/insert-quizzes", async (req, res) => {
  //   const quizzes = req.body.quizzes; // Expecting JSON data with quizzes
  //   const validation = validateQuizData(quizzes);
  //   if (!validation.valid) {
  //     return res.status(400).send(validation.message);
  //   }

  //   try {
  //     await insertQuizzes(db, quizzes);
  //     res.send("Quizzes inserted successfully.");
  //   } catch (err) {
  //     res.status(500).send("Error inserting quizzes.");
  //   }
  // });

  // Route for the root path
  router.get("/", (req, res) => {
    res.send("Quiz route is working!");
    // res.redirect("/quizzes");
  });

  return router;
};
