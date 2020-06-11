const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRouter = require("./routers/authRoute");
const citiesRouter = require("./routers/citiesRoute");
const port = process.env.PORT || 8081;

var uri = "mongodb://localhost:27017/test_abhi";

mongoose.connect(uri);

const connection = mongoose.connection;

connection.once("open", function () {
  console.log("MongoDB database connection established successfully");
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).send("Welcome to Abhinav's Server");
});

app.use("/api/auth", authRouter);
app.use("/api/cities", citiesRouter);

app.listen(port, function () {
  console.log("Server is running on Port: " + port);
});
