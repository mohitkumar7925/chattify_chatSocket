const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
let io = new Server();
io.listen(server);

io.sockets.on("connection", (socket) => {
      console.log("connected", socket.id);

      

      socket.on("message", (data) => {
            console.log("message event", data);
            socket.emit("received", data , ack=>{
                console.log('ack',ack);
            });
      });


      
});

server.listen(4001, () => {
      console.log("listing on 4001");
});
