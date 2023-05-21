const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const app = express();
const authRouter = require("./routes/admin/auth/auth");
const adminProductsRouter = require("./routes/admin/products/products");
const productsRouter = require("./routes/products");
const cartRouter = require("./routes/cart");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "session",
    keys: ["afdasfasf"],
  })
);

app.use("/admin/auth", authRouter);
app.use("/admin/products", adminProductsRouter);
app.use("/products", productsRouter);
app.use("/cart", cartRouter);

module.exports = app;
