"use strict";

module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert(
            "categories",
            [
                {
                    id: 1,
                    name: "Solicitações TI",
                    description: null,
                },
                {
                    id: 2,
                    name: "Automações",
                    description: null,
                },
                {
                    id: 3,
                    name: "Suporte Sistema v1",
                    description: null,
                },
                {
                    id: 4,
                    name: "Suporte Infraestrutura",
                    description: null,
                },
                {
                    id: 5,
                    name: "Suporte Rede e Servidores",
                    description: null,
                },
            ],
            {}
        );
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete("categories", null, {});
    },
};
