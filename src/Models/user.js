const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    token: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Users = new mongoose.model("Users", schema);

module.exports = Users;
