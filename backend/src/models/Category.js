import { Model, DataTypes } from "sequelize";

export default class Category extends Model {
    static init(sequelize) {
        return super.init(
            {
                id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
                name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
                description: { type: DataTypes.STRING(255), allowNull: true },
            },
            {
                sequelize,
                tableName: "categories",
                underscored: true,
                timestamps: false,
            }
        );
    }

    static associate(models) {
        // CATEGORY -> SUBCATEGORY
        this.hasMany(models.Subcategory, {
            foreignKey: "id_category",
            as: "subcategories",
            onDelete: "RESTRICT",
            onUpdate: "CASCADE",
        });

        // CATEGORY -> CALLED
        this.hasMany(models.Called, {
            foreignKey: "id_category",
            as: "calls",
            onDelete: "RESTRICT",
            onUpdate: "CASCADE",
        });

        this.hasMany(models.UserCategory, {
            foreignKey: "id_category",
            as: "userCategories",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    }
}
