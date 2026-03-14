import { Model, DataTypes } from "sequelize";

export default class Priority extends Model {
    static init(sequelize) {
        return super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                name: {
                    type: DataTypes.STRING(100),
                    allowNull: false,
                    unique: true
                }
            },
            {
                sequelize,
                tableName: "priority",
                underscored: true,
                timestamps: true
            }
        );
    }

    static associate(models) {
        this.hasMany(models.Called, {
            foreignKey: "id_priority",
            as: "calleds"
        });
    }
}
