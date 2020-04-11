import Borrowed from "../models/Borrowed";
import Invetory from "../models/Invetory";

class BorrowedController {
  async index(req, res) {
    const borrowed = await Borrowed.findAll({
      where: { user_id: req.userId },
      attributes: ["id", "amount", "user_id", "item_id", "returned_at"],
      include: [
        {
          model: Invetory,
          as: "item",
          attributes: ["name"]
        }
      ]
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
      where: { item_id, user_id: req.userId }
    });

    console.log(itemExist.length);

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
        error: `A quantidade desejada não estar dísponivel para empréstimo. A quantidade dísponivel é ${amount_available} `
      });
    }

    const borrowed = await Borrowed.create({
      amount,
      user_id: req.userId,
      item_id
    });

    const item_update = await item.update({
      amount_available: parseInt(amount_available) - parseInt(amount),
      borrowed_amount: parseInt(borrowed_amount) + parseInt(amount)
    });

    return res.json({
      borrowed,
      item_update
    });
  }
}

export default new BorrowedController();
