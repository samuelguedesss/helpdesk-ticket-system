'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('called', 'financial_approval_required', {
      type: Sequelize.TINYINT(1),
      defaultValue: 0,
      allowNull: false,
      after: 'finalizacao_descricao',
    });
    await queryInterface.addColumn('called', 'financial_approval_status', {
      type: Sequelize.ENUM('pending', 'approved', 'rejected'),
      defaultValue: null,
      allowNull: true,
      after: 'financial_approval_required',
    });
    await queryInterface.addColumn('called', 'financial_approval_reason', {
      type: Sequelize.TEXT,
      defaultValue: null,
      allowNull: true,
      after: 'financial_approval_status',
    });
    await queryInterface.addColumn('called', 'financial_approval_date', {
      type: Sequelize.DATE,
      defaultValue: null,
      allowNull: true,
      after: 'financial_approval_reason',
    });
    await queryInterface.addColumn('called', 'financial_approval_user_id', {
      type: Sequelize.INTEGER,
      defaultValue: null,
      allowNull: true,
      after: 'financial_approval_date',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('called', 'financial_approval_required');
    await queryInterface.removeColumn('called', 'financial_approval_status');
    await queryInterface.removeColumn('called', 'financial_approval_reason');
    await queryInterface.removeColumn('called', 'financial_approval_date');
    await queryInterface.removeColumn('called', 'financial_approval_user_id');
  },
};