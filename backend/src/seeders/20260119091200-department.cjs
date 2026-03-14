"use strict";

module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert(
            "department",
            [
                // cost_center = 1 (ABCP)
                { id: 1, id_corporation: 1, name: "Qualidade" },
                { id: 2, id_corporation: 1, name: "Tecnicos" },

                // cost_center = 2 (GRCE)
                { id: 3, id_corporation: 2, name: "Comercial" },
                { id: 4, id_corporation: 2, name: "Logistica" },
                { id: 5, id_corporation: 2, name: "Tecnicos" },

                // cost_center = 3 (NTD)
                { id: 6, id_corporation: 3, name: "Diretoria" },
                { id: 7, id_corporation: 3, name: "Financeiro" },
                { id: 8, id_corporation: 3, name: "RH" },
                { id: 10, id_corporation:3, name: "TI" },

                // cost_center = 4 (YES)
                { id: 11, id_corporation: 4, name: "Analise critica" },
                { id: 12, id_corporation: 4, name: "Anatel" },
                { id: 13, id_corporation: 4, name: "Comercial" },
                { id: 14, id_corporation: 4, name: "Eletrodomestico" },
                { id: 15, id_corporation: 4, name: "Financeiro" },
                { id: 16, id_corporation: 4, name: "Mecanico" },
                { id: 17, id_corporation: 4, name: "Qualidade" },
                { id: 18, id_corporation: 4, name: "Quimico" },
            ],
            {}
        );
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete("department", null, {});
    },
};
