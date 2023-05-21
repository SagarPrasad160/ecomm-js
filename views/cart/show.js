const layout = require("../products/layout");

module.exports = ({ items }) => {
  const renderedItems = items.map(
    (item) => `<div>${item.product.title} - ${item.product.price}</div>`
  );
  return layout({
    content: renderedItems,
  });
};
