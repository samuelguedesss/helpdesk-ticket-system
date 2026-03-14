import { Model, DataTypes } from "sequelize";

export default class SubcategoryFormField extends Model {
    static init(sequelize) {
        return super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },

                id_subcategory: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },

                label: {
                    type: DataTypes.STRING(150),
                    allowNull: false,
                },

                type: {
                    type: DataTypes.ENUM("text", "number", "textarea"),
                    allowNull: false,
                    defaultValue: "text",
                },

                required: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: false,
                },

                order_index: {
                    type: DataTypes.INTEGER,
                    defaultValue: 0,
                },

                placeholder: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: "subcategory_form_fields",
                underscored: true,
                timestamps: true,
                createdAt: 'created_at',
                updatedAt: false, // ⬅️ IMPORTANTE: desabilita updated_at
            }
        );
    }

    static associate(models) {
        // SUBCATEGORY_FORM_FIELDS -> SUBCATEGORY
        this.belongsTo(models.Subcategory, {
            foreignKey: "id_subcategory",
            as: "subcategory",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });

        // SUBCATEGORY_FORM_FIELDS -> CALLED_FIELD_VALUES (quando existir)
        this.hasMany(models.CalledFieldValue, {
            foreignKey: "id_field",
            as: "values",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    }
}
