const Repository = require("./respository");

class CartRepository extends Repository {
  async deleteItem(cartId, itemId) {
    const cartItem = await this.getOne(cartId);
    const updatedItem = cartItem.items.filter((item) => {
      if (item.id === itemId) {
        if (item.quantity > 1) {
          item.quantity--;
          return true;
        } else {
          return false;
        }
      }
      return true;
    });
    await this.update(cartId, { items: updatedItem });
  }
}

module.exports = new CartRepository("cart.json");
