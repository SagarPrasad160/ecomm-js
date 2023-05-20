const express = require("express");
const multer = require("multer");

const productsRepo = require("../../../repos/products");
const { requireTitle, requirePrice } = require("../auth/validators");
const newProductForm = require("../../../views/admin/new");
const { handleErrors } = require("../middlewares");
const productListTemplate = require("../../../views/admin/index");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/admin/products", async (req, res) => {
  const products = await productsRepo.getAll();
  res.send(productListTemplate({ products }));
});

router.get("/admin/products/new", (req, res) => {
  res.send(newProductForm({}));
});

router.post(
  "/admin/products/new",
  upload.single("image"),
  [requireTitle, requirePrice],
  handleErrors(newProductForm),
  async (req, res) => {
    const { title, price } = req.body;
    const image = req.file.buffer.toString("base64");

    await productsRepo.create({ title, price, image });

    res.redirect("/admin/products");
  }
);

module.exports = router;
