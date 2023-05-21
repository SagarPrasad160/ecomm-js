const express = require("express");

const cartRepo = require("../repos/cart");

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

module.exports = router;
