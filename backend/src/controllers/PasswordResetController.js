import PasswordResetService from '../services/PasswordResetService.js';

const requestReset = async (req, res) => {
  const { email } = req.body;
  try {
    const result = await PasswordResetService.requestPasswordReset(email);
    res.status(200).json(result);
  } catch (error) {
    const status = error.message.includes('não encontrado') ? 404 : 500;
    res.status(status).json({ message: error.message });
  }
};

const verifyToken = async (req, res) => {
  const { token } = req.params;
  try {
    const userId = await PasswordResetService.verifyToken(token);
    res.status(200).json({ valid: true, userId });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const result = await PasswordResetService.resetPassword(token, newPassword);
    res.status(200).json(result);
  } catch (error) {
    const status = error.message.includes('inválido') ? 400 : 500;
    res.status(status).json({ message: error.message });
  }
};

export default { requestReset, verifyToken, resetPassword };