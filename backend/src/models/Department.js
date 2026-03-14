import { Model, DataTypes } from "sequelize";

export default class Department extends Model {
    static init(sequelize) {
        return super.init(
            {
                id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
                id_corporation: { type: DataTypes.INTEGER, allowNull: false },
                name: { type: DataTypes.STRING(255), allowNull: false },
            },
            {
                sequelize,
                tableName: "department",
                underscored: true,
                timestamps: true,
            }
        );
    }

    static associate(models) {
        // DEPARTMENT -> COST CENTER
        this.belongsTo(models.CostCenter, {
            foreignKey: "id_corporation",
            as: "costCenter",
            onDelete: "RESTRICT",
            onUpdate: "CASCADE",
        });

        // DEPARTMENT -> USER
        this.hasMany(models.User, {
            foreignKey: "id_department",
            as: "users",
            onDelete: "RESTRICT",
            onUpdate: "CASCADE",
        });
    }
}
