const { ObjectId } = require("mongodb");

async function getQuizzes(db) {
  return await db.collection("quizzes").find().toArray();
}

async function getQuizById(db, id) {
  return await db.collection("quizzes").findOne({ _id: new ObjectId(id) });
}

async function submitQuiz(db, id, userAnswers) {
  const quiz = await getQuizById(db, id);
  if (!quiz) {
    throw new Error("Quiz not found");
  }

  let score = 0;
  quiz.questions.forEach((question, index) => {
    if (userAnswers[index] == question.answer) {
      score++;
    }
  });

  return score;
}

module.exports = {
  getQuizzes,
  getQuizById,
  submitQuiz,
};
