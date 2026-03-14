"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("subcategory", [
      { id: 1, id_category: 1, name: "Novo colaborador", description: null, ativo: 1 },
      { id: 2, id_category: 1, name: "Problemas com VPN", description: null, ativo: 1 },
      { id: 3, id_category: 1, name: "Problemas/solicitações de Periféricos", description: null, ativo: 1 },
      { id: 4, id_category: 1, name: "Problemas com e-mail", description: null, ativo: 1 },
      { id: 5, id_category: 1, name: "Problemas do Notebook", description: null, ativo: 1 },
      { id: 6, id_category: 1, name: "Problemas com Office 365 (Excel, Word, etc.)", description: null, ativo: 1 },
      { id: 7, id_category: 1, name: "Solicitação de acesso", description: null, ativo: 1 },
      { id: 8, id_category: 1, name: "Problemas com Internet", description: null, ativo: 1 },
      { id: 9, id_category: 1, name: "Equipamentos/infraestrutura", description: null, ativo: 1 },

      { id: 10, id_category: 2, name: "Relatar bugs/problemas", description: null, ativo: 1 },
      { id: 11, id_category: 2, name: "Solicitação de melhorias", description: null, ativo: 1 },

      { id: 12, id_category: 3, name: "Concluir/excluir etapas e tarefas", description: null, ativo: 1 },
      { id: 13, id_category: 3, name: "Desbloquear/zerar etapas e tarefas", description: null, ativo: 1 },
      { id: 14, id_category: 3, name: "Finalizar processo", description: null, ativo: 1 },
      { id: 15, id_category: 3, name: "Erro de preenchimento", description: null, ativo: 1 },
      { id: 16, id_category: 3, name: "Reset ACEITE comercial/OCP/laboratório/GRU", description: null, ativo: 1 },
      { id: 17, id_category: 3, name: "Relatar bugs/problemas", description: null, ativo: 1 },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("subcategory", null, {});
  },
};