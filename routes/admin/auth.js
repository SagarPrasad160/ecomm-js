const express = require("express");
const usersRepo = require("../../repos/users");
const { check, validationResult } = require("express-validator");
const router = express.Router();

const signupTemplate = require("../../views/admin/signup");
const signinTemplate = require("../../views/admin/signin");

const {
  requireEmail,
  requirePassword,
  requirePasswordConfirmation,
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
  res.send(signinTemplate());
});

router.post(
  "/signin",
  [
    check("email")
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage("Invalid Email")
      .custom(async (email) => {
        const user = await usersRepo.getOneBy({ email });
        if (!user) {
          throw new Error("Email does not exists!");
        }
      }),
    check("password")
      .trim()
      .custom(async (password, { req }) => {
        const user = await usersRepo.getOneBy({ email: req.body.email });
        if (!user) {
          throw new Error("invalid password");
        }
        const validPassword = await usersRepo.comparePasswords(
          user.password,
          password
        );
        if (!validPassword) {
          throw new Error("Invalid Password");
        }
      }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
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
