const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define(
    "user",
    {
      // id: {
      //   type: DataTypes.UUID,
      //   defaultValue: DataTypes.UUIDV4,
      //   allowNull: false,
      //   primaryKey: true,
      // },
      names: {
        type: DataTypes.STRING(60),
        allowNull: false,
        defaultValue: "NONE",
      },
      lastnames: {
        type: DataTypes.STRING(60),
        allowNull: false,
        defaultValue: "NONE",
      },
      address: {
        type: DataTypes.STRING(150),
        defaultValue: "NONE",
      },
      phoneNumber: {
        type: DataTypes.STRING(20),
        defaultValue: "NONE",
      },
      birthDate: {
        type: DataTypes.DATEONLY(),
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

  // User.instanceMethods = {
  //   toJSON: function () {
  //     var values = this.get();

  //     if (this.id) {
  //       values.id = values.external_id;
  //       values.external_id = undefined;
  //     }

  //     return values;
  //   },
  // };

  // User.associate = (models) => {
  // Relacionando con usuarios 1:m
  // User.hasOne(models.Favorite);
  // User.hasMany(models.PaymentMethod, {
  //   sourceKey: "id",
  //   foreignKey: "userId",
  // });
  // };

  User.associate = (models) => {
    User.hasOne(models.account, { foreignkey: "id_user", as: "account" });

    User.belongsTo(models.role, { foreignKey: "id_role" });

    // User.belongsTo(models.role, { foreignKey: "id_role" });
  };

  return User;
};
