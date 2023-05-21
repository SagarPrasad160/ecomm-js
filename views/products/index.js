module.exports = ({ products }) => {
  const renderedProducts = products
    .map((product) => `<li>${product.title} - ${product.price}</li>`)
    .join("");

  return `
        <ul>
        ${renderedProducts}
        </ul>    
    `;
};
