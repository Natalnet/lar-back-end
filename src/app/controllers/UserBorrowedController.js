import Borrowed from "../models/Borrowed";
import User from "../models/User";
import Invetory from "../models/Invetory";

class UserBorrowedController {
  async index(req, res) {
    const { user_id } = req.body;

    const { administrador } = await User.findByPk(req.userId);

    if (!administrador) {
      return res.status(400).json({
        error: "Você não é administrador",
      });
    }

    const userBorrowed = await Borrowed.findAll({
      where: { user_id, returned_at: null },
      attributes: ["id", "amount", "returned_at", "user_id", "item_id"],
      include: [
        {
          model: Invetory,
          as: "item",
          attributes: ["name"],
        },
      ],
    });

    const userName = await User.findAll({
      where: { id: user_id },
      attributes: ["name"],
    });

    return res.json({ userName, userBorrowed });
  }
}

export default new UserBorrowedController();
