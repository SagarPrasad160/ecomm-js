const layout = require("./layout");

module.exports = ({ products }) => {
  const renderedProducts = products
    .map((product) => `<div>${product.title}</div>`)
    .join("");
  return layout({
    content: renderedProducts,
  });
};
