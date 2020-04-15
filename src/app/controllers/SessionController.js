import jwt from "jsonwebtoken";
import * as Yup from "yup";

import User from "../models/User";
import File from "../models/File";

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: File,
          as: "avatar",
          attributes: ["id", "path", "url"],
        },
      ],
    });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: "Password not match" });
    }

    const { id, name, project, avatar } = user;

    return res.json({
      user: {
        id,
        name,
        email,
        avatar,
        project,
      },
      token: jwt.sign({ id }, "LarWeb", {
        expiresIn: "7d",
      }),
    });
  }
}

export default new SessionController();
