var express = require("express");
const UserControllerClass = require("../controllers/user.controller");

const router = express.Router();
const userController = new UserControllerClass();

const users = [{ name: "Viviana", lastname: "Calva", birth: "24/01/2002" }];

/* GET users listing. */
router.get("/", userController.list);

router.get("/:external_id", userController.getById);

router.post("/", userController.create);

module.exports = router;
