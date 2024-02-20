const model = require("../models");
const Account = model.account;
const User = model.user;
const Role = model.role;
const { JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");

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

  async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        msg: "ERROR",
        tag: "Los campos email y password son requeridos",
        code: 400,
      });
    }

    const account = await Account.findOne({
      where: { email },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["names", "lastnames", "address"],
          include: [
            {
              model: Role,
              as: "role",
              attributes: ["name"],
            },
          ],
        },
      ],
    });

    console.log({ account });

    if (!account) {
      return res.status(400).json({
        msg: "ERROR",
        tag: "Credenciales no válidas",
        code: 400,
      });
    }

    // status = false
    if (!account.status) {
      return res.status(400).json({
        msg: "ERROR",
        tag: "Cuenta desactivada",
        code: 400,
      });
    }

    if (account.password !== password) {
      return res.status(400).json({
        msg: "ERROR",
        tag: "Credenciales no válidas",
        code: 400,
      });
    }

    // Pasó todas las validaciones, es el usuario validado
    const payload = {
      issuer: "Backend example01",
      email,
      external: account.external_id,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });

    return res.status(200).json({
      msg: "Acceso exitoso",
      code: 200,
      results: {
        token,
        user: account.user,
      },
    });
  }
}

module.exports = AccountController;
