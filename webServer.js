import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
const __dirname = path.resolve();

const app = express();
const httpServer = http.Server(app);
const io = new Server(httpServer);
let x, y, r, c;

app.use(express.static(__dirname));

io.on("connection", function (socket) {
  console.log("a client connected:" + socket.id);
  socket.on("directive", function (message) {
    x = message.x;
    y = message.y;
    //r = message.r;
    //c = message.c;
    //console.log(x, y, r, c);
    socket.broadcast.emit("screen", message);
  });
});

httpServer.listen(3000, function () {
  console.log("listening on *:3000");
});
