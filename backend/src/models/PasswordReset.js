import { Model, DataTypes } from "sequelize";

export default class PasswordReset extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        user_id: { type: DataTypes.INTEGER, allowNull: false },
        token_hash: { type: DataTypes.STRING(255), allowNull: false },
        expiration: { type: DataTypes.DATE, allowNull: false },
        used: { type: DataTypes.TINYINT(1), allowNull: false, defaultValue: 0 },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      },
      { sequelize, tableName: "password_reset", underscored: true, timestamps: false }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "user_id", as: "user", onDelete: "CASCADE", onUpdate: "CASCADE" });
  }
}