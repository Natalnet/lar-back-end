import * as Yup from "yup";
import User from "../models/User";
import File from "../models/File";

class UserController {
  async index(req, res) {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "project", "avatar_id"],
      include: [
        {
          model: File,
          as: "avatar",
          attributes: ["name", "path", "url"],
        },
      ],
    });

    res.json(users);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
      project: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }
    // Validação de email
    const userExists = await User.findOne({ where: { email: req.body.email } });
    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }
    const { id, name, email, project } = await User.create(req.body);
    return res.json({ id, name, email, project });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      project: Yup.string(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when("oldPassword", (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when("password", (password, field) =>
        password ? field.required().oneOf([Yup.ref("password")]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (email !== user.email) {
      console.log(email);
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ error: "User already exists" });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: "Password does not match" });
    }

    await user.update(req.body);

    const { id, name, project } = await User.findByPk(req.userId);

    return res.json({ id, name, email, project });
  }
}
export default new UserController();
