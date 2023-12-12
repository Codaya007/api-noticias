const models = require("../models");
const News = models.news;
const User = models.user; // Asegúrate de que el modelo de usuario se importa correctamente
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const extensionsImagen = ["jpg", "jpeg", "png", "gif"]; // Definir las extensiones permitidas

class NewsController {
  async list(req, res) {
    const newsList = await News.findAll({
      include: [
        { model: User, as: "author", attributes: ["names", "lastnames"] },
      ],
      attributes: [
        "title",
        "body",
        "date",
        "photo",
        "type",
        ["external_id", "id"],
      ],
    });

    res.status(200);
    res.json({
      msg: "OK",
      code: 200,
      results: newsList,
    });
  }

  async getById(req, res) {
    const { external_id } = req.params;

    const newsItem = await News.findOne({
      where: { external_id },
      include: [
        { model: User, as: "author", attributes: ["names", "lastnames"] },
      ],
      attributes: [
        "title",
        "body",
        "date",
        "photo",
        "type",
        ["external_id", "id"],
      ],
    });

    if (!newsItem) {
      return res.status(404).json({
        msg: "ERROR",
        code: 404,
        tag: "La noticia especificada no existe",
      });
    }

    res.status(200);
    res.json({
      msg: "OK",
      code: 200,
      results: newsItem,
    });
  }

  async create(req, res) {
    const { title, body, date, photo, type } = req.body;
    let { author } = req.body;

    if (!title || !body || !date || !author) {
      return res.status(400).json({
        msg: "ERROR",
        code: 400,
        tag: "No se han enviado todos los datos necesarios",
      });
    }

    const user = await User.findOne({ where: { external_id: author } });

    if (!user) {
      return res.status(404).json({
        msg: "ERROR",
        code: 404,
        tag: "El usuario especificado no existe",
      });
    }

    const data = {
      title,
      body,
      date,
      photo,
      type,
      external_id: uuidv4(),
      author: user.id,
    };

    try {
      const newNews = await News.create(data);

      res.status(201);
      res.json({
        msg: "OK",
        code: 201,
        results: newNews,
      });
    } catch (error) {
      res.json({
        msg: "ERROR",
        code: 400,
        tag: error.message || "Algo salió mal",
      });
    }
  }

  async savePhoto(req, res) {
    try {
      var form = new formidable.IncomingForm();

      // Directorio en el directorio raíz donde se guardarán las imágenes
      const uploadDir = path.join(__dirname, "../../uploads");

      // Verificar si el directorio de carga existe, si no, crearlo
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }

      form.uploadDir = uploadDir;

      var files = [];

      form
        .on("file", function (field, file) {
          files.push(file);
        })
        .on("end", function () {
          for (let index = 0; index < files.length; index++) {
            var file = files[index];

            var name = uuidv4();
            var extension = file.originalFilename
              .replace(/\?.*$/, "")
              .split(".")
              .pop()
              .toLowerCase();

            if (!extensionsImagen.includes(extension)) {
              res.status(400);
              return res.json({
                msg: "BAD",
                tag: "Solo soporta " + extensionsImagen.join(", "),
                code: 400,
              });
            }

            var newName = path.join(uploadDir, name + "." + extension);

            fs.rename(file.filepath, newName, function (err) {
              if (err) {
                console.error(err);
                res.status(400);
                res.json({ msg: "BAD", tag: "NO se guardó!!", code: 400 });
              } else {
                res.status(200);
                res.json({
                  msg: "OK",
                  tag: "Se guardó el archivo con éxito",
                  url: "/uploads" + "/" + name + "." + extension,
                  code: 200,
                });
              }
            });
          }
        });

      form.parse(req);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "ERROR", tag: "Algo salió mal", code: 500 });
    }
  }
}

module.exports = NewsController;
