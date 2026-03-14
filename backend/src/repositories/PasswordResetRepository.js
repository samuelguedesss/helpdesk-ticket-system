import db from '../models/index.js';
import { Op } from 'sequelize';

const { PasswordReset } = db;

const createResetRequest = async (userId, tokenHash, expiration) => {
  return await PasswordReset.create({ user_id: userId, token_hash: tokenHash, expiration, used: 0 });
};

const findByToken = async (tokenHash) => {
  return await PasswordReset.findOne({
    where: { token_hash: tokenHash, used: 0, expiration: { [Op.gt]: new Date() } },
  });
};

const markTokenAsUsed = async (id) => {
  return await PasswordReset.update({ used: 1 }, { where: { id } });
};

const invalidateOldTokens = async (userId) => {
  return await PasswordReset.update({ used: 1 }, { where: { user_id: userId } });
};

export default { createResetRequest, findByToken, markTokenAsUsed, invalidateOldTokens };