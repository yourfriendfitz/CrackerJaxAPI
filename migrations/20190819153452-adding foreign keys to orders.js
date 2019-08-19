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
      "Orders", // table name
      ["uid"],
      {
        // column name
        type: "FOREIGN KEY", // type of constraint
        references: {
          table: "Users", // table referenced
          field: "id", // primary key in the referenced table
          name: "orders-fk-users" // name of the constraint
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
    return queryInterface.removeConstraint("Orders", "orders-fk-users");
  }
};
