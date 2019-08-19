"use strict";
module.exports = (sequelize, DataTypes) => {
  const Vendor = sequelize.define(
    "Vendor",
    {
      name: DataTypes.STRING
    },
    {}
  );
  Vendor.associate = function(models) {
    // associations can be defined here
    Vendor.hasMany(models.Product, { as: "products", foreignKey: "vendorId" });
  };
  return Vendor;
};
