// validators.js
function validateQuizData(quizzes) {
  if (!Array.isArray(quizzes)) {
    return { valid: false, message: "Data should be an array of quizzes." };
  }

  quizzes.forEach((quiz, index) => {
    if (quiz && quiz.title) {
      console.log(`Title of quiz at index ${index}: ${quiz.title}`);
    } else {
      console.error(`Quiz at index ${index} is missing a title.`);
    }
  });

  for (const quiz of quizzes) {
    if (typeof quiz.title !== "string" || quiz.title.trim() === "") {
      return {
        valid: false,
        message: "Each quiz must have a non-empty title.",
      };
    }

    if (!Array.isArray(quiz.questions) || quiz.questions.length === 0) {
      return {
        valid: false,
        message: "Each quiz must have at least one question.",
      };
    }

    for (const question of quiz.questions) {
      if (
        typeof question.question !== "string" ||
        question.question.trim() === ""
      ) {
        return {
          valid: false,
          message: "Each question must have a non-empty question text.",
        };
      }

      if (!Array.isArray(question.options) || question.options.length < 2) {
        return {
          valid: false,
          message: "Each question must have at least two options.",
        };
      }

      if (
        typeof question.answer !== "number" ||
        question.answer < 0 ||
        question.answer >= question.options.length
      ) {
        return {
          valid: false,
          message: "Answer must be a valid index within the options array.",
        };
      }
    }
  }

  return { valid: true };
}

module.exports = { validateQuizData };
