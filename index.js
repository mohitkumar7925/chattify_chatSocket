const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { default: axios } = require("axios");
// const rabbit = require("./rabbit_mq");
const rabbit = require("amqplib");
const app = express();

const server = http.createServer(app);
app.use(cors());
let io = new Server({ cors: "*" });
io.listen(server);

async function initializeRabbitMQ() {
      try {
            let connection = await rabbit.connect("amqp://guest:guest@rabbitmq", {});
            let channel = await connection.createChannel();
            global.rabbit_channel = channel;
            console.log("rabbit connected");
      } catch (error) {
            console.log("error in rabbit mq", error);
            setTimeout(() => {
                  initializeRabbitMQ();
            }, 1000);
      }
}

io.sockets.on("connection", (socket) => {
      console.log("connected", socket.id);

      socket.on("message", (data) => {
            console.log("message will be sent to ", data.toUser_id, "    ->", data);
            socket.broadcast.emit(data.toUser_id, data);
            socket.emit(data.fromUser_id, data);

            let channel = global.rabbit_channel;
            channel.sendToQueue("message", Buffer.from(JSON.stringify(data)));
            // rabbit.sendMessage({ test: "1234" });
            // rabbit.getClient()
            //       .then((client) => {
            //             // client.channel.sendToQueue("message", Buffer.from("test"));
            //             console.log("________>>>");
            //             client.channel.sendToQueue("message", Buffer.from("test"));
            //       })
            //       .catch((err) => {
            //             console.log("errrrrr", err);
            //       });

            // axios.post("http://backend_container:4000/user/message", data)
            //       .then((res) => {
            //             if (res.status) {
            //                   console.log("saved");
            //             } else {
            //                   console.log("Error in saved", res.message);
            //             }
            //       })
            //       .catch((er) => {
            //             console.log("error in saved CATCH", er);
            //       });
      });
});
initializeRabbitMQ();
server.listen(4001, () => {
      console.log("listing on 4001");
});
