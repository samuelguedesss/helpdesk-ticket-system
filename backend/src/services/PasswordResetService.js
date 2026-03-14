import bcrypt from 'bcrypt';
import crypto from 'crypto';
import db from '../models/index.js';
import PasswordResetRepository from '../repositories/PasswordResetRepository.js';
import sendEmail from '../utils/sendEmail.js';

const { User } = db;

const requestPasswordReset = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error('Usuário não encontrado.');

  const token = crypto.randomBytes(32).toString('hex');
  await PasswordResetRepository.invalidateOldTokens(user.id);
  await PasswordResetRepository.createResetRequest(
    user.id, token, new Date(Date.now() + 60 * 60 * 1000)
  );

  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetLink = `${baseUrl}/reset-password?token=${token}`;

  await sendEmail({
    to: user.email,
    subject: 'Redefinição de Senha — Sistema de Chamados',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;">
        <h2 style="color:#333;">Olá, ${user.name}</h2>
        <p>Recebemos uma solicitação para redefinir sua senha do <strong>Sistema de Chamados</strong>.</p>
        <p>Clique no botão abaixo para cadastrar uma nova senha:</p>
        <a href="${resetLink}" style="display:inline-block;padding:10px 24px;background:#2F3A32;color:#fff;text-decoration:none;border-radius:6px;margin-top:10px;font-weight:bold;">
          Redefinir minha senha
        </a>
        <p style="margin-top:20px;font-size:12px;color:#888;">Este link é válido por <strong>1 hora</strong>. Caso não tenha solicitado, ignore este e-mail.</p>
      </div>
    `,
  });

  return { message: 'E-mail de redefinição enviado com sucesso.' };
};

const verifyToken = async (token) => {
  const record = await PasswordResetRepository.findByToken(token);
  if (!record) throw new Error('Token inválido ou expirado.');
  return record.user_id;
};

const resetPassword = async (token, newPassword) => {
  const record = await PasswordResetRepository.findByToken(token);
  if (!record) throw new Error('Token inválido ou expirado.');

  const strongPasswordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  if (!strongPasswordRegex.test(newPassword))
    throw new Error('A senha deve ter pelo menos 8 caracteres, uma letra maiúscula, um número e um caractere especial.');

  const user = await User.findByPk(record.user_id);
  if (!user) throw new Error('Usuário não encontrado.');

  const isSamePassword = await bcrypt.compare(newPassword, user.password);
  if (isSamePassword) throw new Error('A nova senha não pode ser igual à senha atual.');

  await User.update({ password: await bcrypt.hash(newPassword, 10) }, { where: { id: user.id } });
  await PasswordResetRepository.markTokenAsUsed(record.id);

  return { message: 'Senha redefinida com sucesso.' };
};

export default { requestPasswordReset, verifyToken, resetPassword };