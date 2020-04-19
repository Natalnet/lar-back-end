import * as Yup from "yup";
import Invetory from "../models/Invetory";
import User from "../models/User";

class InvetoryController {
  async index(req, res) {
    const { name, location } = req.query;

    if (name) {
      const itens = await Invetory.findAll({
        where: { name },
      });

      res.json(itens);
    } else if (name && location) {
      const itens = await Invetory.findAll({
        where: { name, location },
      });

      res.json(itens);
    } else if (location) {
      const itens = await Invetory.findAll({
        where: { location },
      });
      res.json(itens);
    } else {
      const itens = await Invetory.findAll();

      res.json(itens);
    }
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      location: Yup.string(),
      amount: Yup.number().required(),
      amount_available: Yup.number().required(),
      borrowed_amount: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    const { administrador } = await User.findByPk(req.userId);

    if (!administrador) {
      return res.status(400).json({
        error: "Apenas adminitradores podem adicionar itens ao inventário",
      });
    }

    const { name } = req.body;

    const item = await Invetory.findByPk(req.params.id);

    if (name !== item.name) {
      const itemExits = await Invetory.findOne({
        where: { name },
      });
      if (itemExits) {
        return res.status(400).json({ error: "Item already exists" });
      }
    }

    if (
      req.body.borrowed_amount + req.body.amount_available !==
      req.body.amount
    ) {
      return res.status(400).json({ error: "Validation fails" });
    }

    await item.update(req.body);

    const {
      id,
      location,
      amount,
      amount_available,
      borrowed_amount,
    } = await Invetory.findByPk(req.params.id);

    res.json({ id, name, location, amount, amount_available, borrowed_amount });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      location: Yup.string().required(),
      amount: Yup.number().required(),
      amount_available: Yup.number().required(),
      borrowed_amount: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    const { administrador } = await User.findByPk(req.userId);

    if (!administrador) {
      return res.status(400).json({
        error: "Apenas adminitradores podem adicionar itens ao inventário",
      });
    }

    const itemExits = await Invetory.findOne({
      where: { name: req.body.name },
    });

    if (itemExits) {
      return res.status(400).json({ error: "Item already exists" });
    }

    const {
      id,
      name,
      location,
      amount,
      amount_available,
      borrowed_amount,
    } = await Invetory.create(req.body);

    return res.json({
      id,
      name,
      location,
      amount,
      amount_available,
      borrowed_amount,
    });
  }
}

export default new InvetoryController();
