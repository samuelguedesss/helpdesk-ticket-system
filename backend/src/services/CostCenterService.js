import CostCenterRepository from '../repositories/CostCenterRepository.js';

// export 
const getAllCostCenterSrv = async () => {
    try {
        return await CostCenterRepository.getAllCostCentersRepo();
    } catch (error) {
        console.error('Erro no service em recuperar as Corporações: ', error);
    }   
}

export default {
    getAllCostCenterSrv,
}

