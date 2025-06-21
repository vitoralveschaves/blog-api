import { Router } from "express";
import * as mainController from "../controllers/main-controller";

export const mainRoutes = Router();

mainRoutes.get("/ping", (req, res) => {
  res.json({ pong: true });
});

mainRoutes.get("/posts", mainController.getAllPost);
mainRoutes.get("/posts/:slug", mainController.getPost);
