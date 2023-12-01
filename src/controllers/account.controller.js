const model = require("../models");
const Account = model.account;

class AccountController {
  async list(req, res) {
    const accounts = await Account.findAll({
      // attributes: ["name", ["external_id", "id"]],
    });

    res.status(200);
    res.json({
      msg: "OK",
      code: 200,
      results: accounts,
    });
  }
}

module.exports = AccountController;
