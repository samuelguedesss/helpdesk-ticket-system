import db from '../models/index.js'

const { User, Department, CostCenter } = db;

const findbyEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

const createUser = async (data) => {
  return await User.create(data);
};

const getUsersRepo = async () => {
  return await User.findAll({
    where: {
    id_role: 3  // FILTRAR APENAS USUÁRIOS COM role_id = 3
    },
    attributes: {
      exclude: ["id_department", "id_corporation"]
    },
    include: [
      {
        model: Department,
        as: "department",
        attributes: ["name"],
      },
      {
        model: CostCenter,
        as: "costCenter",
        attributes: ["name"],
      }
    ]
  });
};


const getUsersTecnicoRepo = async () => {
  return await User.findAll({
    where: {
    id_role: 2  // FILTRAR APENAS tecnicos COM role_id = 2
    },
    attributes: {
      exclude: ["id_department", "id_corporation"]
    },
    include: [
      {
        model: Department,
        as: "department",
        attributes: ["name"],
      },
      {
        model: CostCenter,
        as: "costCenter",
        attributes: ["name"],
      }
    ]
  });
};

const getUserByIdRepo = async (id) => {
  try {
    const user = await User.findByPk(id, {
      attributes: {
        exclude: ["password"] // NÃO RETORNAR SENHA
      },
      include: [
        {
          model: Department,
          as: "department",
          attributes: ["id", "name"],
        },
        {
          model: CostCenter,
          as: "costCenter",
          attributes: ["id", "name"],
        }
      ]
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    return user;

  } catch (error) {
    throw error;
  }
};

// ATUALIZAR APENAS STATUS (ativo/inativo)
const updateUserStatusRepo = async (id, ativo) => {
  try {
    const user = await User.findByPk(id);
    
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    await user.update({ ativo });

    return user;
  } catch (error) {
    throw error;
  }
};

// ATUALIZAR USUÁRIO COMPLETO
const updateUserRepo = async (id, data) => {
  try {
    const user = await User.findByPk(id);
    
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Atualizar apenas campos fornecidos
    await user.update({
      name: data.name !== undefined ? data.name : user.name,
      email: data.email !== undefined ? data.email : user.email,
      id_department: data.id_department !== undefined ? data.id_department : user.id_department,
      id_cost_center: data.id_cost_center !== undefined ? data.id_cost_center : user.id_cost_center,
      id_role: data.id_role !== undefined ? data.id_role : user.id_role,
      ativo: data.ativo !== undefined ? data.ativo : user.ativo,
      foto_user: data.foto_user !== undefined ? data.foto_user : user.foto_user,
    });

    return user;
  } catch (error) {
    throw error;
  }
};

const changePasswordRepo = async (id, newHashedPassword) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error('Usuário não encontrado');
  await user.update({ password: newHashedPassword });
  return user;
};

const findById = async (id) => {
  return await User.findByPk(id); // retorna com senha para comparação
};


export default {
  findbyEmail,
  createUser,
  getUsersRepo,
  getUsersTecnicoRepo,
  getUserByIdRepo,
  updateUserStatusRepo,
  updateUserRepo,
  changePasswordRepo,
  findById
};