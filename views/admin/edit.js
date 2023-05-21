const layout = require("./layout");

const {getError} = require("../helpers");

module.exports = ({ errors, product }) => {
  return layout({
    content: `<form method="POST">
                <input name="title" value="${product.title}" />
                ${getError(errors, "title")}
                <input name="price" value="${product.price}" />
                ${getError(errors, "price")}
                <input type="file" name="image" />
                <button>Submit</button>
                </form>`,
  });
};
