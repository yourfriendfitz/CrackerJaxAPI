'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    uid: DataTypes.INTEGER,
    ready: DataTypes.BOOLEAN,
    paid: DataTypes.BOOLEAN
  }, {});
  Order.associate = function(models) {
    // associations can be defined here
    Order.hasMany(models.OrderItem, { as: "items", foreignKey: "orderId" });
  };
  return Order;
};