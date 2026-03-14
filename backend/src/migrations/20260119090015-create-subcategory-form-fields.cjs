'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('subcategory_form_fields', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      id_subcategory: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "subcategory",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      label: { type: Sequelize.STRING(150), allowNull: false },
      created_at: {type: Sequelize.DATE,allowNull: false,},
      placeholder: { type: Sequelize.STRING(150), allowNull: true },
      type: {
        type: Sequelize.ENUM('text', 'number', 'textarea'),
        defaultValue: 'text',
      },
      required: { type: Sequelize.BOOLEAN, defaultValue: false },
      order_index: { type: Sequelize.INTEGER, defaultValue: 0 },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('subcategory_form_fields');
  }
};
