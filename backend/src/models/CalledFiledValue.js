import { Model, DataTypes } from "sequelize";

export default class CalledFieldValue extends Model {
    static init(sequelize) {
        return super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },

                id_called: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },

                id_field: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },

                value: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },

                created_at: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: DataTypes.NOW,
                },
            },
            {
                sequelize,
                tableName: "called_field_values",
                underscored: true,
                timestamps: false,
            }
        );
    }

    static associate(models) {
        // FIELD VALUE -> CALLED
        this.belongsTo(models.Called, {
            foreignKey: "id_called",
            as: "called",
        });

        // FIELD VALUE -> FIELD
        this.belongsTo(models.SubcategoryFormField, {
            foreignKey: "id_field",
            as: "field",
        });
    }
}
