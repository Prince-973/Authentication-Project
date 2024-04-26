require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(req.body.password, salt, function (err, hash) {
      const newUser = new User({
        email: req.body.username,
        password: hash,
      });

      newUser
        .save()
        .then(() => res.render("secrets"))
        .catch((error) => console.error("Error:", error));
    });
  });
});

app.post("/login", (req, res) => {
  const userName = req.body.username;
  const password1 = req.body.password;

  User.findOne({ email: userName })
    .then((doc) => {
      if (doc) {
        bcrypt.compare(password1, doc.password, function (err, result) {
          // result == true
          if (result === true) {
            res.render("secrets");
          } else {
            console.log(err);
          }
        });
      }
    })
    .catch((err) => {
      console.log("Error:" + err);
    });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
