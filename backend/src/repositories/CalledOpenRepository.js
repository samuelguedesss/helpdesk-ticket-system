import db from '../models/index.js';
import CalledRepository from './CalledRepository.js';

const { Called } = db;

const createCalledRepo = async ({
    id_user,
    id_category,
    id_subcategory,
    id_status,
}) => {
    try {
        // verifica se a subcategoria exige aprovação financeira e seta os campos
        const data = CalledRepository.setFinancialApprovalOnCreateRepo({
            id_user,
            id_category,
            id_subcategory,
            id_status,
        });

        const called = await Called.create(data);
        return called;
    } catch (error) {
        throw new Error('Erro no repository ao criar Chamado: ' + error.message);
    }
};

const getCalledByIdRepo = async (id) => { // buscar chamado pelo ID
    try {
        const called = await Called.findByPk(id);
        return called;
    } catch (error) {
        throw new Error(
            'Erro no repository ao buscar Chamado por ID: ' + error.message
        );
    }
};

const updateCalledStatusRepo = async ({ // atualizar status do chamado
    id_called,
    id_status,
}) => {
    try {
        await Called.update(
            { id_status },
            { where: { id: id_called } }
        );
    } catch (error) {
        throw new Error(
            'Erro no repository ao atualizar status do Chamado: ' + error.message
        );
    }
};

export default {
    createCalledRepo,
    getCalledByIdRepo,
    updateCalledStatusRepo,
};
