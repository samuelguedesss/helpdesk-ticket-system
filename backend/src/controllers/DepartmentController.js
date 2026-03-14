import DepartmentService from '../services/DepartmentService.js';

 const getDepartmentById = async (req, res) => {
    try {
        const { id_corporation } = req.params
        const departments = await DepartmentService.getDepartmentsByCorporationSrv(id_corporation);
        return res.status(200).json(departments)
    } catch (error) {
        console.error('Erro no controller em recuperar os Departamentos relacionados as const center: ', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

const getDepartments = async (req, res) => {
    try {
        const departments = await DepartmentService.getAllDepartmentsSrv();
        return res.status(200).json(departments)
    } catch (error) {
        console.error('Erro no controller em recuperar os Departamentos: ', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
}


export default {
    getDepartmentById,
    getDepartments
};