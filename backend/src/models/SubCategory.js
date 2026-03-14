import { Model, DataTypes } from "sequelize";

export default class Subcategory extends Model {
    static init(sequelize) {
        return super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                id_category: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                name: {
                    type: DataTypes.STRING(100),
                    allowNull: false
                },
                description: {
                    type: DataTypes.STRING(255),
                    allowNull: true
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
                tableName: "subcategory",
                underscored: true,
                timestamps: false,
            }
        );
    }

    static associate(models) {
        // SUBCATEGORY -> CATEGORY
        this.belongsTo(models.Category, {
            foreignKey: "id_category",
            as: "category",
            onDelete: "RESTRICT",
            onUpdate: "CASCADE",
        });

        // SUBCATEGORY -> CALLED
        this.hasMany(models.Called, {
            foreignKey: "id_subcategory",
            as: "calls",
            onDelete: "RESTRICT",
            onUpdate: "CASCADE",
        });

         this.hasMany(models.SubcategoryFormField, {
            foreignKey: "id_subcategory",
            as: "formFields",
            onDelete: "CASCADE", // Se deletar subcategoria, deleta os campos também
            onUpdate: "CASCADE",
        });
    }
}