"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("cost_center", [
      {
        id: 1,
        name: "Matriz",
      },
      {
        id: 2,
        name: "Filial SP",
      },
      {
        id: 3,
        name: "Filial RJ",
      },
      {
        id: 4,
        name: "Filial MG",
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("cost_center", {
      id: [1, 2, 3, 4],
    });
  },
};
