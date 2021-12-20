const route = require("express").Router();
const Questions = require("../Models/question");
const chalk = require("chalk");

// get all the questions
route.get("/all", async (req, res) => {
  try {
    const skip = parseInt(req.query.skip);
    const questions = await Questions.find()
      .skip(skip)
      .limit(15)
      .sort({ _id: -1 });
    for (let i = 0; i < questions.length; i++) {
      let len = questions[i].answers.length;
      const modifiedQuestions = {
        _id: questions[i]._id,
        title: questions[i].title,
        body: questions[i].body,
        votes: questions[i].votes,
        totalAnswers: len,
        tags: questions[i].tags,
        askedBy: questions[i].askedBy,
      };
      questions[i] = modifiedQuestions;
    }
    res.json({
      status: "SUCCESS",
      message: "All question successfully fetched!!!",
      data: {
        questions,
      },
    });
  } catch (error) {
    console.log("Error at /questions/, " + error.message);
    res.json({
      status: "FAILURE",
      error: error.message,
    });
  }
});

// add question
route.post("/add", async (req, res) => {
  try {
    const question = new Questions(req.body);
    await question.save();
    res.json({
      status: "SUCCESS",
      message: "Question Created successfully!!!",
    });
  } catch (error) {
    console.log("Error at /questions/add, " + error.message);
    res.json({
      status: "FAILURE",
      error: error.message,
    });
  }
});

// fetch single question
route.get("/:id", async (req, res) => {
  try {
    const question = await Questions.findById(req.params.id);
    let len = question.answers.length;
    const modifiedQuestion = {
      _id: question._id,
      title: question.title,
      body: question.body,
      votes: question.votes,
      totalAnswers: len,
      tags: question.tags,
      askedBy: question.askedBy,
    };
    res.json({
      status: "SUCCESS",
      message: "Question successfully fetched!!!",
      data: {
        question: modifiedQuestion,
      },
    });
  } catch (error) {
    console.log("Error at /questions/add, " + error.message);
    res.json({
      status: "FAILURE",
      error: error.message,
    });
  }
});

// change the question's vote (question_id = id)
route.get("/:id/changeVotes/:votes", async (req, res) => {
  console.log(chalk.green("GET  ") + chalk.blue("/:id/changeVotes/:votes  "));
  try {
    const question = await Questions.findById(req.params.id);
    question.votes += parseInt(req.params.votes);
    await question.save();
    res.json({
      status: "SUCCESS",
      message: "votes has changed!!!",
    });
  } catch (error) {
    console.log("Error at /questions/:id/addAnswer, " + error.message);
    res.json({
      status: "FAILURE",
      error: error.message,
    });
  }
});

// get all the answers of the question (question_id = id)
route.get("/:id/answers/all", async (req, res) => {
  try {
    const question = await Questions.findById(req.params.id);
    const answers = question.answers;
    res.json({
      status: "SUCCESS",
      message: "Answers fetched!!!",
      data: {
        answers,
      },
    });
  } catch (error) {
    console.log("Error at /questions/:id/all, " + error.message);
    res.json({
      status: "FAILURE",
      error: error.message,
    });
  }
});

// add the answer to the question (question_id = id)
route.post("/:id/answers/add", async (req, res) => {
  try {
    const newAnswer = {
      answer: req.body.answer,
      votes: 0,
      answeredBy: req.body.answeredBy,
    };
    const question = await Questions.findById(req.params.id);
    const answers = question.answers;
    question.answers = [...answers, newAnswer];
    await question.save();
    res.json({
      status: "SUCCESS",
      message: "Answer added successfully!!",
    });
  } catch (error) {
    console.log("Error at /questions/:id/addAnswer, " + error.message);
    res.json({
      status: "FAILURE",
      error: error.message,
    });
  }
});

// change the vote of an answer (question_id = id1, answer_id = id2)
route.get("/:id1/answers/:id2/:votes", async (req, res) => {
  try {
    const question = await Questions.findById(req.params.id1);
    const answers = question.answers;
    for (let i = 0; i < answers.length; i++) {
      const ans = answers[i];
      if (ans._id.toString() === req.params.id2) {
        answers[i].votes += parseInt(req.params.votes);
      }
    }
    await question.save();
    res.json({
      status: "SUCCESS",
      message: "Update has been done successfully!!!",
    });
  } catch (error) {
    console.log("Error at /questions/:id/addAnswer, " + error.message);
    res.json({
      status: "FAILURE",
      error: error.message,
    });
  }
});

module.exports = route;
