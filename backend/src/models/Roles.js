import { Model, DataTypes } from "sequelize";

export default class Role extends Model {
    static init(sequelize) {
        return super.init(
            {
                id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
                name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
            },
            {
                sequelize,
                tableName: "roles",
                underscored: true,
                timestamps: false,
            }
        );
    }

    static associate(models) {
        // ROLE -> USER
        this.hasMany(models.User, {
            foreignKey: "id_role",
            as: "users",
            onDelete: "RESTRICT",
            onUpdate: "CASCADE",
        });

        // ROLE <-> PERMISSION (N:N)
        this.belongsToMany(models.Permission, {
            through: models.RolePermission,
            foreignKey: "id_role",
            otherKey: "id_permission",
            as: "permissions",
        });

    }
}
