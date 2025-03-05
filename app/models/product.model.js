//product.model.js

module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define("product", {
    nombre: {
      type: Sequelize.STRING,
    },
    descripcion: {
      type: Sequelize.STRING,
    },
    precio: {
      type: Sequelize.FLOAT,
    },
  });

  return Product;
};
