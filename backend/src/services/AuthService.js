import bcrypt from 'bcrypt';
import generateToken from '../utils/GenereteToken.js';
import UserRepository from '../repositories/UserRepository.js';

export const login = async (email, password) => {
    const user = await UserRepository.findbyEmail(email);

    if (!user) {
        throw new Error('Usuário não encontrado.');
    }

    if (user.ativo === 0) {
        throw new Error('Usuário inativo. Contate o administrador.');
    }
    const correctPassword = await bcrypt.compare(password, user.password);

    if (!correctPassword) {
        throw new Error('Senha inválida.');
    }

    const token = generateToken({
        id: user.id,
        nome: user.name,
        email: user.email,
        role: user.id_role,
        department: user.id_department,
        empresa: user.corporation
    });

    const userJson = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.id_role,
        department: user.id_department,
        token
    };

    return userJson
};

export default { login }