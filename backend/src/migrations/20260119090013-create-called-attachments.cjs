'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('called_attachments', {
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
      filename: { type: Sequelize.STRING(255) },
      path: { type: Sequelize.STRING(255) },
      data_upload: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('called_attachments');
  }
};
