var express = require("express");
const CommentsControllerClass = require("../controllers/comment.controller");

const router = express.Router();
const commentsController = new CommentsControllerClass();

router.get("/", commentsController.list);

router.get("/:external_id", commentsController.getById);

router.post("/", commentsController.create);

module.exports = router;
