"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.addConstraint(
      "OrderItems", // table name
      ["productId"],
      {
        // column name
        type: "FOREIGN KEY", // type of constraint
        references: {
          table: "Products", // table referenced
          field: "id", // primary key in the referenced table
          name: "orderItems-fk-products" // name of the constraint
        }
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.removeConstraint(
      "OrderItems",
      "orderItems-fk-products"
    );
  }
};
