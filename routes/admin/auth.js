const express = require("express");
const usersRepo = require("../../repos/users");
const { validationResult } = require("express-validator");
const router = express.Router();

const signupTemplate = require("../../views/admin/signup");
const signinTemplate = require("../../views/admin/signin");

const {
  requireEmail,
  requirePassword,
  requirePasswordConfirmation,
  requireEmailExists,
  requirePasswordsMatch,
} = require("./validators");

router.post(
  "/signup",
  [requireEmail, requirePassword, requirePasswordConfirmation],
  async (req, res) => {
    // recieve the errors array
    const errors = validationResult(req);
    console.log(errors);
    // check for errors
    if (!errors.isEmpty()) {
      return res.send(signupTemplate({ req, errors }));
    }
    const { email, password, passwordConfirmation } = req.body;
    const user = await usersRepo.create({ email, password });

    req.session.userId = user.id;

    res.send("Account created!");
  }
);

router.get("/signup", (req, res) => {
  res.send(signupTemplate({ req }));
});

router.get("/signin", (req, res) => {
  res.send(signinTemplate({}));
});

router.post(
  "/signin",
  [requireEmailExists, requirePasswordsMatch],
  async (req, res) => {
    const errors = validationResult(req);
    console.log(errors);

    // if there are errors
    if (!errors.isEmpty()) {
      return res.send(signinTemplate({ errors }));
    }

    const { email } = req.body;
    const user = await usersRepo.getOneBy({ email });

    req.session.userId = user.id;

    res.send("Signed In");
  }
);

router.get("/signout", (req, res) => {
  req.session = null;
  res.send("Signed out successfully!");
});

module.exports = router;
