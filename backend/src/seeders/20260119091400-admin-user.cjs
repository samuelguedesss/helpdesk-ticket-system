"use strict";

const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface, Sequelize) {
    const passwordHash = await bcrypt.hash("admin123", 10);

    await queryInterface.bulkInsert(
      "user",
      [
        {
          name: "Administrador",
          email: "admin@admin.com",
          password: passwordHash,
          id_role: 1, // ADMIN
          id_corporation: null,
          id_department: null,
          foto_user: null,
          creation_date: new Date(),
          ativo: 1, 
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("user", { email: "admin@admin.com" });
  },
};