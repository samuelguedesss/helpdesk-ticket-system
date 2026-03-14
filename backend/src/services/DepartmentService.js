import DepartmentRepository from '../repositories/DepartmentRepository.js';

const getDepartmentsByCorporationSrv = async (id_corporation) => {
    try {
        return await DepartmentRepository.getDepartmentsByCorporationRepo(id_corporation);
    } catch (error) {
        console.error('Erro no service em recuperar os Departamentos: ', error);
        throw error;
    }
}

const getAllDepartmentsSrv = async () => {
    try {
        return await DepartmentRepository.getAllDepartmentsRepo();
    } catch (error) {
        console.error('Erro no service em recuperar todos os Departamentos: ', error);
        throw error;
    }
}

export default {
    getDepartmentsByCorporationSrv,
    getAllDepartmentsSrv
}