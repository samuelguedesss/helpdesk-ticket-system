'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('called_field_values', {
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

      id_field: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "subcategory_form_fields",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      value: { type: Sequelize.TEXT },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('called_field_values');
  }
};
