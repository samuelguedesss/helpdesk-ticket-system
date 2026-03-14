import { Model, DataTypes } from "sequelize";

export default class RolePermission extends Model {
  static init(sequelize) {
    return super.init(
      {
        id_role: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
        },
        id_permission: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "role_permissions",
        underscored: true,
        timestamps: false,
      }
    );
  }

  static associate(models) {
    // ROLE <-> PERMISSION (N:N)
    this.belongsTo(models.Role, {
      foreignKey: "id_role",
      as: "role",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    this.belongsTo(models.Permission, {
      foreignKey: "id_permission",
      as: "permission",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}
