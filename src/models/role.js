// const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    "role",
    {
      // id: {
      //   type: DataTypes.UUID,
      //   defaultValue: DataTypes.UUIDV4,
      //   allowNull: false,
      //   primaryKey: true,
      // },
      name: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
      },
      external_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
      },
    }
    // {
    //   timestamps: false,
    //   freezeTableName: true,
    // }
  );

  Role.associate = (models) => {
    Role.hasMany(models.user, { foreignKey: "id_role", as: "user" });
  };

  // Role.instanceMethods = {
  //   toJSON: function () {
  //     var values = this.get();

  //     if (this.id) {
  //       values.id = undefined;
  //     }

  //     return values;
  //   },
  // };

  // Role.associate = (models) => {
  // Relacionando con usuarios 1:m
  // Role.hasOne(models.Favorite);
  // Role.hasMany(models.PaymentMethod, {
  //   sourceKey: "id",
  //   foreignKey: "roleId",
  // });
  // };

  return Role;
};
