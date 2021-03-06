import { Router } from "express";
import multer from "multer";
import multerConfig from "./config/multer";

import UserController from "./app/controllers/UserController";
import SessionController from "./app/controllers/SessionController";
import InvetoryController from "./app/controllers/InvetoryController";
import FileControler from "./app/controllers/FileController";
import BorrowedController from "./app/controllers/BorrowedController";
import UserBorrowedController from "./app/controllers/UserBorrowedController";

import authMiddleware from "./app/middlewares/auth";

const routes = new Router();
const upload = multer(multerConfig);

routes.get("/", (req, res) => {
  res.send({ server: "on" });
});

routes.post("/users", UserController.store);
routes.post("/sessions", SessionController.store);
routes.post("/files", upload.single("file"), FileControler.store);

routes.use(authMiddleware);

routes.put("/users", UserController.update);
routes.get("/users", UserController.index);

routes.post("/invetory", InvetoryController.store);
routes.get("/invetory", InvetoryController.index);
routes.put("/invetory/:id", InvetoryController.update);

routes.post("/borrowed", BorrowedController.store);
routes.get("/borrowed", BorrowedController.index);
routes.put("/borrowed/:id", BorrowedController.update);

routes.get("/userBorrowed", UserBorrowedController.index);

export default routes;
