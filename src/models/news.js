const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const News = sequelize.define("news", {
    // id: {
    //   type: DataTypes.UUID,
    //   defaultValue: DataTypes.UUIDV4,
    //   allowNull: false,
    //   primaryKey: true,
    // },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    body: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    photo: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM("Deportes", "Ciencias", "Clima", "Tecnología"),
      allowNull: true,
    },
    external_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
    },
  });

  News.associate = function (models) {
    News.belongsTo(models.user, { foreignKey: "id_user" });
  };

  return News;
};
