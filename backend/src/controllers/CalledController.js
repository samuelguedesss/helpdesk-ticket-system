import CalledService from "../services/CalledService.js";

const getAllCalleds = async (req, res) => {
    try {
        const user = req.user;
        const filters = req.query;

        const calleds = await CalledService.getAllCalledsService(user, filters);
        return res.status(200).json(calleds);
    } catch (error) {
        console.error("Erro no controller Called:", error);
        return res.status(500).json({ message: "Erro no controller Called." });
    }
};

const getCalledDetails = async (req, res) => {
    try {
        const user = req.user;
        const { id } = req.params;

        const data = await CalledService.getCalledDetailsService(user, id);
        return res.status(200).json(data);
    } catch (error) {
        console.error("Erro no controller CalledDetails:", error);

        if (error.status) {
            return res.status(error.status).json({ message: error.message });
        }

        return res.status(500).json({ message: "Erro ao buscar detalhes do chamado." });
    }
};

const getCalledsByTecnico = async (req, res) => {
    try {
        const id_tecnico = req.user.id;
        const filters = req.query;

        const calleds = await CalledService.getCalledsByTecnicoService(id_tecnico, filters);
        return res.status(200).json(calleds);
    } catch (error) {
        console.error("Erro no controller getCalledsByTecnico:", error);
        return res.status(500).json({ message: "Erro ao buscar chamados do técnico." });
    }
};

const assumirCalled = async (req, res) => {
    try {
        const id_tecnico = req.user.id;
        const { id } = req.params;

        const result = await CalledService.assumirCalledService(Number(id), id_tecnico);
        return res.status(200).json(result);
    } catch (error) {
        console.error("Erro no controller assumirCalled:", error);

        if (error.status) {
            return res.status(error.status).json({ message: error.message });
        }

        return res.status(500).json({ message: "Erro ao assumir chamado." });
    }
};

const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_status, finalizacao_descricao } = req.body;
        if (!id_status) {
            return res.status(400).json({ message: 'id_status é obrigatório' });
        }
        const result = await CalledService.updateStatusService(req.user, id, id_status, finalizacao_descricao);
        return res.status(200).json(result);
    } catch (error) {
        console.error('Erro no controller ao atualizar status:', error);
        if (error.status) return res.status(error.status).json({ message: error.message });
        return res.status(500).json({ message: 'Erro interno.' });
    }
};

const updatePrioridade = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_priority } = req.body;
        if (!id_priority) {
            return res.status(400).json({ message: 'id_priority é obrigatório' });
        }
        const result = await CalledService.updatePrioridadeService(req.user, id, id_priority);
        return res.status(200).json(result);
    } catch (error) {
        console.error('Erro no controller ao atualizar prioridade:', error);
        if (error.status) return res.status(error.status).json({ message: error.message });
        return res.status(500).json({ message: 'Erro interno.' });
    }
};

const getHistory = async (req, res) => {
    try {
        const result = await CalledService.getHistoricoService(req.user);
        return res.status(200).json(result);
    } catch (error) {
        console.error("Erro no controller:", error);
        if (error.status) return res.status(error.status).json({ message: error.message });
        return res.status(500).json({ message: "Erro interno." });
    }
};

const reopenCalled = async (req, res) => {
    try {
        const { id } = req.params;
        const { reopen_reason } = req.body;
        const result = await CalledService.reopenCalledService(req.user, id, reopen_reason);
        return res.status(200).json(result);
    } catch (error) {
        console.error("Erro no controller:", error);
        if (error.status) return res.status(error.status).json({ message: error.message });
        return res.status(500).json({ message: "Erro interno." });
    }
};

const getPendingFinancialApprovals = async (req, res) => {
    try {
        const result = await CalledService.getPendingFinancialApprovalsService(req.user);
        return res.status(200).json(result);
    } catch (error) {
        console.error("Erro no controller getPendingFinancialApprovals:", error);
        if (error.status) return res.status(error.status).json({ message: error.message });
        return res.status(500).json({ message: "Erro interno." });
    }
};

const resolveFinancialApproval = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, reason } = req.body;
        if (!status) return res.status(400).json({ message: 'status é obrigatório' });
        const result = await CalledService.resolveFinancialApprovalService(req.user, id, status, reason);
        return res.status(200).json(result);
    } catch (error) {
        console.error("Erro no controller resolveFinancialApproval:", error);
        if (error.status) return res.status(error.status).json({ message: error.message });
        return res.status(500).json({ message: "Erro interno." });
    }
};

export default {
    getAllCalleds,
    getCalledDetails,
    getCalledsByTecnico,
    assumirCalled,
    updateStatus,
    updatePrioridade,
    getHistory,
    reopenCalled,
    getPendingFinancialApprovals,
    resolveFinancialApproval
};
