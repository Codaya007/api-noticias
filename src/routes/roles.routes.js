var express = require("express");
const RoleControllerClass = require("../controllers/role.controller");

const router = express.Router();
const roleController = new RoleControllerClass();

const roles = [{ name: "Viviana", lastname: "Calva", birth: "24/01/2002" }];

/* GET roles listing. */
router.get("/", roleController.list);

router.post("/", roleController.create);

module.exports = router;
