const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Comment = sequelize.define("comment", {
    // id: {
    //   type: DataTypes.UUID,
    //   defaultValue: DataTypes.UUIDV4,
    //   allowNull: false,
    //   primaryKey: true,
    // },
    body: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    external_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
    },
  });

  Comment.associate = function (models) {
    Comment.belongsTo(models.user, { foreignKey: "author" }); // Cambiado a "User" en lugar de "user"
    Comment.belongsTo(models.news, { foreignKey: "newsId" }); // Agregada relación con el modelo de Noticia
  };

  return Comment;
};
