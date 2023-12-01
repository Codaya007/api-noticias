const model = require("../models");
const Role = model.role;
const { v4: uuidv4 } = require("uuid");

class RoleController {
  async list(req, res) {
    const roles = await Role.findAll({
      attributes: ["name", ["external_id", "id"]],
    });

    res.status(200);
    res.json({
      msg: "OK",
      code: 200,
      results: roles,
    });
  }

  async create(req, res) {
    const { name } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ msg: "ERROR", code: 400, tag: "El campo 'name' es requerido" });
    }

    const data = {
      name,
      external_id: uuidv4(),
    };

    const newRole = await Role.create(data);

    if (!newRole) {
      res.status(400);
      return res.json({
        msg: "ERROR",
        code: 401,
        tag: "No se ha podido crear el rol",
      });
    }

    res.status(201);
    res.json({
      msg: "OK",
      code: 200,
      results: newRole,
    });
  }
}

module.exports = RoleController;
