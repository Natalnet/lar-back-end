import * as Yup from "yup";
import Invetory from "../models/Invetory";

class InvetoryController {
  async index(req, res) {
    const itens = await Invetory.findAll();

    res.json(itens);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      location: Yup.string(),
      amount: Yup.number(),
      amount_available: Yup.number(),
      borrowed_amount: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    const itemExits = await Invetory.findOne({
      where: { name: req.body.name },
    });

    if (itemExits) {
      return res.status(400).json({ error: "Item already exists" });
    }

    const item = await Invetory.findByPk(req.params.id);

    await item.update(req.body);

    const {
      id,
      name,
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