const express = require("express");
const usersRepo = require("../../repos/users");
const { check, validationResult } = require("express-validator");
const router = express.Router();

const signupTemplate = require("../../views/admin/signup");
const signinTemplate = require("../../views/admin/signin");

router.post(
  "/signup",
  [
    check("email")
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage("Must be a valid email")
      .custom(async (email) => {
        const userExists = await usersRepo.getOneBy({ email });
        if (userExists) {
          throw new Error("Email already in use");
        }
      }),
    check("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 chars"),
    check("passwordConfirmation")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 chars")
      .custom((passwordConfirmation, { req }) => {
        if (passwordConfirmation !== req.body.password) {
          throw new Error("Passwords must match");
        } else {
          return true;
        }
      }),
  ],
  async (req, res) => {
    const { email, password, passwordConfirmation } = req.body;
    const errors = validationResult(req);
    console.log(errors);

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
