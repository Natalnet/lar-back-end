import { Router } from "express";

import UserController from "./app/controllers/UserController";
import SessionController from "./app/controllers/SessionController";
import InvetoryController from "./app/controllers/InvetoryController";

import authMiddleware from "./app/middlewares/auth";

const routes = new Router();

routes.get("/", (req, res) => {
  res.send({ server: "on" });
});

routes.post("/users", UserController.store);
routes.post("/sessions", SessionController.store);

routes.use(authMiddleware);

routes.put("/users", UserController.update);

routes.post("/invetory", InvetoryController.store);
routes.get("/invetory", InvetoryController.index);
routes.put("/invetory/:id", InvetoryController.update);

export default routes;
