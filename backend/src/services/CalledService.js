import CalledRepository from "../repositories/CalledRepository.js";
import CalledFieldValueRepository from "../repositories/CalledFiledValueRepository.js";
import NotificationService from './NotificationService.js';

const formatTimeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 60000);
    if (diff < 60) return `${diff}min`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h`;
    return `${Math.floor(diff / 1440)}d`;
};

const getAllCalledsService = async (user, filters) => {
    try {
        const calleds = await CalledRepository.getAllCalledRepo(filters);

        let result = calleds;

        if (user.role !== 1) {
            result = calleds.filter(c => c.id_user === user.id);
        }

        return result.map(called => ({
            id: called.id,
            status: called.status.name,
            categoria: called.category?.name ?? null,
            responsavel: called.responsible?.name ?? 'Aguardando Tecnico responsavel',
            prioridade: called.priority?.name ?? null,
            financial_approval_required: called.financial_approval_required,
            financial_approval_status: called.financial_approval_status,
            reopen_reason: called.reopen_reason
        }));

    } catch (error) {
        console.error('Erro no service ao listar chamados: ', error);
        throw error;
    }
};

const getCalledDetailsService = async (user, id) => {
    try {
        const called = await CalledRepository.findByIdWithDetailsRepo(id);

        if (!called) {
            const err = new Error('Chamado não encontrado');
            err.status = 404;
            throw err;
        }

        if (
            user.role !== 1 &&
            user.role !== 2 &&
            user.department_id !== 7 &&
            called.id_user !== user.id
        ) {
            const err = new Error('Acesso negado');
            err.status = 403;
            throw err;
        }

        const fields = await CalledFieldValueRepository.findByCalledIdWithFieldsRepo(id);

        return {
            id: called.id,
            status: called.status?.name ?? null,
            created_at: called.opening_date,
            categoria: called.category?.name ?? null,
            subcategoria: called.subcategory?.name ?? null,
            descricao: called.description,
            prioridade: called.priority?.name ?? null,
            financial_approval_required: called.financial_approval_required,
            financial_approval_status: called.financial_approval_status,
            financial_approval_reason: called.financial_approval_reason,
            reopen_reason: called.reopen_reason,
            solicitante: {
                nome: called.user?.name ?? null,
                departamento: called.user?.department?.name ?? null
            },
            responsavel: called.responsible?.name ?? 'Aguardando Tecnico responsavel',
            fields: fields.map(f => ({
                label: f.field.label,
                type: f.field.type,
                value: f.value
            }))
        };

    } catch (error) {
        console.error('Erro no service ao buscar detalhes do chamado: ', error);
        throw error;
    }
};

const getCalledsByTecnicoService = async (id_tecnico, filters) => {
    try {
        const calleds = await CalledRepository.getCalledsByTecnicoRepo(id_tecnico, filters);

        return calleds.map(c => ({
            id: c.id,
            categoria: c.category?.name ?? null,
            status: c.status?.name ?? null,
            solicitante: c.user?.name ?? null,
            responsavel: c.responsible?.name ?? null,
            prioridade: c.priority?.name ?? null,
            criadoHa: formatTimeAgo(c.opening_date),
            assumido: !!c.id_responsible,
            financial_approval_required: c.financial_approval_required,
            financial_approval_status: c.financial_approval_status,
            reopen_reason: c.reopen_reason,
        }));

    } catch (error) {
        console.error('Erro no service ao listar chamados do técnico: ', error);
        throw error;
    }
};

const assumirCalledService = async (id, id_tecnico) => {
    try {
        const called = await CalledRepository.findByIdWithDetailsRepo(id);
        if (!called) {
            const err = new Error('Chamado não encontrado');
            err.status = 404;
            throw err;
        }

        if (called.financial_approval_required && called.financial_approval_status !== 'approved') {
            const err = new Error('Este chamado aguarda aceite financeiro para ser assumido');
            err.status = 403;
            throw err;
        }

        const updated = await CalledRepository.assumirCalledRepo(id, id_tecnico);
        return {
            message: 'Chamado assumido com sucesso',
            id: updated.id,
            id_responsible: updated.id_responsible,
            id_status: updated.id_status,
        };
    } catch (error) {
        console.error('Erro no service ao assumir chamado: ', error);
        throw error;
    }
};

const updateStatusService = async (user, id, id_status, finalizacao_descricao) => {
    try {
        const called = await CalledRepository.findByIdWithDetailsRepo(id);
        if (!called) {
            const err = new Error('Chamado não encontrado');
            err.status = 404;
            throw err;
        }
        if (called.id_responsible !== user.id) {
            const err = new Error('Apenas o técnico responsável pode alterar o status');
            err.status = 403;
            throw err;
        }
        if (Number(id_status) === 1) {
            const err = new Error('Não é permitido retornar o chamado para Aberto');
            err.status = 400;
            throw err;
        }
        if (Number(id_status) === 4 && !finalizacao_descricao?.trim()) {
            const err = new Error('Descrição de finalização é obrigatória');
            err.status = 400;
            throw err;
        }

        const updated = await CalledRepository.updateStatusRepo(id, id_status, finalizacao_descricao);

        // Notifica o solicitante quando o chamado for finalizado
        if (Number(id_status) === 4) {
            try {
                await NotificationService.createNotification({
                    user_id: called.id_user,
                    title: `Chamado #${called.id} finalizado`,
                    message: `O técnico ${user.nome} concluiu o atendimento e encerrou o chamado.`,
                    type: 'called_finished',
                });
            } catch (notifError) {
                console.error('❌ Erro ao criar notificação de finalização:', notifError.message);
            }
        }

        return { message: 'Status atualizado com sucesso', id: updated.id, id_status: updated.id_status };
    } catch (error) {
        console.error('Erro no service ao atualizar status: ', error);
        throw error;
    }
};

