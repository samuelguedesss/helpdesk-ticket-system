import db from '../models/index.js';

const { Department } = db;

const getDepartmentsByCorporationRepo  = async (id_corporation) => {
    try {
        const departments = await Department.findAll({
            where: { id_corporation },       // 🔥 agora usa o ID correto
            attributes: ['id', 'name'],
            order: [['name', 'ASC']],
        });

        return departments;

    } catch (error) {
        throw new Error(`Erro no repository ao listar os Departamentos: ${error.message}`);
    }
}

const getAllDepartmentsRepo  = async () => {
    try {
        const departments = await Department.findAll({
            attributes: ['id', 'name'],
            order: [['name', 'ASC']],
        }); 

        return departments;

    } catch (error) {
        throw new Error(`Erro no repository ao listar todos os Departamentos: ${error.message}`);
    }
}

export default {
    getDepartmentsByCorporationRepo,
    getAllDepartmentsRepo
};