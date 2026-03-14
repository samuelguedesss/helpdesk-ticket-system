"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert("subcategory_form_fields", [
            { id: 1, id_subcategory: 1, label: "Nome do colaborador", type: "text", required: 1, order_index: 1, placeholder: "Coloque o nome completo do colaborador", created_at: "2025-12-17 12:20:41" },
            { id: 2, id_subcategory: 1, label: "Departamento", type: "text", required: 1, order_index: 2, placeholder: "Departamento do colaborador", created_at: "2025-12-17 12:20:41" },
            { id: 3, id_subcategory: 1, label: "Email colaborador", type: "text", required: 1, order_index: 3, placeholder: "E-mail registrado para o colaborador", created_at: "2026-01-02 12:10:11" },
            { id: 4, id_subcategory: 1, label: "Senha colaborador", type: "text", required: 1, order_index: 4, placeholder: "Senha do e-mail registrado para o colaborador", created_at: "2026-01-02 12:10:11" },

            { id: 7, id_subcategory: 2, label: "Usuário", type: "text", required: 1, order_index: 1, placeholder: "Informe seu nome ou login de rede", created_at: "2026-01-02 22:11:25" },
            { id: 8, id_subcategory: 2, label: "Descreva o problema", type: "textarea", required: 1, order_index: 2, placeholder: "Explique como está o comportamento da VPN, horários e mensagens de erro, se houver.", created_at: "2026-01-02 22:28:19" },

            { id: 12, id_subcategory: 3, label: "Tipo de periférico", type: "text", required: 1, order_index: 1, placeholder: "Ex: Teclado, Mouse, Monitor...", created_at: "2026-01-21 15:16:19" },
            { id: 13, id_subcategory: 3, label: "Descreva o problema", type: "textarea", required: 1, order_index: 2, placeholder: "Explique se é troca, falha, mau funcionamento, novo item, etc.", created_at: "2026-01-21 15:16:19" },

            { id: 16, id_subcategory: 4, label: "E-mail afetado", type: "text", required: 1, order_index: 1, placeholder: "Ex: maria.souza@empresa.com.br", created_at: "2026-01-21 15:22:10" },
            { id: 17, id_subcategory: 4, label: "Descrição do problema", type: "textarea", required: 1, order_index: 2, placeholder: "Ex: Não consigo enviar e-mails, aparece erro no X, etc.", created_at: "2026-01-21 15:22:10" },

            { id: 18, id_subcategory: 5, label: "Usuário do notebook", type: "text", required: 1, order_index: 1, placeholder: "Nome do usuário responsável pela máquina", created_at: "2026-01-21 15:25:29" },
            { id: 19, id_subcategory: 5, label: "Descrição do problema", type: "textarea", required: 1, order_index: 2, placeholder: "Detalhe o comportamento da máquina, erros e tempo de ocorrência", created_at: "2026-01-21 15:25:29" },

            { id: 20, id_subcategory: 6, label: "Aplicativo afetado", type: "text", required: 1, order_index: 1, placeholder: "Ex: Excel, Word, Outlook...", created_at: "2026-01-21 15:26:45" },
            { id: 21, id_subcategory: 6, label: "Descrição do problema", type: "textarea", required: 1, order_index: 2, placeholder: "Explique o erro, mensagens exibidas ou comportamento inesperado", created_at: "2026-01-21 15:26:45" },

            { id: 22, id_subcategory: 7, label: "Tipo de acesso", type: "text", required: 1, order_index: 1, placeholder: "Ex: Mapeamento de pasta, criação de e-mail, acesso ao site...", created_at: "2026-01-21 15:28:00" },
            { id: 23, id_subcategory: 7, label: "Descrição da solicitação", type: "textarea", required: 1, order_index: 2, placeholder: "Informe os detalhes da solicitação, justificativa, permissões necessárias e sistema envolvido.", created_at: "2026-01-21 15:28:00" },

            { id: 24, id_subcategory: 8, label: "Local do problema", type: "text", required: 1, order_index: 1, placeholder: "Ex: Sala A, RH, Escritório", created_at: "2026-01-21 15:29:02" },
            { id: 25, id_subcategory: 8, label: "Descrição do problema", type: "textarea", required: 1, order_index: 2, placeholder: "Explique se está completamente sem internet, oscilando, com perda de pacotes, etc.", created_at: "2026-01-21 15:29:02" },

            { id: 29, id_subcategory: 10, label: "Descrição do bug/problema", type: "textarea", required: 1, order_index: 1, placeholder: "Detalhe o problema...", created_at: "2026-01-21 15:39:30" },
            { id: 30, id_subcategory: 11, label: "Sugestão de melhoria", type: "textarea", required: 1, order_index: 1, placeholder: "Detalhe a sugestão...", created_at: "2026-01-21 15:40:16" },

            { id: 31, id_subcategory: 12, label: "Processo", type: "text", required: 1, order_index: 1, placeholder: "Coloque o nome do processo para facilitar a identificação", created_at: "2026-01-21 15:49:03" },
            { id: 32, id_subcategory: 12, label: "Descrição", type: "textarea", required: 1, order_index: 2, placeholder: "Informe os detalhes da solicitação, justificativa, permissões necessárias e sistema envolvido.", created_at: "2026-01-21 15:49:03" },

            { id: 33, id_subcategory: 13, label: "Processo", type: "text", required: 1, order_index: 1, placeholder: "Coloque o nome do processo para facilitar a identificação", created_at: "2026-01-21 15:50:03" },
            { id: 34, id_subcategory: 13, label: "Descrição", type: "textarea", required: 1, order_index: 2, placeholder: "Informe os detalhes da solicitação, justificativa, permissões necessárias e sistema envolvido.", created_at: "2026-01-21 15:50:03" },

            { id: 35, id_subcategory: 14, label: "Processo", type: "text", required: 1, order_index: 1, placeholder: "Coloque o nome do processo para facilitar a identificação", created_at: "2026-01-21 15:51:13" },
            { id: 36, id_subcategory: 14, label: "Descrição", type: "textarea", required: 1, order_index: 2, placeholder: "Informe os detalhes da solicitação, justificativa, permissões necessárias e sistema envolvido.", created_at: "2026-01-21 15:51:13" },

            { id: 37, id_subcategory: 15, label: "Processo", type: "text", required: 1, order_index: 1, placeholder: "Coloque o nome do processo para facilitar a identificação", created_at: "2026-01-21 15:51:56" },
            { id: 38, id_subcategory: 15, label: "Descrição", type: "textarea", required: 1, order_index: 2, placeholder: "Informe os detalhes da solicitação, justificativa, permissões necessárias e sistema envolvido.", created_at: "2026-01-21 15:51:56" },

            { id: 39, id_subcategory: 16, label: "Processo", type: "text", required: 1, order_index: 1, placeholder: "Coloque o nome do processo", created_at: "2026-01-21 15:55:57" },
            { id: 40, id_subcategory: 16, label: "Valor", type: "number", required: 1, order_index: 2, placeholder: "Coloque o valor", created_at: "2026-01-21 15:55:57" },
            { id: 41, id_subcategory: 16, label: "Motivo do RESET", type: "textarea", required: 1, order_index: 3, placeholder: "Informe os detalhes da solicitação, justificativa, permissões necessárias e sistema envolvido.", created_at: "2026-01-21 15:55:57" },

            { id: 42, id_subcategory: 17, label: "Descrição do bug/problema", type: "textarea", required: 1, order_index: 1, placeholder: "Detalhe o problema...", created_at: "2026-01-21 15:56:40" },

            { id: 43, id_subcategory: 9, label: "Tipo de equipamento", type: "text", required: 1, order_index: 1, placeholder: "Ex: Notebook, Impressora, etc.", created_at: "2026-01-21 15:07:03" },
            { id: 44, id_subcategory: 9, label: "Local do equipamento", type: "text", required: 1, order_index: 2, placeholder: "Informe o local onde está o equipamento", created_at: "2026-01-21 15:07:03" },
            { id: 45, id_subcategory: 9, label: "Descreva o problema", type: "textarea", required: 1, order_index: 3, placeholder: "Descreva o problema enfrentado com o equipamento", created_at: "2026-01-21 15:07:03" },
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("subcategory_form_fields", null, {});
    },
};
