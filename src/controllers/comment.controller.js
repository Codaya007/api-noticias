const models = require("../models");
const Comment = models.comment;
const User = models.user;
const News = models.news;
const { v4: uuidv4 } = require("uuid");

class CommentController {
  async list(req, res) {
    try {
      let { newsId, writeBy, page, limit, ...where } = req.query;

      // Convertir page y limit a enteros y establecer valores predeterminados
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10; // Valor predeterminado de 10 si no se especifica

      if (newsId) {
        const newDB = await News.findOne({ where: { external_id: newsId } });

        if (newDB) where.newsId = newDB.id;
      }

      if (writeBy) {
        const userDB = await User.findOne({ where: { external_id: writeBy } });

        if (userDB) where.writeBy = userDB.id;
      }

      // Calcular el desplazamiento
      const offset = (page - 1) * limit;

      console.log({ where, offset });

      const data = await Comment.findAndCountAll({
        where,
        include: [
          { model: User, attributes: ["names", "lastnames"] },
          // { model: News, as: "news", attributes: ["title"] },
        ],
        attributes: [
          "body",
          "status",
          "createdAt",
          ["external_id", "id"],
          "latitude",
          "longitude",
        ],
        offset,
        limit,
      });
      console.log({ data });
      const { count, rows: comments } = data;

      // Calcular el número total de páginas
      const totalPages = Math.ceil(count / limit);

      // Calcular los valores de nextPage y prevPage
      const nextPage = page < totalPages;
      const prevPage = page > 1;

      res.status(200).json({
        msg: "OK",
        code: 200,
        totalPages,
        nextPage,
        prevPage,
        results: comments,
      });
    } catch (error) {
      res.status(500).json({ msg: "Algo salió mal", details: error.message });
    }
  }

  async listMe(req, res) {
    try {
      let { newsId, page, limit, ...where } = req.query;

      where.writeBy = req.me;
      // Convertir page y limit a enteros y establecer valores predeterminados
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10; // Valor predeterminado de 10 si no se especifica

      if (newsId) {
        const newDB = await News.findOne({ where: { external_id: newsId } });

        if (newDB) where.newsId = newDB.id;
      }

      // Calcular el desplazamiento
      const offset = (page - 1) * limit;

      console.log({ where, offset });

      const data = await Comment.findAndCountAll({
        where,
        include: [
          { model: User, attributes: ["names", "lastnames"] },
          // { model: News, as: "news", attributes: ["title"] },
        ],
        attributes: [
          "body",
          "status",
          "createdAt",
          ["external_id", "id"],
          "latitude",
          "longitude",
        ],
        offset,
        limit,
      });
      // console.log({ data });
      const { count, rows: comments } = data;

      // Calcular el número total de páginas
      const totalPages = Math.ceil(count / limit);

      // Calcular los valores de nextPage y prevPage
      const nextPage = page < totalPages;
      const prevPage = page > 1;

      res.status(200).json({
        msg: "OK",
        code: 200,
        totalPages,
        nextPage,
        prevPage,
        results: comments,
      });
    } catch (error) {
      res.status(500).json({ msg: "Algo salió mal", details: error.message });
    }
  }

  async listCoordinates(req, res) {
    try {
      let { newsId, ...where } = req.query;

      if (newsId) {
        const newDB = await News.findOne({ where: { external_id: newsId } });

        if (newDB) where.newsId = newDB.id;
      }

      let results = await Comment.findAll({
        where,
        attributes: [["external_id", "id"], "latitude", "longitude"],
      });

      results = results.map((e) => {
        const result = e.dataValues;

        result.coordinates = [e.latitude, e.longitude];

        return result;
      });

      res.status(200).json({
        msg: "OK",
        code: 200,
        results,
      });
    } catch (error) {
      res.status(500).json({ msg: "Algo salió mal", details: error.message });
    }
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

  async updateById(req, res) {
    const { external_id } = req.params;
    const { body } = req.body;

    const comment = await Comment.update(
      {
        body,
      },
      { where: { external_id } }
    );

    if (!comment[0]) {
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
      let { newsId } = req.body;
      const writeBy = req.me;

      // console.log(req.me, newsId, body);

      if (!body || !newsId) {
        return res.status(400).json({
          msg: "ERROR",
          code: 400,
          tag: "No se han enviado todos los datos necesarios",
        });
      }

      // const user = await User.findOne({ where: { external_id: writeBy } });
      const news = await News.findOne({ where: { external_id: newsId } });

      if (!news) {
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
        writeBy,
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
