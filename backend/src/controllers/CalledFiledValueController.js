import CalledFieldValueService from '../services/CalledFiledValueService.js';

const createCalledFieldValue = async (req, res) => {
    try {
        const { id_called } = req.params;
        const { fields } = req.body;

        // quem está salvando (vem do token)
        const id_user = req.user.id;

        const result = await CalledFieldValueService.createCalledFieldValueService({
            id_called,
            fields,
            id_user,
        });

        return res.status(201).json(result);

    } catch (error) {
        return res.status(400).json({
            error: error.message,
        });
    }
};

export default {
    createCalledFieldValue,
};