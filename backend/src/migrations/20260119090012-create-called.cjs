'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('called', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      id_user: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },

      id_responsible: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "user",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },

      id_category: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "categories",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },

      id_subcategory: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "subcategory",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },

      id_status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "status_called",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },

      id_priority: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "priority",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },

      opening_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },

      closing_date: {
        type: Sequelize.DATE,
        allowNull: true
      },

      events: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: []
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

  },

  async down(queryInterface) {
    await queryInterface.dropTable('called');
  }
};
