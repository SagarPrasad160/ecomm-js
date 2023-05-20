const express = require("express");
const usersRepo = require("../../../repos/users");
const router = express.Router();

const signupTemplate = require("../../../views/admin/signup");
const signinTemplate = require("../../../views/admin/signin");

const { handleErrors } = require("../middlewares");

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
  handleErrors(signupTemplate),
  async (req, res) => {
    const { email, password, passwordConfirmation } = req.body;
    const user = await usersRepo.create({ email, password });

    req.session.userId = user.id;

    res.redirect("/admin/products");
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
  handleErrors(signinTemplate),
  async (req, res) => {
    const { email } = req.body;
    const user = await usersRepo.getOneBy({ email });

    req.session.userId = user.id;

    res.redirect("/admin/products");
  }
);

router.get("/signout", (req, res) => {
  req.session = null;
  res.send("Signed out successfully!");
});

module.exports = router;
