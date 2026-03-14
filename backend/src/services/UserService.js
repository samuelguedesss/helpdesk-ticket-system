import bcrypt from 'bcrypt';
import UserRepository from '../repositories/UserRepository.js';
import s3 from "../storage/s3Storage.js";

const creatUser = async ({
    name,
    email,
    password,
    id_role,
    id_corporation,
    id_department,
    foto_user
}) => {
    try {
        const registeredUser = await UserRepository.findbyEmail(email);
        if (registeredUser) {
            throw new Error('E-mail já está em uso.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await UserRepository.createUser({
            name,
            email,
            password: hashedPassword,
            id_role,
            id_corporation,
            id_department,
            foto_user
        });

        return newUser;
    } catch (error) {
        console.error('Erro no UserService:', error);
        throw error;
    }
};

const getUsersService = async () => {
    try {
        const getUsers = await UserRepository.getUsersRepo();
        return getUsers;
    } catch (error) {
        console.error('Erro no Service ao obter usuários:', error);
        throw error;
    }
};

const getUsertecnicosSevice = async () => {
    try {
        const getUsersTecnicos = await UserRepository.getUsersTecnicoRepo();
        return getUsersTecnicos
    } catch (error) {
        console.error('Erro no Service ao obter tecnicos:', error);
        throw error;
    }
}

//  BUSCAR UM USUÁRIO POR ID
const getUserByIdService = async (id) => {
    try {
        const user = await UserRepository.getUserByIdRepo(id);

        if (user.foto_user) {
            const url = await s3.getPresignedUrl({ key: user.foto_user });
            user.foto_user = url;
        }

        return user;
    } catch (error) {
        console.error('Erro no Service ao buscar usuário:', error);
        throw error;
    }
};

//  ATUALIZAR APENAS STATUS (ativo/inativo)
const updateUserStatusService = async (id, ativo) => {
    try {
        // Validar se ativo é 0 ou 1
        if (ativo !== 0 && ativo !== 1) {
            throw new Error('O campo "ativo" deve ser 0 (inativo) ou 1 (ativo)');
        }

        const user = await UserRepository.updateUserStatusRepo(id, ativo);
        return user;
    } catch (error) {
        console.error('Erro no Service ao atualizar status do usuário:', error);
        throw error;
    }
};

// ATUALIZAR USUÁRIO COMPLETO
const updateUserService = async (id, data) => {
    try {
        // Validar se está tentando mudar o email
        if (data.email) {
            const userWithEmail = await UserRepository.findbyEmail(data.email);
            // Se encontrou usuário com esse email E não é o próprio usuário
            if (userWithEmail && userWithEmail.id !== parseInt(id)) {
                throw new Error('E-mail já está em uso por outro usuário');
            }
        }

        const updatedUser = await UserRepository.updateUserRepo(id, data);
        return updatedUser;
    } catch (error) {
        console.error('Erro no Service ao atualizar usuário:', error);
        throw error;
    }
};

const changePasswordService = async (id, currentPassword, newPassword) => {
    const user = await UserRepository.findById(id); // vou mostrar abaixo
    if (!user) throw new Error('Usuário não encontrado');

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new Error('Senha atual incorreta');

    if (newPassword.length < 6) throw new Error('A nova senha deve ter pelo menos 6 caracteres');

    const hashed = await bcrypt.hash(newPassword, 10);
    return await UserRepository.changePasswordRepo(id, hashed);
};

const uploadUserAvatarService = async (id_user, file) => {
    try {
        const user = await UserRepository.findById(id_user);
        if (!user) throw new Error("Usuário não encontrado");

        if (user.foto_user) {
            await s3.deleteFile(user.foto_user).catch(() => { });
        }

        const ext = file.originalname.split('.').pop();
        const key = `avatars/user-${id_user}.${ext}`;

        const fullKey = await s3.uploadBuffer({
            buffer: file.buffer,
            key,
            contentType: file.mimetype,
        });

        await UserRepository.updateUserRepo(id_user, { foto_user: fullKey });

        const url = await s3.getPresignedUrl({ key: fullKey });
        return { foto_user: fullKey, url };
    } catch (error) {
        throw new Error("Erro ao fazer upload do avatar: " + error.message);
    }
};

const getUserAvatarUrlService = async (id_user) => {
    const user = await UserRepository.findById(id_user);
    if (!user) throw new Error("Usuário não encontrado");
    if (!user.foto_user) return { url: null };

    const url = await s3.getPresignedUrl({ key: user.foto_user });
    return { url };
};

const deleteUserAvatarService = async (id_user) => {
    try {
        const user = await UserRepository.findById(id_user);
        if (!user) throw new Error("Usuário não encontrado");

        if (user.foto_user) {
            await s3.deleteFile(user.foto_user).catch(() => { });
        }

        await UserRepository.updateUserRepo(id_user, { foto_user: null });
    } catch (error) {
        throw new Error("Erro ao remover avatar: " + error.message);
    }
};

export default {
    creatUser,
    getUsersService,
    getUserByIdService,
    updateUserStatusService,
    updateUserService,
    getUsertecnicosSevice,
    changePasswordService,
    uploadUserAvatarService,
    getUserAvatarUrlService,
    deleteUserAvatarService
};