import { Model, DataTypes } from "sequelize";

export default class CostCenter extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING(255), allowNull: false, unique: true },
      },
      {
        sequelize,
        tableName: "cost_center",
        underscored: true,
        timestamps: false,
      }
    );
  }

  static associate(models) {
    // COST CENTER -> DEPARTMENT
    this.hasMany(models.Department, {
      foreignKey: "id_corporation",
      as: "departments",
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    });

    // COST CENTER -> USER
    this.hasMany(models.User, {
      foreignKey: "id_corporation",
      as: "users",
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    });
  }
}