const updatePrioridadeService = async (user, id, id_priority) => {
    try {
        const called = await CalledRepository.findByIdWithDetailsRepo(id);
        if (!called) {
            const err = new Error('Chamado não encontrado');
            err.status = 404;
            throw err;
        }
        if (called.id_responsible !== user.id) {
            const err = new Error('Apenas o técnico responsável pode alterar a prioridade');
            err.status = 403;
            throw err;
        }
        const updated = await CalledRepository.updatePrioridadeRepo(id, id_priority);
        return { message: 'Prioridade atualizada com sucesso', id: updated.id, id_priority: updated.id_priority };
    } catch (error) {
        console.error('Erro no service ao atualizar prioridade: ', error);
        throw error;
    }
};

const getHistoricoService = async (user) => {
    try {
        const filters = { id_status: 4 };

        if (user.department_id === 7) {
            filters.financial_approval_user_id = user.id;
        } else if (user.role === 3) {
            filters.id_user = user.id;
        } else if (user.role === 2) {
            filters.id_responsible = user.id;
        }

        const calleds = await CalledRepository.getHistoryRepo(filters);

        return calleds.map(called => ({
            id: called.id,
            status: called.status?.name ?? null,
            categoria: called.category?.name ?? null,
            responsavel: called.financial_approval_status === 'rejected'
                ? called.financialApprovalUser?.name ?? '-'
                : called.responsible?.name ?? '-',
            solicitante: called.user?.name ?? '-',
            prioridade: called.priority?.name ?? null,
            closing_date: called.closing_date,
            financial_approval_required: called.financial_approval_required,
            financial_approval_status: called.financial_approval_status,
            finalizacao_descricao: called.finalizacao_descricao,
            pode_reabrir: called.closing_date
                ? (new Date() - new Date(called.closing_date)) / (1000 * 60 * 60) <= 48
                : false,
        }));
    } catch (error) {
        console.error('Erro no service ao buscar histórico: ', error);
        throw error;
    }
};

