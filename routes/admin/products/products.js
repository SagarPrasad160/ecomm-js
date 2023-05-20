const express = require("express");
const router = express.Router();

const productsRepo = require("../../../repos/products");

const newProductForm = require("../../../views/admin/new");

router.get("/admin/products", (req, res) => {});

router.get("/admin/products/new", (req, res) => {
  res.send(newProductForm({}));
});

module.exports = router;
