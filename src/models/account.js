const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Account = sequelize.define(
    "account",
    {
      // id: {
      //   type: DataTypes.UUID,
      //   defaultValue: DataTypes.UUIDV4,
      //   allowNull: false,
      //   primaryKey: true,
      // },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
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

  Account.associate = function (models) {
    Account.belongsTo(models.user, { foreignKey: "id_user" });
  };

  // Account.associate = (models) => {
  // Relacionando con usuarios 1:m
  // Account.hasOne(models.Favorite);
  // Account.hasMany(models.PaymentMethod, {
  //   sourceKey: "id",
  //   foreignKey: "accountId",
  // });
  // };

  return Account;
};
