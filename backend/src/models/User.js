import { Model, DataTypes } from "sequelize";

export default class User extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING(150),
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        id_role: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        creation_date: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        id_corporation: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        id_department: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        foto_user: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        ativo: {
          type: DataTypes.TINYINT,
          allowNull: false,
          defaultValue: 1,
          comment: "0 para inativo, 1 para ativo",
        },
      },
      {
        sequelize,
        tableName: "user",
        underscored: true,
        timestamps: false,
      }
    );
  }

  static associate(models) {
    // USER -> ROLES
    this.belongsTo(models.Role, {
      foreignKey: "id_role",
      as: "role",
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    });

    // USER -> COST_CENTER
    this.belongsTo(models.CostCenter, {
      foreignKey: "id_corporation",
      as: "costCenter",
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    });

    // USER -> DEPARTMENT
    this.belongsTo(models.Department, {
      foreignKey: "id_department",
      as: "department",
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    });

    // USER -> CALLED (criado pelo usuário)
    this.hasMany(models.Called, {
      foreignKey: "id_user",
      as: "createdCalls",
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    });

    // USER -> CALLED (responsável)
    this.hasMany(models.Called, {
      foreignKey: "id_responsible",
      as: "responsibleCalls",
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    });

    // USER -> MESSAGES
    this.hasMany(models.MessageCalled, {
      foreignKey: "id_user",
      as: "messages",
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    });

    this.belongsToMany(models.Category, {
      through: models.UserCategory,
      foreignKey: "id_user",
      otherKey: "id_category",
      as: "categories",
    });
  }
}