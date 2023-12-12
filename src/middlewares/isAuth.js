const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const model = require("../models");
const Account = model.account;

const isAuth = (req, res, next) => {
  const { authorization: Authorization } = req.headers;

  // console.log(req.headers);
  // console.log({ Authorization });

  // Valido que haya un bearer token
  if (!Authorization) {
    return res
      .status(403)
      .json({ msg: "ERROR", tag: "Requiere autenticación", code: 403 });
  }

  const [_, token] = Authorization.split(" ");
  // console.log({ token });

  if (!token) {
    return res
      .status(403)
      .json({ msg: "ERROR", tag: "Bearer token no válido", code: 403 });
  }

  // Y que sea un usuario válido
  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({
        msg: "ERROR",
        tag: "Token no válido o ha expirado",
        code: 403,
      });
    }

    console.log({ decoded });

    const { external: external_id, email } = decoded;

    const account = await Account.findOne({
      where: { email, external_id },
    });

    if (!account) {
      return res.status(403).json({
        msg: "ERROR",
        tag: "Token no válido",
        code: 403,
      });
    }

    next();
  });
};

module.exports = isAuth;
