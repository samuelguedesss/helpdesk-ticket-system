import { Model, DataTypes } from "sequelize";

export default class UserCategory extends Model {
  static init(sequelize) {
    return super.init(
      {
        id_user: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
        },
        id_category: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "user_categories",
        underscored: true,
        timestamps: false,
      }
    );
  }

  static associate(models) {
    // USER <-> CATEGORY (N:N)
    this.belongsTo(models.User, {
      foreignKey: "id_user",
      as: "user",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    this.belongsTo(models.Category, {
      foreignKey: "id_category",
      as: "category",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}
