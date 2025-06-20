import { Router } from "express";
import * as adminController from "../controllers/admin-controller";
import { privateRoute } from "../middlewares/private-route";

export const adminRoutes = Router();

adminRoutes.post("/posts", privateRoute, adminController.addPost);
