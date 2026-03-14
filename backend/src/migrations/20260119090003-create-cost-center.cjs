'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cost_center', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(255), allowNull: false, unique: true },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('cost_center');
  }
};
