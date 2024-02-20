var express = require("express");
const CommentsControllerClass = require("../controllers/comment.controller");
const isAuth = require("../middlewares/isAuth");

const router = express.Router();
const commentsController = new CommentsControllerClass();

router.get("/", commentsController.list);
router.get("/me", isAuth, commentsController.listMe);
router.get("/coordinates", commentsController.listCoordinates);

router.get("/:external_id", commentsController.getById);
router.put("/:external_id", commentsController.updateById);

router.post("/", isAuth, commentsController.create);

module.exports = router;
