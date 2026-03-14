"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("roles", [
      { id: 1, name: "Administrador" },
      { id: 2, name: "Tecnico" },
      { id: 3, name: "Usuario" },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("roles", null, {});
  },
};
