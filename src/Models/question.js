const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    votes: {
      type: Number,
      required: true,
    },
    answers: [
      new mongoose.Schema({
        answer: {
          type: String,
          required: true,
        },
        votes: {
          type: Number,
          requried: true,
        },
        answeredBy: {
          type: String,
          required: true,
        },
      }),
    ],
    tags: [String],
    askedBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Questions = new mongoose.model("Questions", schema);

module.exports = Questions;
