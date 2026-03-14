import UserService from '../services/UserService.js';

const creatUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            id_role,
            id_corporation,
            id_department,
        } = req.body;

        const foto_user = null;

        const newUser = await UserService.creatUser({
            name,
            email,
            password,
            id_role,
            id_corporation,
            id_department,
            foto_user
        });

        return res.status(201).json({
            mensagem: 'Usuário criado com sucesso.',
            usuario: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                empresa: newUser.id_corporation,
                role: newUser.id_role,
            },
        });

    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        return res.status(400).json({ mensagem: error.message || 'Erro ao criar usuário.' });
    }
};

const getUsers = async (req, res) => {
    try {
        const getUsers = await UserService.getUsersService();
        return res.status(200).json(getUsers);

    } catch (error) {
        console.error('Erro ao obter usuários:', error);
        return res.status(500).json({ mensagem: 'Erro ao obter usuários.' });
    }
};

const getUsertecnicos = async (req, res) => {
    try {
        const getUsertecnicos = await UserService.getUsertecnicosSevice();
        return res.status(200).json(getUsertecnicos);
    } catch (error) {
        console.error('Erro ao obter tecnicos:', error);
        return res.status(500).json({ mensagem: 'Erro ao obter tecnicos.' });
    }
}

//BUSCAR UM USUÁRIO POR ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                mensagem: 'ID do usuário é obrigatório'
            });
        }

        const user = await UserService.getUserByIdService(Number(id));

        return res.status(200).json(user);

    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        return res.status(400).json({ mensagem: error.message });
    }
};

//ATUALIZAR APENAS STATUS (ativo/inativo)
const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { ativo } = req.body;

        if (!id) {
            return res.status(400).json({
                mensagem: 'ID do usuário é obrigatório'
            });
        }

        if (ativo === undefined || ativo === null) {
            return res.status(400).json({
                mensagem: 'O campo "ativo" é obrigatório'
            });
        }

        const user = await UserService.updateUserStatusService(Number(id), ativo);

        return res.status(200).json({
            mensagem: 'Status do usuário atualizado com sucesso',
            usuario: user
        });

    } catch (error) {
        console.error('Erro ao atualizar status do usuário:', error);
        return res.status(400).json({ mensagem: error.message });
    }
};

//ATUALIZAR USUÁRIO COMPLETO
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            email,
            password,
            id_role,
            id_corporation,
            id_department,
            id_cost_center,
            ativo
        } = req.body;

        if (!id) {
            return res.status(400).json({
                mensagem: 'ID do usuário é obrigatório'
            });
        }

        const dataToUpdate = {};
        if (name !== undefined) dataToUpdate.name = name;
        if (email !== undefined) dataToUpdate.email = email;
        if (id_role !== undefined) dataToUpdate.id_role = id_role;
        if (id_corporation !== undefined) dataToUpdate.id_corporation = id_corporation;
        if (id_department !== undefined) dataToUpdate.id_department = id_department;
        if (id_cost_center !== undefined) dataToUpdate.id_cost_center = id_cost_center;
        if (ativo !== undefined) dataToUpdate.ativo = ativo;

        const updatedUser = await UserService.updateUserService(Number(id), dataToUpdate);

        return res.status(200).json({
            mensagem: 'Usuário atualizado com sucesso',
            usuario: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
            }
        });

    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        return res.status(400).json({ mensagem: error.message });
    }
};

const changePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ mensagem: 'As senhas não coincidem' });
        }

        await UserService.changePasswordService(Number(id), currentPassword, newPassword);

        return res.status(200).json({ mensagem: 'Senha alterada com sucesso' });

    } catch (error) {
        console.error('Erro ao alterar senha:', error);
        return res.status(400).json({ mensagem: error.message });
    }
};

const uploadAvatar = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.file) {
            return res.status(400).json({ mensagem: "Nenhum arquivo enviado" });
        }

        const result = await UserService.uploadUserAvatarService(Number(id), req.file);

        return res.status(200).json({
            mensagem: "Avatar atualizado com sucesso",
            ...result,
        });
    } catch (error) {
        console.error("Erro ao fazer upload do avatar:", error);
        return res.status(400).json({ mensagem: error.message });
    }
};

const getAvatarUrl = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await UserService.getUserAvatarUrlService(Number(id));

        return res.status(200).json(result);
    } catch (error) {
        console.error("Erro ao buscar avatar:", error);
        return res.status(500).json({ mensagem: error.message });
    }
};

const deleteAvatar = async (req, res) => {
    try {
        const { id } = req.params;
        await UserService.deleteUserAvatarService(Number(id));
        return res.status(200).json({ mensagem: "Avatar removido com sucesso" });
    } catch (error) {
        console.error("Erro ao remover avatar:", error);
        return res.status(400).json({ mensagem: error.message });
    }
};

export default {
    creatUser,
    getUsers,
    getUserById,
    updateUserStatus,
    updateUser,
    getUsertecnicos,
    changePassword,
    uploadAvatar,
    getAvatarUrl,
    deleteAvatar
};