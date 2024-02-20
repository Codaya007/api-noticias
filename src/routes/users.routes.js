var express = require("express");
const UserControllerClass = require("../controllers/user.controller");
const isAuth = require("../middlewares/isAuth");

const router = express.Router();
const userController = new UserControllerClass();

// const users = [{ name: "Viviana", lastname: "Calva", birth: "24/01/2002" }];

/* GET users listing. */
router.get("/", isAuth, userController.list);

router.get("/me", isAuth, userController.getMe);

router.get("/:external_id", userController.getById);

router.put("/:external_id", isAuth, userController.updateById);

router.post("/", userController.create);

router.post("/auth/register", userController.createNormalUser);

module.exports = router;
