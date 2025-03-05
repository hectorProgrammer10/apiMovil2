module.exports = (sequelize, Sequelize) => {
  const Pedido = sequelize.define("pedido", {
    name: {
      type: Sequelize.STRING,
    },
    place: {
      type: Sequelize.STRING,
    },
    cantidad: {
      type: Sequelize.INTEGER,
    },
  });

  return Pedido;
};
