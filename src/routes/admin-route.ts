import { Router } from "express";
import * as adminController from "../controllers/admin-controller";
import { privateRoute } from "../middlewares/private-route";

export const adminRoutes = Router();

adminRoutes.post("/posts", privateRoute, adminController.addPost);
adminRoutes.put("/posts/:slug", privateRoute, adminController.editPost);
adminRoutes.delete("/posts/:slug", privateRoute, adminController.removePost);
