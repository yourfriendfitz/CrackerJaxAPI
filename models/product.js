"use strict";
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      name: DataTypes.STRING,
      price: DataTypes.INTEGER,
      ageRestricted: DataTypes.BOOLEAN,
      vendorId: DataTypes.INTEGER,
      type: DataTypes.STRING,
      imageUrl: DataTypes.STRING
    },
    {}
  );
  Product.associate = function(models) {
    // associations can be defined here
  };
  return Product;
};
