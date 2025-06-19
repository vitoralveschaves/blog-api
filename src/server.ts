import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { mainRoutes } from "./routes/main-route";
import { adminRoutes } from "./routes/admin-route";
import { authRoutes } from "./routes/auth-route";

const server = express();
server.use(cors());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.static("public"));

server.use("/api", mainRoutes);
server.use("/api/admin", adminRoutes);
server.use("/api/auth", authRoutes);

server.listen(8080, () => {
  console.log("Server running on http://localhost:8080");
});
