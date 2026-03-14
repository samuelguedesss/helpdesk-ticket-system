import { Model, DataTypes } from "sequelize";

export default class Permission extends Model {
    static init(sequelize) {
        return super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                name: {
                    type: DataTypes.STRING(100),
                    allowNull: false,
                },
                description: {
                    type: DataTypes.STRING(255),
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: "permissions",
                underscored: true,
                timestamps: false,
            }
        );
    }

    static associate(models) {

        // PERMISSION <-> ROLE (N:N)
        this.belongsToMany(models.Role, {
            through: models.RolePermission,
            foreignKey: "id_permission",
            otherKey: "id_role",
            as: "roles",
        });
    }
}


