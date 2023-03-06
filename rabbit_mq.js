const rabbit = require("amqplib");

// let client = null;
// let channel = null;

// (async () => {
//       client = await rabbit.connect("amqp://localhost");
//       channel = await client.createChannel();
// })();

// const sendMessage = async (data) => {
//       try {
//             //   console.log("______client ", client);
//             //   console.log("______channel ", channel);
//             channel.sendToQueue("message", Buffer.from(JSON.stringify(data)));
//       } catch (error) {
//             console.log("err", error);
//       }
// };

// module.exports = { sendMessage };

module.exports = class Rabbit_MQ {
      static connection;
      static channel;
      constructor(props) {}

      static getClient() {
            return new Promise(async (resolve, reject) => {
                  try {
                        if (this.channel) {
                              console.log("____connection__exist");
                              return resolve(Rabbit_MQ);
                        }

                        this.connection = await rabbit.connect("amqp://guest:guest@localhost", {});
                        this.channel = await this.connection.createChannel();
                        return resolve(Rabbit_MQ);
                  } catch (error) {
                        console.log("error in rabbit mq", error);
                        return reject(error);
                  }
            });
      }
};
