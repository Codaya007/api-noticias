const models = require("../models");
const Comment = models.comment;
const User = models.user;
const News = models.news;
const { v4: uuidv4 } = require("uuid");

class CommentController {
  async list(req, res) {
    const comments = await Comment.findAll({
      include: [
        { model: User, as: "author", attributes: ["names", "lastnames"] },
        { model: News, as: "news", attributes: ["title"] },
      ],
      attributes: ["body", "status", "date", ["external_id", "id"]],
    });

    res.status(200);
    res.json({
      msg: "OK",
      code: 200,
      results: comments,
    });
  }

  async getById(req, res) {
    const { external_id } = req.params;

    const comment = await Comment.findOne({
      where: { external_id },
      include: [
        { model: User, as: "author", attributes: ["names", "lastnames"] },
        { model: News, as: "news", attributes: ["title"] },
      ],
      attributes: ["body", "status", "date", ["external_id", "id"]],
    });

    if (!comment) {
      return res.status(404).json({
        msg: "ERROR",
        code: 404,
        tag: "El comentario especificado no existe",
      });
    }

    res.status(200);
    res.json({
      msg: "OK",
      code: 200,
      results: comment,
    });
  }

  async create(req, res) {
    try {
      const { body, status, latitude, longitude } = req.body;
      let { writeBy, newsId } = req.body;

      if (!body || !writeBy || !newsId) {
        return res.status(400).json({
          msg: "ERROR",
          code: 400,
          tag: "No se han enviado todos los datos necesarios",
        });
      }

      const user = await User.findOne({ where: { external_id: writeBy } });
      const news = await News.findOne({ where: { external_id: newsId } });

      if (!user || !news) {
        return res.status(404).json({
          msg: "ERROR",
          code: 404,
          tag: "El usuario o la noticia especificados no existen",
        });
      }

      const data = {
        body,
        status: status || true,
        // date,
        external_id: uuidv4(),
        writeBy: user.id,
        newsId: news.id,
        latitude,
        longitude,
      };

      const newComment = await Comment.create(data);

      res.status(201);
      res.json({
        msg: "OK",
        code: 201,
        results: newComment,
      });
    } catch (error) {
      res.json({
        msg: "ERROR",
        code: 400,
        tag: error.message || "Algo salió mal",
      });
    }
  }
}

module.exports = CommentController;
