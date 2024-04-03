import express from "express";
import { Server } from "socket.io";
import { processAiRequest } from "./code-generation";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

const server = require("http").createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("connected! " + socket.id);

  socket.on("disconnect", () => {
    console.log("disconnected! " + socket.id);
  });
});

io.listen(server);

app.get("/", async (_, res) => {
  res.send({ ok: true });
});

app.post("/ask", (req, res) => processAiRequest(req, res, io));

server.listen(process.env.PORT ?? 3000, () => {
  console.log("server is up and running");
});
