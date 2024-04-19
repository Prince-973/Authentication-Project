const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB");

const secret = "Thisisourlittlesecret."; // Secret key for encryption

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

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
  const newUser = new User({
    email: req.body.username,
    password: req.body.password,
  });

  newUser
    .save()
    .then(() => res.render("secrets"))
    .catch((error) => console.error("Error:", error));
});

app.post("/login", (req, res) => {
  const userName = req.body.username;
  const password1 = req.body.password;

  User.findOne({ email: userName })
    .then((doc) => {
      if (doc) {
        // Note: Since the password is encrypted, you can't directly compare it with the plain text password
        // You need to decrypt the stored password and then compare it
        if (doc.password === password1) {
          res.render("secrets");
        }
      }
    })
    .catch((err) => {
      console.log("Error:" + err);
    });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
