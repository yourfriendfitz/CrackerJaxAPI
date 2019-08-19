"use strict";
module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define(
    "OrderItem",
    {
      orderId: DataTypes.INTEGER,
      productId: DataTypes.INTEGER
    },
    {}
  );
  OrderItem.associate = function(models) {
    // associations can be defined here
    OrderItem.hasOne(models.Product, {
      as: "product",
      foreignKey: "id"
    });
  };
  return OrderItem;
};
