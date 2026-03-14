'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('subcategory', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      id_category: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'categories', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      description: {
        type: Sequelize.STRING(255)
      },
      ativo: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 1,
        comment: '0 para inativo, 1 para ativo'
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('subcategory');
  }
};