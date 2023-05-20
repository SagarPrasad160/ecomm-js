const express = require("express");
const router = express.Router();

const { validationResult } = require("express-validator");

const productsRepo = require("../../../repos/products");
const { requireTitle, requirePrice } = require("../auth/validators");

const newProductForm = require("../../../views/admin/new");

router.get("/admin/products", (req, res) => {});

router.get("/admin/products/new", (req, res) => {
  res.send(newProductForm({}));
});

router.post("/admin/products/new", [requireTitle, requirePrice], (req, res) => {
  const errors = validationResult(req);
  console.log(errors);
  res.send("Created");
});

module.exports = router;
