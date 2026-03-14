import { Model, DataTypes } from "sequelize";

export default class MessageCalled extends Model {
    static init(sequelize) {
        return super.init(
            {
                id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
                id_called: { type: DataTypes.INTEGER, allowNull: false },
                id_user: { type: DataTypes.INTEGER, allowNull: false },
                message: { type: DataTypes.TEXT, allowNull: false },
                internal: { type: DataTypes.BOOLEAN },
                shipping_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
            },
            {
                sequelize,
                tableName: "messages_called",
                underscored: true,
                timestamps: false,
            }
        );
    }

    static associate(models) {
        // MESSAGE -> CALLED
        this.belongsTo(models.Called, {
            foreignKey: "id_called",
            as: "called",
        });

        // MESSAGE -> USER
        this.belongsTo(models.User, {
            foreignKey: "id_user",
            as: "user",
        });
    }
}
