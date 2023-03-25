const express = require("express");
const User = require("./models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/authDemo")
  .then(() => {
    console.log("Mongo connection open");
  })
  .catch((err) => {
    console.log("Something went wrong");
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("This is the home page");
});
app.get("/register", (req, res) => {
  res.render("register");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  const validPassword = await bcrypt.compare(password, user.password);
  if (user && validPassword) {
    res.send("Welcome!");
  } else {
    res.send("Try again!");
  }
});
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 12);
  const user = new User({
    username,
    password: hash
  });
  await user.save();
  res.redirect("/");
});
app.get("/secret", (req, res) => {
  res.send("This is a secret");
});

app.listen(3000, () => {
  console.log("Serving");
});
