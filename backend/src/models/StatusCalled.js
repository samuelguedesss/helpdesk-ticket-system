import { Model, DataTypes } from "sequelize";

export default class StatusCalled extends Model {
    static init(sequelize) {
        return super.init(
            {
                id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
                name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
            },
            {
                sequelize,
                tableName: "status_called",
                underscored: true,
                timestamps: false,
            }
        );
    }

    static associate(models) {
        // STATUS -> CALLED
        this.hasMany(models.Called, {
            foreignKey: "id_status",
            as: "calls",
            onDelete: "RESTRICT",
            onUpdate: "CASCADE",
        });
    }
}
