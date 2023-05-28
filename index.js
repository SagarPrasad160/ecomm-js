const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const app = express();
const authRouter = require("./routes/admin/auth/auth");
const adminProductsRouter = require("./routes/admin/products/products");
const productsRouter = require("./routes/products");
const cartRouter = require("./routes/cart");
app.use(express.static("public"));
// using bodyParser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    keys: ["afdasfasf"],
  })
);

app.use(authRouter);
app.use(productsRouter);
app.use(adminProductsRouter);
app.use(cartRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT);
