"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("cost_center", [
      {
        id: 1,
        name: "ABCP - Certificadora de Produtos",
      },
      {
        id: 2,
        name: "YES - Serviços em Certificação Ltda",
      },
      {
        id: 3,
        name: "GRCE - Gestão de Negocios Recursos Humanos Tecnologicos e Comercial LTDA",
      },
      {
        id: 4,
        name: "NTD - Núcleo de Tecnologia e Desenvolvimento",
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("cost_center", {
      id: [1, 2, 3, 4],
    });
  },
};
