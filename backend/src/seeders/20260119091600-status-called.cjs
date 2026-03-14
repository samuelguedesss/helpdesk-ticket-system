"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("status_called", [
      { id: 1, name: "Aberto" },
      { id: 3, name: "Aguardando usuário" },
      { id: 2, name: "Em andamento" },
      { id: 4, name: "Finalizado" },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("status_called", null, {});
  },
};
