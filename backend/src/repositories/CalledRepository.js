import db from '../models/index.js';
import { Op } from "sequelize";

const FINANCIAL_APPROVAL_SUBCATEGORIES = [16];
const { Called, Category, User, StatusCalled, Subcategory, Department, UserCategory, Priority, CalledFieldValue, SubcategoryFormField } = db;

const getAllCalledRepo = async (filters) => {
    try {
        const where = {
            id_status: { [Op.ne]: 4 }
        };

        if (filters?.id_user) {
            where.id_user = filters.id_user;
        }

        if (filters?.id_status) {
            where.id_status = filters.id_status;
        }

        if (filters?.id_category) {
            where.id_category = filters.id_category;
        }

        if (filters?.id) {
            where.id = filters.id;
        }

        if (filters?.search) {
            where[Op.or] = [
                { id: filters.search },
                { "$category.name$": { [Op.like]: `%${filters.search}%` } },
                { "$status.name$": { [Op.like]: `%${filters.search}%` } },
                { "$responsible.name$": { [Op.like]: `%${filters.search}%` } },
            ];
        }

        const calleds = await Called.findAll({
            where,
            attributes: ['id', 'id_user', 'id_status', 'financial_approval_required', 'financial_approval_status', 'reopen_reason'],
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name'],
                },
                {
                    model: User,
                    as: 'responsible',
                    attributes: ['id', 'name'],
                    required: false,
                },
                {
                    model: StatusCalled,
                    as: 'status',
                    attributes: ['id', 'name'], // 👈 aqui está o "ABERTO"
                },
                {
                    model: Priority,
                    as: 'priority',
                    attributes: ['id', 'name'],
                    required: false,
                },
            ],
            order: [['id', 'DESC']],
        });

        return calleds;

    } catch (error) {
        throw new Error(`Erro no repository ao listar chamados: ${error.message}`);
    }
};

const findByIdWithDetailsRepo = async (id) => {
    try {
        return await Called.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name'],
                    required: false,
                    include: [
                        {
                            model: Department,
                            as: 'department',
                            attributes: ['id', 'name'],
                        }
                    ]
                },
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name'],
                },
                {
                    model: Subcategory,
                    as: 'subcategory',
                    attributes: ['id', 'name'],
                },
                {
                    model: StatusCalled,
                    as: 'status',
                    attributes: ['id', 'name'],
                },
                {
                    model: User,
                    as: 'responsible',
                    attributes: ['id', 'name'],
                    required: false,
                },
                {
                    model: Priority,
                    as: 'priority',
                    attributes: ['id', 'name'],
                    required: false,
                },
            ]
        });
    } catch (error) {
        throw new Error('Erro ao buscar detalhes do chamado: ' + error.message);
    }
};


const getCalledsByTecnicoRepo = async (id_tecnico, filters = {}) => {
    try {
        const where = {};

        where.id_status = filters.id_status
            ? Number(filters.id_status)
            : { [Op.in]: [1, 2, 3] };

        if (filters?.id_category) where.id_category = filters.id_category;
        if (filters?.id) where.id = filters.id;

        //usa Op.and para não conflitar com search
        const responsavelCondition = {
            [Op.or]: [
                { id_responsible: null },
                { id_responsible: id_tecnico },
            ]
        };

        if (filters?.search) {
            where[Op.and] = [
                responsavelCondition,
                {
                    [Op.or]: [
                        { id: isNaN(filters.search) ? null : Number(filters.search) },
                        { "$category.name$": { [Op.like]: `%${filters.search}%` } },
                        { "$user.name$": { [Op.like]: `%${filters.search}%` } },
                    ]
                }
            ];
        } else {
            where[Op.and] = [responsavelCondition];
        }

        const calleds = await Called.findAll({
            where,
            attributes: ['id', 'id_user', 'id_responsible', 'id_status', 'opening_date', 'financial_approval_required', 'financial_approval_status', 'reopen_reason'],
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name'],
                    required: true,
                    include: [
                        {
                            model: UserCategory,
                            as: 'userCategories',
                            where: { id_user: id_tecnico },
                            attributes: [],
                            required: true,
                        },
                    ],
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name'],
                    required: false,
                },
                {
                    model: User,
                    as: 'responsible',
                    attributes: ['id', 'name'],
                    required: false,
                },
                {
                    model: StatusCalled,
                    as: 'status',
                    attributes: ['id', 'name'],
                },
                {
                    model: Priority,
                    as: 'priority',
                    attributes: ['id', 'name'],
                    required: false,
                },
            ],
            order: [['id', 'DESC']],
        });

        return calleds;

    } catch (error) {
        throw new Error(`Erro no repository ao listar chamados do técnico: ${error.message}`);
    }
};

const getHistoryRepo = async (filters) => {
    const where = { id_status: 4 };
    if (filters?.id_user) where.id_user = filters.id_user;
    if (filters?.id_responsible) where.id_responsible = filters.id_responsible;
    if (filters?.financial_approval_user_id) where.financial_approval_user_id = filters.financial_approval_user_id;

    return await Called.findAll({
        where,
        attributes: ['id', 'id_user', 'id_responsible', 'id_status', 'closing_date', 'finalizacao_descricao', 'financial_approval_user_id', 'financial_approval_status', 'financial_approval_required'],
        include: [
            { model: Category, as: 'category', attributes: ['id', 'name'] },
            { model: User, as: 'responsible', attributes: ['id', 'name'], required: false },
            { model: User, as: 'user', attributes: ['id', 'name'], required: false },
            { model: StatusCalled, as: 'status', attributes: ['id', 'name'] },
            { model: Priority, as: 'priority', attributes: ['id', 'name'], required: false },
            { model: User, as: 'financialApprovalUser', foreignKey: 'financial_approval_user_id', attributes: ['id', 'name'], required: false },
        ],
        order: [['closing_date', 'DESC']],
    });
};

