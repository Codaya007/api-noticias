const models = require("../models");
const User = models.user;
const Role = models.role;
const Account = models.account;
const { v4: uuidv4 } = require("uuid");

class UserController {
  async list(req, res) {
    const users = await User.findAll({
      include: [{ model: Account, as: "cuenta", attributes: ["email"] }],
      include: [{ model: Role, as: "role", attributes: ["name"] }],
      attributes: [
        "lastnames",
        ["external_id", "id"],
        "names",
        "address",
        "phoneNumber",
        "birthDate",
      ],
    });

    res.status(200);
    res.json({
      msg: "OK",
      code: 200,
      results: users,
    });
  }

  async getById(req, res) {
    const { external_id } = req.params;

    const user = await User.findOne({
      where: { external_id },
      include: [{ model: Account, as: "cuenta", attributes: ["email"] }],
      include: [{ model: Role, as: "role", attributes: ["name"] }],
      attributes: [
        "lastnames",
        ["external_id", "id"],
        "names",
        "address",
        "phoneNumber",
        "birthDate",
      ],
    });

    if (!user) {
      return res.status(404).json({
        msg: "ERROR",
        code: 404,
        tag: "El usuario especificado no existe",
      });
    }

    res.status(200);
    res.json({
      msg: "OK",
      code: 200,
      results: user,
    });
  }

  async getMe(req, res) {
    // const { external_id } = req.params;
    const id = req.me;

    const user = await User.findOne({
      where: { id },
      include: [{ model: Account, as: "cuenta", attributes: ["email"] }],
      include: [{ model: Role, as: "role", attributes: ["name"] }],
      attributes: [
        "lastnames",
        ["external_id", "id"],
        "names",
        "address",
        "phoneNumber",
        "birthDate",
      ],
    });

    if (!user) {
      return res.status(404).json({
        msg: "ERROR",
        code: 404,
        tag: "El usuario especificado no existe",
      });
    }

    res.status(200);
    res.json({
      msg: "OK",
      code: 200,
      results: user,
    });
  }

  async create(req, res) {
    const {
      names,
      lastnames,
      address,
      phoneNumber,
      birthDate,
      email,
      password,
    } = req.body;
    let { id_role } = req.body;

    if (
      !names ||
      !lastnames ||
      !address ||
      !phoneNumber ||
      !email ||
      !password ||
      !birthDate ||
      !id_role
    ) {
      return res.status(400).json({
        msg: "ERROR",
        code: 400,
        tag: "No se han enviado todos los datos",
      });
    }
    const role = await Role.findOne({ external_id: id_role });

    if (!role) {
      return res.status(404).json({
        msg: "ERROR",
        code: 404,
        tag: "El rol especificado no existe",
      });
    }
    id_role = role.id;

    const data = {
      names,
      lastnames,
      address,
      phoneNumber,
      birthDate,
      id_role,
      external_id: uuidv4(),
      account: {
        email,
        password,
      },
    };

    const transaction = await models.sequelize.transaction();
    try {
      const newUser = await User.create(data, {
        include: { model: Account, as: "account", transaction },
      });

      await transaction.commit();

      role.external_id = uuidv4();
      await role.save();

      res.status(201);
      res.json({
        msg: "OK",
        code: 201,
        results: newUser,
      });
    } catch (error) {
      if (transaction) await transaction.rollback();

      res.json({
        msg: "ERROR",
        code: 400,
        tag: error.message || "Algo salió mal",
      });
    }
  }

  async updateById(req, res) {
    const {
      names,
      lastnames,
      address,
      phoneNumber,
      birthDate,
      email,
      password,
    } = req.body;
    let { id_role } = req.body;

    if (
      !names ||
      !lastnames ||
      !address ||
      !phoneNumber ||
      !email ||
      !password ||
      !birthDate ||
      !id_role
    ) {
      return res.status(400).json({
        msg: "ERROR",
        code: 400,
        tag: "No se han enviado todos los datos",
      });
    }
    const role = await Role.findOne({ external_id: id_role });

    if (!role) {
      return res.status(404).json({
        msg: "ERROR",
        code: 404,
        tag: "El rol especificado no existe",
      });
    }
    id_role = role.id;

    const data = {
      names,
      lastnames,
      address,
      phoneNumber,
      birthDate,
      id_role,
      external_id: uuidv4(),
      account: {
        email,
        password,
      },
    };

    const transaction = await models.sequelize.transaction();
    try {
      const newUser = await User.create(data, {
        include: { model: Account, as: "account", transaction },
      });

      await transaction.commit();

      role.external_id = uuidv4();
      await role.save();

      res.status(201);
      res.json({
        msg: "OK",
        code: 201,
        results: newUser,
      });
    } catch (error) {
      if (transaction) await transaction.rollback();

      res.json({
        msg: "ERROR",
        code: 400,
        tag: error.message || "Algo salió mal",
      });
    }
  }

  async createNormalUser(req, res) {
    const {
      names,
      lastnames,
      address,
      phoneNumber,
      birthDate,
      email,
      password,
    } = req.body;
    // let { id_role } = req.body;

    if (
      !names ||
      !lastnames ||
      // !address ||
      // !phoneNumber ||
      !email ||
      !password
      // !birthDate
      // !id_role
    ) {
      return res.status(400).json({
        msg: "ERROR",
        code: 400,
        tag: "No se han enviado todos los datos",
      });
    }
    const role = await Role.findOne({ name: "Usuario" });

    if (!role) {
      return res.status(404).json({
        msg: "ERROR",
        code: 404,
        tag: "El rol especificado no existe",
      });
    }

    const id_role = role.id;

    const data = {
      names,
      lastnames,
      address,
      phoneNumber,
      birthDate,
      id_role,
      external_id: uuidv4(),
      account: {
        email,
        password,
      },
    };

    const transaction = await models.sequelize.transaction();
    try {
      const newUser = await User.create(data, {
        include: { model: Account, as: "account" },
        transaction,
      });

      // role.external_id = uuidv4();
      // await role.save();

      delete newUser.account?.dataValues?.password;

      await Account.update(
        { id_user: newUser.id },
        { where: { id: newUser.account?.dataValues?.id }, transaction }
      );

      // console.log(newUser);
      await transaction.commit();

      res.status(201);
      res.json({
        msg: "OK",
        code: 201,
        results: newUser,
      });
    } catch (error) {
      if (transaction) await transaction.rollback();

      res.json({
        msg: "ERROR",
        code: 400,
        tag: error.message || "Algo salió mal",
      });
    }
  }
}

module.exports = UserController;
