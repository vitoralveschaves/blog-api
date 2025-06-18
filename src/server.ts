import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const server = express();
server.use(cors());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.static("public"));

server.get("/ping", (req, res) => {
  res.json({ pong: true });
});

server.listen(8080, () => {
  console.log("Server running on http://localhost:8080");
});
