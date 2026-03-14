'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('messages_called', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      id_called: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "called",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      id_user: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      message: { type: Sequelize.TEXT, allowNull: false },
      internal: { type: Sequelize.BOOLEAN },
      shipping_date: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('messages_called');
  }
};
