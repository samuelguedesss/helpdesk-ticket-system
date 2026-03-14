'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(100), allowNull: false },
      email: { type: Sequelize.STRING(150), allowNull: false, unique: true },
      password: { type: Sequelize.STRING(255), allowNull: false },
      id_role: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'roles', key: 'id' },
      },
      id_corporation: {
        type: Sequelize.INTEGER,
        references: { model: 'cost_center', key: 'id' },
      },
      id_department: {
        type: Sequelize.INTEGER,
        references: { model: 'department', key: 'id' },
      },
      creation_date: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      foto_user: { type: Sequelize.STRING(255) },
      ativo: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 1
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('user');
  }
};