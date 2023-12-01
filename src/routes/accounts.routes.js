var express = require("express");
const AccountControllerClass = require("../controllers/account.controller");

const router = express.Router();
const accountController = new AccountControllerClass();

router.get("/", accountController.list);

module.exports = router;
