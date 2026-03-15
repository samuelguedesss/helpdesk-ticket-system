"use strict";

module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert(
            "department",
            [
                // cost_center = 1 (Matriz)
                { id: 1, id_corporation: 1, name: "TI" },
                { id: 2, id_corporation: 1, name: "RH" },
                { id: 3, id_corporation: 1, name: "Financeiro" },
                { id: 4, id_corporation: 1, name: "Diretoria" },

                // cost_center = 2 (Filial SP)
                { id: 5, id_corporation: 2, name: "Comercial" },
                { id: 6, id_corporation: 2, name: "Logistica" },
                { id: 7, id_corporation: 2, name: "Suporte" },

                // cost_center = 3 (Filial RJ)
                { id: 8, id_corporation: 3, name: "Comercial" },
                { id: 10, id_corporation: 3, name: "Financeiro" },

                // cost_center = 4 (Filial MG)
                { id: 11, id_corporation: 4, name: "TI" },
                { id: 12, id_corporation: 4, name: "Comercial" },
                { id: 13, id_corporation: 4, name: "Qualidade" },
            ],
            {}
        );
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete("department", null, {});
    },
};