const reopenCalledService = async (user, id, reopen_reason) => {
    try {
        const called = await CalledRepository.findByIdWithDetailsRepo(id);
        if (!called) {
            const err = new Error('Chamado não encontrado');
            err.status = 404;
            throw err;
        }

        if (user.role === 3 && called.id_user !== user.id) {
            const err = new Error('Acesso negado');
            err.status = 403;
            throw err;
        }
        if (user.role === 2 && called.id_responsible !== user.id) {
            const err = new Error('Acesso negado');
            err.status = 403;
            throw err;
        }

        const horas = (new Date() - new Date(called.closing_date)) / (1000 * 60 * 60);
        if (horas > 48) {
            const err = new Error('Prazo de reabertura expirado');
            err.status = 400;
            throw err;
        }

        if (!reopen_reason || !reopen_reason.trim()) {
            const err = new Error('Motivo de reabertura é obrigatório');
            err.status = 400;
            throw err;
        }

        const updated = await CalledRepository.reopenCalledRepo(id, reopen_reason);

        // Notificações de reabertura
        try {
            const notifPromises = [];

            // Notifica o técnico responsável se houver
            if (called.id_responsible) {
                notifPromises.push(
                    NotificationService.createNotification({
                        user_id: called.id_responsible,
                        title: `Chamado #${called.id} foi reaberto`,
                        message: `O chamado foi reaberto. Motivo: ${reopen_reason}`,
                        type: 'new_called',
                    })
                );
            }

            // Notifica o financeiro se o chamado tiver aceite financeiro
            if (called.financial_approval_required && called.financial_approval_user_id) {
                notifPromises.push(
                    NotificationService.createNotification({
                        user_id: called.financial_approval_user_id,
                        title: `Chamado #${called.id} foi reaberto`,
                        message: `O chamado com aceite financeiro foi reaberto. Motivo: ${reopen_reason}`,
                        type: 'new_called',
                    })
                );
            }

            await Promise.all(notifPromises);
        } catch (notifError) {
            console.error('❌ Erro ao criar notificação de reabertura:', notifError.message);
        }

        return { message: 'Chamado reaberto com sucesso', id: updated.id };
    } catch (error) {
        console.error('Erro no service ao reabrir chamado: ', error);
        throw error;
    }
};

const getPendingFinancialApprovalsService = async (user) => {
    try {
        if (user.department_id !== 7) {
            const err = new Error('Acesso negado');
            err.status = 403;
            throw err;
        }
        const calleds = await CalledRepository.getPendingFinancialApprovalsRepo();
        return calleds.map(c => {
            const valorField = c.fieldValues?.find(fv => fv.field?.label === 'Valor');
            return {
                id: c.id,
                solicitante: c.user?.name ?? '-',
                categoria: c.category?.name ?? '-',
                subcategoria: c.subcategory?.name ?? '-',
                opening_date: c.opening_date,
                financial_approval_status: c.financial_approval_status,
                valor: valorField?.value ?? null,
            };
        });
    } catch (error) {
        console.error('Erro no service ao buscar aprovações pendentes: ', error);
        throw error;
    }
};

const resolveFinancialApprovalService = async (user, id, status, reason) => {
    try {
        if (user.department_id !== 7) {
            const err = new Error('Acesso negado');
            err.status = 403;
            throw err;
        }

        if (!['approved', 'rejected'].includes(status)) {
            const err = new Error('Status inválido');
            err.status = 400;
            throw err;
        }

        if (status === 'rejected' && !reason?.trim()) {
            const err = new Error('Justificativa é obrigatória para rejeição');
            err.status = 400;
            throw err;
        }

        const called = await CalledRepository.findByIdWithDetailsRepo(id);
        if (!called) {
            const err = new Error('Chamado não encontrado');
            err.status = 404;
            throw err;
        }

        if (called.financial_approval_status !== 'pending') {
            const err = new Error('Este chamado já foi analisado');
            err.status = 409;
            throw err;
        }

        const updated = await CalledRepository.resolveFinancialApprovalRepo(id, status, reason, user.id);

        // Notifica o solicitante sobre o resultado do aceite financeiro
        try {
            await NotificationService.createNotification({
                user_id: called.id_user,
                title: status === 'approved'
                    ? `Aceite financeiro aprovado — Chamado #${called.id}`
                    : `Aceite financeiro rejeitado — Chamado #${called.id}`,
                message: status === 'approved'
                    ? `Seu chamado #${called.id} teve o aceite financeiro aprovado e já pode ser atendido.`
                    : `Seu chamado #${called.id} teve o aceite financeiro rejeitado. Motivo: ${reason}`,
                type: status === 'approved' ? 'approval_approved' : 'approval_rejected',
            });
        } catch (notifError) {
            console.error('❌ Erro ao criar notificação de aceite financeiro:', notifError.message);
        }

        return {
            message: `Chamado ${status === 'approved' ? 'aprovado' : 'rejeitado'} com sucesso`,
            id: updated.id,
            financial_approval_status: updated.financial_approval_status,
        };
    } catch (error) {
        console.error('Erro no service ao resolver aprovação financeira: ', error);
        throw error;
    }
};

export default {
    getAllCalledsService,
    getCalledDetailsService,
    getCalledsByTecnicoService,
    assumirCalledService,
    updateStatusService,
    updatePrioridadeService,
    getHistoricoService,
    reopenCalledService,
    getPendingFinancialApprovalsService,
    resolveFinancialApprovalService
};