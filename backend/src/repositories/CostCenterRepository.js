import db from '../models/index.js'

const { CostCenter } = db;

const getAllCostCentersRepo = async () => {
    try {
        const costCenters = await CostCenter.findAll({
            attributes: ['id', 'name'],
        });

        return costCenters;

    } catch (error) {
        throw new Error(`Erro no repository ao listar as Corporações: ${error.message}`);
    }
};

export default {
    getAllCostCentersRepo,
};