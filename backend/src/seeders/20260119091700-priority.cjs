"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("priority", [
      {
        name: "Baixa",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Média",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Alta",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Urgente",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("priority", null, {});
  },
};
