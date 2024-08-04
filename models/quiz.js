const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  question: String,
  options: [String],
  answer: Number, // Index of the correct answer in the options array
});

module.exports = mongoose.model("Quiz", quizSchema);
