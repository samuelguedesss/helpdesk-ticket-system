'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_categories', {
      id_user: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: { model: 'user', key: 'id' },
      },
      id_category: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: { model: 'categories', key: 'id' },
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('user_categories');
  }
};
