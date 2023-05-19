const express = require("express");
const usersRepo = require("../../repos/users");
const router = express.Router();

const signupTemplate = require("../../views/admin/signup");
const signinTemplate = require("../../views/admin/signin");

router.post("/signup", async (req, res) => {
  const { email, password, passwordConfirmation } = req.body;

  const userExists = await usersRepo.getOneBy({ email });
  if (userExists) {
    return res.send("Email already in use.");
  }

  if (password !== passwordConfirmation) {
    return res.send("Both passwords must match!");
  }

  const user = await usersRepo.create({ email, password });

  req.session.userId = user.id;

  res.send("Account created!");
});

router.get("/signup", (req, res) => {
  res.send(signupTemplate({ req }));
});

router.get("/signin", (req, res) => {
  res.send(signinTemplate());
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const user = await usersRepo.getOneBy({ email });

  if (!user) {
    res.send("Invalid Email!");
  }
  const checkPassword = await usersRepo.comparePasswords(
    user.password,
    password
  );

  if (!checkPassword) {
    return res.send("Invalid Password!");
  }

  req.session.userId = user.id;

  res.send("Signed In");
});

router.get("/signout", (req, res) => {
  req.session = null;
  res.send("Signed out successfully!");
});

module.exports = router;
