import { Model, DataTypes } from "sequelize";

export default class Notification extends Model {
    static init(sequelize) {
        return super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                user_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                title: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                },
                message: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                type: {
                    type: DataTypes.ENUM('new_called', 'called_finished', 'approval_approved', 'approval_rejected', 'called_assigned'),
                    allowNull: false,
                },
                read: {
                    type: DataTypes.TINYINT(1),
                    allowNull: false,
                    defaultValue: 0,
                },
                created_at: {
                    type: DataTypes.DATE,
                    defaultValue: DataTypes.NOW,
                },
            },
            {
                sequelize,
                tableName: "notification",
                underscored: true,
                timestamps: false,
            }
        );
    }

    static associate(models) {
        this.belongsTo(models.User, {
            foreignKey: "user_id",
            as: "user",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    }
}