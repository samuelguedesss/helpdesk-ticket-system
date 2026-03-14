import calledOpenService from '../services/CalledOpenService.js';

const calledOpen = async (req, res) => {
    try {
        const { id_category, id_subcategory } = req.body;

        //  vem do token (middleware JWT)
        const id_user = req.user.id;

        const called = await calledOpenService.createCalledService({
            id_user,
            id_category,
            id_subcategory,
        });

        return res.status(201).json(called);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export default { calledOpen };
