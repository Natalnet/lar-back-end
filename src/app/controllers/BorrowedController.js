import Borrowed from "../models/Borrowed";
import Invetory from "../models/Invetory";

class BorrowedController {
  async store(req, res) {
    const { item_id, amount } = req.body;

    if (amount <= 0) {
      return res
        .status(400)
        .json({ error: "Selecione uma quantidade maior que 0" });
    }

    const item = await Invetory.findByPk(item_id);

    const { amount_available, borrowed_amount } = item;

    if (amount > amount_available) {
      return res.status(400).json({
        error: `A quantidade não estar dísponivel para empréstimo. A quantidade dísponivel é ${amount_available} `,
      });
    }

    const borrowed = await Borrowed.create({
      amount,
      user_id: req.userId,
      item_id,
    });

    await item.update({
      amount_available: parseInt(amount_available) - parseInt(amount),
      borrowed_amount: parseInt(borrowed_amount) + parseInt(amount),
    });

    return res.json(borrowed);
  }
}

export default new BorrowedController();
