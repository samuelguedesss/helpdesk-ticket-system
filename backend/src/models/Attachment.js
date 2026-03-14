import { Model, DataTypes } from "sequelize";

export default class CalledAttachments extends Model {
    static init(sequelize) {
        return super.init(
            {
                id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
                id_called: { type: DataTypes.INTEGER, allowNull: false },
                filename: { type: DataTypes.STRING(255) },
                path: { type: DataTypes.STRING(255) },
                data_upload: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
            },
            {
                sequelize,
                tableName: "called_attachments",
                underscored: true,
                timestamps: false,
            }
        );
    }

    static associate(models) {
        // ATTACHMENT -> CALLED
        this.belongsTo(models.Called, {
            foreignKey: "id_called",
            as: "called",
        });
    }
}
