const amqp = require("amqplib");

const getChannel = async () => {
  try {
    const connection = await amqp.connect(`amqp://${process.env.MQ_USER}:${process.env.MQ_PASSWORD}@${process.env.MQ_HOST}`);
    const channel = await connection.createChannel();
    return channel;
  } catch (error) {
    console.error("RabbitMQ Connection Error:", error);
  }
};

module.exports = { getChannel };
