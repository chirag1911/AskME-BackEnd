const Route = require("express").Router();
const Users = require("../Models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

Route.post("/register", async (req, res) => {
  console.log("Request for /users/register...");
  try {
    const user = new Users(req.body);
    user.password = await bcrypt.hash(user.password, 8);
    user.token = await jwt.sign(
      { _id: user._id.toString() },
      process.env.SECRET
    );
    await user.save();
    res.json({
      status: "SUCCESS",
      message: "You're successfully registered!!!",
      data: {
        username: user.username,
        user_id: user._id,
        token: user.token,
      },
    });
  } catch (error) {
    console.log("Error at /users/register, " + error.message);
    res.json({
      status: "FAILURE",
      error: error.message,
    });
  }
});

Route.post("/login", async (req, res) => {
  console.log("Request for /users/login...");
  try {
    const user = await Users.findOne({ email: req.body.email });
    if (!user) throw new Error("Invalid login credentials!!!");
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) throw new Error("Invalid login credentials!!!");
    user.token = await jwt.sign(
      { _id: user._id.toString() },
      process.env.SECRET
    );
    await user.save();
    res.json({
      status: "SUCCESS",
      message: "You're successfully logged in!!!",
      data: {
        username: user.username,
        user_id: user._id,
        token: user.token,
      },
    });
  } catch (error) {
    console.log("Error at /users/login, " + error.message);
    res.json({
      status: "FAILURE",
      error: error.message,
    });
  }
});

Route.get("/logout/:id", async (req, res) => {
  console.log("Request for /users/logout...");
  try {
    const user = await Users.findById(req.params.id);
    if (!user) throw new Error("User does not exist!!!");
    user.token = "";
    await user.save();
    res.json({
      status: "SUCCESS",
      message: "User logged out!!!",
    });
  } catch (error) {
    console.log("Error at /users/logout, " + error.message);
    res.json({
      status: "FAILURE",
      error: error.message,
    });
  }
});

module.exports = Route;
