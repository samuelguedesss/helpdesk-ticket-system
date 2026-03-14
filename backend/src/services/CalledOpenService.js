import CalledOpenRepository from '../repositories/CalledOpenRepository.js';
import STATUS_CALLED from '../constants/StatusConstants.js';
import sendEmail from '../utils/sendEmail.js';
import NotificationService from './NotificationService.js';
import db from '../models/index.js';

const { UserCategory, User, Category } = db;

const createCalledService = async ({ id_user, id_category, id_subcategory }) => {
    if (!id_user) throw new Error('Usuário é obrigatório');
    if (!id_category) throw new Error('Categoria é obrigatória');
    if (!id_subcategory) throw new Error('Subcategoria é obrigatória');

    const called = await CalledOpenRepository.createCalledRepo({
        id_user,
        id_category,
        id_subcategory,
        id_status: STATUS_CALLED.ABERTO,
    });

    try {
        const [technicians, category, solicitante] = await Promise.all([
            UserCategory.findAll({
                where: { id_category },
                include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
            }),
            Category.findByPk(id_category, { attributes: ['name'] }),
            User.findByPk(id_user, { attributes: ['name', 'email'] }),
        ]);

        const dataAbertura = new Date(called.createdAt ?? Date.now()).toLocaleString('pt-BR');
        const statusLabel = called.financial_approval_required
            ? '<span style="color:#F9A825; font-weight:bold;">Aguardando Aceite Financeiro</span>'
            : '<span style="color:#388E3C; font-weight:bold;">Aberto</span>';

        // E-mail + notificação para cada técnico vinculado à categoria
        const technicianPromises = technicians.map(({ user }) => Promise.all([
            sendEmail({
                to: user.email,
                subject: `Novo Chamado #${called.id} — ${category?.name ?? 'Sem categoria'}`,
                html: `
                <!DOCTYPE html>
                <html lang="pt-br">
                <head>
                    <meta charset="UTF-8">
                    <title>Novo Chamado — Sistema de Chamados</title>
                </head>
                <body style="margin:0; padding:0; background-color:#F4F4F4;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F4F4F4;">
                    <tr>
                        <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF; border:1px solid #E2E8F0;">
                                <tr>
                                    <td align="center" style="padding:25px; border-bottom:4px solid #2D3E2E;">
                                        <div style="font-family:Arial,sans-serif; font-size:20px; font-weight:bold; color:#2D3E2E; letter-spacing:2px;">
                                            SISTEMA DE CHAMADOS
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:40px; font-family:Arial, Helvetica, sans-serif; color:#000;">
                                        <div style="font-size:12px; letter-spacing:2px; font-weight:bold; color:#666; margin-bottom:12px; text-transform:uppercase;">
                                            Novo Chamado Aberto
                                        </div>
                                        <div style="font-size:26px; font-weight:bold; margin-bottom:20px; text-transform:uppercase;">
                                            Chamado Aguardando Atendimento
                                        </div>
                                        <div style="font-size:15px; line-height:1.6; margin-bottom:30px;">
                                            Olá, <strong>${user.name}</strong>! Um novo chamado foi aberto na sua categoria e está aguardando atendimento.
                                        </div>
                                        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E5E5E5; background-color:#FAFAFA; margin-bottom:35px;">
                                            <tr>
                                                <td style="padding:12px 15px; font-size:12px; font-weight:bold; text-transform:uppercase;">Número do Chamado</td>
                                                <td align="right" style="padding:12px 15px; font-size:15px;">#${called.id}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:12px 15px; font-size:12px; font-weight:bold; text-transform:uppercase; border-top:1px solid #EDEDED;">Categoria</td>
                                                <td align="right" style="padding:12px 15px; font-size:15px; border-top:1px solid #EDEDED;">${category?.name ?? '-'}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:12px 15px; font-size:12px; font-weight:bold; text-transform:uppercase; border-top:1px solid #EDEDED;">Solicitante</td>
                                                <td align="right" style="padding:12px 15px; font-size:15px; border-top:1px solid #EDEDED;">${solicitante?.name ?? '-'}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:12px 15px; font-size:12px; font-weight:bold; text-transform:uppercase; border-top:1px solid #EDEDED;">Status</td>
                                                <td align="right" style="padding:12px 15px; font-size:15px; border-top:1px solid #EDEDED;">${statusLabel}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:12px 15px; font-size:12px; font-weight:bold; text-transform:uppercase; border-top:1px solid #EDEDED;">Data e Hora</td>
                                                <td align="right" style="padding:12px 15px; font-size:15px; border-top:1px solid #EDEDED;">${dataAbertura}</td>
                                            </tr>
                                        </table>
                                        <table cellpadding="0" cellspacing="0" align="center">
                                            <tr>
                                                <td align="center" style="border-radius:8px; background-color:#2D3E2E;">
                                                    <a href="${process.env.FRONTEND_URL}/Gerenciar-chamados"
                                                        target="_blank"
                                                        style="display:inline-block; width:260px; padding:16px 0; border-radius:8px; background-color:#2D3E2E; color:#FFFFFF; text-decoration:none; font-weight:bold; text-transform:uppercase; font-size:14px; letter-spacing:1px; text-align:center; font-family:Arial,Helvetica,sans-serif;">
                                                        Ver Chamado
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding:20px; background-color:#2D3E2E; color:#FFF; font-size:10px; letter-spacing:1px;">
                                        SISTEMA DE CHAMADOS | GRCE
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                </body>
                </html>
                `,
            }),
            NotificationService.createNotification({
                user_id: user.id,
                title: `Novo chamado #${called.id} na fila`,
                message: `${solicitante?.name ?? 'Um usuário'} abriu um chamado em ${category?.name ?? 'sua categoria'}.`,
                type: 'new_called',
            }),
        ]));

        await Promise.all(technicianPromises);

        // E-mail + notificação para o financeiro se o chamado exigir aceite
        if (called.financial_approval_required) {
            const financialUsers = await User.findAll({
                where: { id_department: 7, ativo: 1 },
                attributes: ['id', 'name', 'email'],
            });

            const financialPromises = financialUsers.map(user => Promise.all([
                sendEmail({
                    to: user.email,
                    subject: `Aceite Financeiro Pendente — Chamado #${called.id}`,
                    html: `
                    <!DOCTYPE html>
                    <html lang="pt-br">
                    <head>
                        <meta charset="UTF-8">
                        <title>Aceite Financeiro Pendente</title>
                    </head>
                    <body style="margin:0; padding:0; background-color:#F4F4F4;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F4F4F4;">
                        <tr>
                            <td align="center">
                                <table width="600" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF; border:1px solid #E2E8F0;">
                                    <tr>
                                        <td align="center" style="padding:25px; border-bottom:4px solid #2D3E2E;">
                                            <div style="font-family:Arial,sans-serif; font-size:20px; font-weight:bold; color:#2D3E2E; letter-spacing:2px;">
                                                SISTEMA DE CHAMADOS
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding:40px; font-family:Arial, Helvetica, sans-serif; color:#000;">
                                            <div style="font-size:12px; letter-spacing:2px; font-weight:bold; color:#666; margin-bottom:12px; text-transform:uppercase;">
                                                Aprovação Pendente
                                            </div>
                                            <div style="font-size:26px; font-weight:bold; margin-bottom:20px; text-transform:uppercase;">
                                                Novo Chamado Aguarda Aceite Financeiro
                                            </div>
                                            <div style="font-size:15px; line-height:1.6; margin-bottom:30px;">
                                                Olá, <strong>${user.name}</strong>! Um novo chamado foi aberto e requer sua aprovação financeira antes de ser atendido.
                                            </div>
                                            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E5E5E5; background-color:#FAFAFA; margin-bottom:35px;">
                                                <tr>
                                                    <td style="padding:12px 15px; font-size:12px; font-weight:bold; text-transform:uppercase;">Número do Chamado</td>
                                                    <td align="right" style="padding:12px 15px; font-size:15px;">#${called.id}</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding:12px 15px; font-size:12px; font-weight:bold; text-transform:uppercase; border-top:1px solid #EDEDED;">Categoria</td>
                                                    <td align="right" style="padding:12px 15px; font-size:15px; border-top:1px solid #EDEDED;">${category?.name ?? '-'}</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding:12px 15px; font-size:12px; font-weight:bold; text-transform:uppercase; border-top:1px solid #EDEDED;">Solicitante</td>
                                                    <td align="right" style="padding:12px 15px; font-size:15px; border-top:1px solid #EDEDED;">${solicitante?.name ?? '-'}</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding:12px 15px; font-size:12px; font-weight:bold; text-transform:uppercase; border-top:1px solid #EDEDED;">Data e Hora</td>
                                                    <td align="right" style="padding:12px 15px; font-size:15px; border-top:1px solid #EDEDED;">${dataAbertura}</td>
                                                </tr>
                                            </table>
                                            <table cellpadding="0" cellspacing="0" align="center">
                                                <tr>
                                                    <td align="center" style="border-radius:8px; background-color:#2D3E2E;">
                                                        <a href="${process.env.FRONTEND_URL}/fila-aprovacao"
                                                            target="_blank"
                                                            style="display:inline-block; width:260px; padding:16px 0; border-radius:8px; background-color:#2D3E2E; color:#FFFFFF; text-decoration:none; font-weight:bold; text-transform:uppercase; font-size:14px; letter-spacing:1px; text-align:center; font-family:Arial,Helvetica,sans-serif;">
                                                            Analisar e Aprovar
                                                        </a>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center" style="padding:20px; background-color:#2D3E2E; color:#FFF; font-size:10px; letter-spacing:1px;">
                                            SISTEMA DE CHAMADOS | GRCE
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    </body>
                    </html>
                    `,
                }),
                NotificationService.createNotification({
                    user_id: user.id,
                    title: `Aceite financeiro pendente — Chamado #${called.id}`,
                    message: `${solicitante?.name ?? 'Um usuário'} abriu o chamado #${called.id} em ${category?.name ?? 'uma categoria'} que requer aprovação financeira.`,
                    type: 'new_called',
                }),
            ]));

            await Promise.all(financialPromises);
        }

    } catch (emailError) {
        console.error('❌ Erro ao enviar e-mail/notificação:', emailError.message);
    }

    return called;
};

export default { createCalledService };