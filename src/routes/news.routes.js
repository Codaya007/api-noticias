var express = require("express");
const NewsControllerClass = require("../controllers/news.controller");

const router = express.Router();
const newsController = new NewsControllerClass();

router.get("/", newsController.list);

router.get("/:external_id", newsController.getById);

router.post("/", newsController.create);

router.post("/save-photo", newsController.savePhoto);

module.exports = router;
