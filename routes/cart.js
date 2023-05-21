const express = require("express");

const cartRepo = require("../repos/cart");
const productsRepo = require("../repos/products");
const cartShowTemplate = require("../views/cart/show");

const router = express.Router();

// Recieve a request to add a product to cart

router.post("/cart/products", async (req, res) => {
  // if the cart does not exists at all
  let cart;
  if (!req.session.cartId) {
    // create a new cart with empty items array
    cart = await cartRepo.create({ items: [] });
    console.log(cart);
    // add the id of newly created cart to the session of req object
    req.session.cartId = cart.id;
  } else {
    // if cart exists get the cart from the cartRepo
    cart = await cartRepo.getOne(req.session.cartId);
  }
  // check to see if the item already exists in cart items array
  const itemExists = cart.items.find((item) => item.id === req.body.productId);

  if (itemExists) {
    // increase the quantity of product
    itemExists.quantity++;
  } else {
    // if the item does not exist add it to the items array
    cart.items.push({ id: req.body.productId, quantity: 1 });
  }
  // update the item in cart repository
  await cartRepo.update(cart.id, { items: cart.items });

  res.send("Added to Cart!");
});

router.get("/cart", async (req, res) => {
  // check if a cart exists for the user making request
  if (!req.session.cartId) {
    // redirect back to products route
    res.redirect("/");
  }
  // if cart exist get the cart from cartRepo
  const cart = await cartRepo.getOne(req.session.cartId);
  for (let item of cart.items) {
    // for each item in the cart items array get the corresponding product from productsRepo
    const product = await productsRepo.getOne(item.id);
    // add product to product property of item to display in show template
    item.product = product;
  }
  res.send(cartShowTemplate({ items: cart.items }));
});

module.exports = router;
