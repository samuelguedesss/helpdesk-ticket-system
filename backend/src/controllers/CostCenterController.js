import CostCenterService from '../services/CostCenterService.js';

const getAllCostCenters = async (req, res) => {
    try {
        const costCenter = await CostCenterService.getAllCostCenterSrv();
        return res.status(200).json(costCenter)
    } catch (error) {
        console.error('Erro no controller em recuperar as Corporações: ', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

export default {
    getAllCostCenters,
};

