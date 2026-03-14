import { Model, DataTypes } from "sequelize";

export default class Called extends Model {
    static init(sequelize) {
        return super.init(
            {
                id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
                id_user: { type: DataTypes.INTEGER, allowNull: false },
                id_responsible: { type: DataTypes.INTEGER, allowNull: true },
                id_category: { type: DataTypes.INTEGER, allowNull: false },
                id_priority: { type: DataTypes.INTEGER, allowNull: true },
                id_status: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
                opening_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
                closing_date: { type: DataTypes.DATE },
                id_subcategory: { type: DataTypes.INTEGER, allowNull: true },
                finalizacao_descricao: { type: DataTypes.TEXT, allowNull: true },
                events: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
                reopen_reason: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: null,
                },
                financial_approval_required: { type: DataTypes.TINYINT(1), allowNull: false, defaultValue: 0 },
                financial_approval_status: {
                    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
                    allowNull: true,
                    defaultValue: null,
                },
                financial_approval_reason: { type: DataTypes.TEXT, allowNull: true, defaultValue: null },
                financial_approval_date: { type: DataTypes.DATE, allowNull: true, defaultValue: null },
                financial_approval_user_id: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null },
            },
            {
                sequelize,
                tableName: "called",
                underscored: true,
                timestamps: true,
                createdAt: "opening_date",
                updatedAt: "closing_date",
            }
        );
    }

    static associate(models) {
        this.belongsTo(models.User, { foreignKey: "id_user", as: "user" });
        this.belongsTo(models.User, { foreignKey: "id_responsible", as: "responsible" });
        this.belongsTo(models.Category, { foreignKey: "id_category", as: "category" });
        this.belongsTo(models.StatusCalled, { foreignKey: "id_status", as: "status" });
        this.belongsTo(models.Subcategory, { foreignKey: "id_subcategory", as: "subcategory" });
        this.hasMany(models.MessageCalled, { foreignKey: "id_called", as: "messages" });
        this.hasMany(models.CalledAttachments, { foreignKey: "id_called", as: "attachments" });
        this.belongsTo(models.Priority, { foreignKey: 'id_priority', as: 'priority' });
        this.hasMany(models.CalledFieldValue, { foreignKey: 'id_called', as: 'fieldValues' });
        this.belongsTo(models.User, { foreignKey: 'financial_approval_user_id', as: 'financialApprovalUser' });
    }
}