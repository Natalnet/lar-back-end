import Borrowed from "../models/Borrowed";
import Invetory from "../models/Invetory";

class BorrowedController {
  async update(req, res) {
    const borrowed = await Borrowed.findByPk(req.params.id);

    const { item_id, amount } = borrowed.dataValues;

    const invetory = await Invetory.findByPk(item_id);

    const { amount_available, borrowed_amount } = invetory;

    if (req.userId !== borrowed.user_id) {
      return res
        .status(400)
        .json({ error: "Você não tem permissão para fazer essa devolução" });
    }

    if (borrowed.returned_at !== null) {
      return res
        .status(400)
        .json({ error: "A devolução desse empréstimo já foi efetuada" });
    }

    const atualDate = new Date();

    await borrowed.update({
      returned_at: atualDate,
    });

    await invetory.update({
      amount_available: parseInt(amount_available) + parseInt(amount),
      borrowed_amount: parseInt(borrowed_amount) - parseInt(amount),
    });

    return res.json(borrowed);
  }

  async index(req, res) {
    const borrowed = await Borrowed.findAll({
      where: { user_id: req.userId, returned_at: null },
      attributes: ["id", "amount", "user_id", "item_id", "returned_at"],
      include: [
        {
          model: Invetory,
          as: "item",
          attributes: ["name"],
        },
      ],
    });

    return res.json(borrowed);
  }

  async store(req, res) {
    const { item_id, amount } = req.body;

    if (amount <= 0) {
      return res
        .status(400)
        .json({ error: "Selecione uma quantidade maior que 0" });
    }

    const itemExist = await Borrowed.findAll({
      where: { item_id, user_id: req.userId },
    });

    if (itemExist.length !== 0) {
      return res
        .status(400)
        .json({ error: "Você já possui um empréstimo com esse item" });
    }

    const item = await Invetory.findByPk(item_id);

    if (!item) {
      return res.status(400).json({ error: "O item não existe" });
    }

    const { amount_available, borrowed_amount } = item;

    if (amount > amount_available) {
      return res.status(400).json({
        error: `A quantidade desejada não estar dísponivel para empréstimo. A quantidade dísponivel é ${amount_available} `,
      });
    }

    await Borrowed.create({
      amount,
      user_id: req.userId,
      item_id,
    });

    await item.update({
      amount_available: parseInt(amount_available) - parseInt(amount),
      borrowed_amount: parseInt(borrowed_amount) + parseInt(amount),
    });

    const borrowed = await Borrowed.findAll({
      where: { item_id, user_id: req.userId },
      attributes: ["id", "amount", "user_id", "item_id"],
    });

    const item_update = await Invetory.findAll({
      where: { id: item_id },
      attributes: [
        "id",
        "name",
        "location",
        "amount",
        "amount_available",
        "borrowed_amount",
      ],
    });

    return res.json({
      borrowed,
      item_update,
    });
  }
}

export default new BorrowedController();