const reopenCalledRepo = async (id, reopen_reason) => {
    const called = await Called.findByPk(id);
    if (!called) {
        const err = new Error('Chamado não encontrado');
        err.status = 404;
        throw err;
    }

    const updateData = {
        id_status: 1,
        closing_date: null,
        finalizacao_descricao: null,
        reopen_reason: reopen_reason ?? null,
    };

    if (called.financial_approval_required && called.financial_approval_status === 'rejected') {
        updateData.financial_approval_status = 'pending';
        updateData.financial_approval_reason = null;
        updateData.financial_approval_date = null;
        updateData.financial_approval_user_id = null;
    }

    await called.update(updateData);
    return called;
};


const assumirCalledRepo = async (id, id_tecnico) => {
    try {
        const called = await Called.findByPk(id);

        if (!called) {
            const err = new Error('Chamado não encontrado');
            err.status = 404;
            throw err;
        }

        if (called.id_responsible) {
            const err = new Error('Chamado já foi assumido por outro técnico');
            err.status = 409;
            throw err;
        }

        await called.update({
            id_responsible: id_tecnico,
            id_status: 2, // Em andamento
        });

        return called;

    } catch (error) {
        throw error;
    }
};

const updateStatusRepo = async (id, id_status, finalizacao_descricao = null) => {
    try {
        const called = await Called.findByPk(id);
        if (!called) {
            const err = new Error('Chamado não encontrado');
            err.status = 404;
            throw err;
        }

        const updateData = { id_status };
        if (finalizacao_descricao) updateData.finalizacao_descricao = finalizacao_descricao;
        if (Number(id_status) === 4) updateData.closing_date = new Date(); // ← seta ao finalizar
        if (Number(id_status) !== 4) updateData.closing_date = null;       // ← limpa se reabrir

        await called.update(updateData);
        return called;
    } catch (error) {
        throw error;
    }
};

const updatePrioridadeRepo = async (id, id_priority) => {
    try {
        const called = await Called.findByPk(id);
        if (!called) {
            const err = new Error('Chamado não encontrado');
            err.status = 404;
            throw err;
        }
        await called.update({ id_priority });
        return called;
    } catch (error) {
        throw error;
    }
};

const getPendingFinancialApprovalsRepo = async () => {
    try {
        return await Called.findAll({
            where: {
                financial_approval_required: 1,
                financial_approval_status: 'pending',
            },
            attributes: [
                'id', 'id_user', 'id_subcategory', 'opening_date',
                'financial_approval_required', 'financial_approval_status',
            ],
            include: [
                { model: Category, as: 'category', attributes: ['id', 'name'] },
                { model: Subcategory, as: 'subcategory', attributes: ['id', 'name'] },
                { model: User, as: 'user', attributes: ['id', 'name'] },
                { model: Priority, as: 'priority', attributes: ['id', 'name'], required: false },
                {
                    model: CalledFieldValue,
                    as: 'fieldValues',
                    attributes: ['id_field', 'value'],
                    required: false,
                    include: [
                        {
                            model: SubcategoryFormField,
                            as: 'field',
                            attributes: ['id', 'label', 'type'],
                            required: false,
                        }
                    ]
                },
            ],
            order: [['opening_date', 'ASC']],
        });
    } catch (error) {
        throw new Error(`Erro ao buscar aprovações pendentes: ${error.message}`);
    }
};

const resolveFinancialApprovalRepo = async (id, status, reason = null, id_user) => {
    try {
        const called = await Called.findByPk(id);
        if (!called) {
            const err = new Error('Chamado não encontrado');
            err.status = 404;
            throw err;
        }
        const updateData = {
            financial_approval_status: status,
            financial_approval_date: new Date(),
            financial_approval_user_id: id_user,
        };
        if (reason) updateData.financial_approval_reason = reason;

        // Se rejeitado — finaliza o chamado automaticamente
        if (status === 'rejected') {
            updateData.id_status = 4;
            updateData.closing_date = new Date();
            updateData.finalizacao_descricao = `Rejeitado pelo financeiro: ${reason}`;
        }

        await called.update(updateData);
        return called;
    } catch (error) {
        throw error;
    }
};

const setFinancialApprovalOnCreateRepo = (data) => {
    const required = FINANCIAL_APPROVAL_SUBCATEGORIES.includes(Number(data.id_subcategory));
    return {
        ...data,
        financial_approval_required: required ? 1 : 0,
        financial_approval_status: required ? 'pending' : null,
    };
};


export default {
    getAllCalledRepo,
    findByIdWithDetailsRepo,
    getCalledsByTecnicoRepo,
    assumirCalledRepo,
    updateStatusRepo,
    updatePrioridadeRepo,
    getHistoryRepo,
    reopenCalledRepo,
    getPendingFinancialApprovalsRepo,
    resolveFinancialApprovalRepo,
    setFinancialApprovalOnCreateRepo
};
