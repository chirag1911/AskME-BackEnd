require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

const DB_URL = process.env.DB_URL;
const port = process.env.PORT || 8000;

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((error) => console.log("MongoDB Error:\n", error));

app.use(express.json());
app.use(cors());
app.use("/users", require("./src/Routes/user"));
app.use("/questions", require("./src/Routes/question"));

app.get("/", (req, res) => {
  console.log("request made to this API");
  res.send("Server is Working...");
});

app.listen(port, () => {
  console.log(`Server up and running on port ${port}...`);
});
