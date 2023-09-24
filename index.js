const express = require("express");
const cors = require("cors");
require('dotenv').config()
const http = require("http");
const { Server } = require("socket.io");
const { default: axios } = require("axios");
const app = express();
const server = http.createServer(app);
app.use(cors());
let io = new Server({ cors: "*" });
io.listen(server);

io.sockets.on("connection", (socket) => {
      console.log("connected", socket.id);

      socket.on("message", (data) => {
            console.log("message will be sent to ", data.toUser_id, "    ->", data);
            socket.broadcast.emit(data.toUser_id, data);
            socket.emit(data.fromUser_id, data);

            // axios.post("http://10.1.4.1:4000/user/message",data)
            // axios.post("http://192.168.42.247:4000/user/message",data)
            // axios.post("http://backend_container:4000/user/message", data)
            axios.post(`http://${process.env.BACKEND_HOST}:4000/user/message`, data)
                  .then((res) => {
                        if (res.status) {
                              console.log("saved");
                        } else {
                              console.log("Error in saved", res.message);
                        }
                  })
                  .catch((er) => {
                        console.log("error in saved CATCH", er);
                  });
      });
});

server.listen(4001, () => {
      console.log("listing on 4001");
});
