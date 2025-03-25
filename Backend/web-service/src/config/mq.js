const amqp = require("amqplib");
const { MQ_HOST, MQ_USER, MQ_PASSWORD } = require("./env");

let channel, connection;
const QUEUE_NAME = "jobs_queue";

const connectRabbitMQ = async () => {
  try {
    connection = await amqp.connect(`amqp://${MQ_USER}:${MQ_PASSWORD}@${MQ_HOST}`);
    channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    console.log("Connected to RabbitMQ");
  } catch (error) {
    console.error("RabbitMQ Connection Error:", error);
  }
};

const publishToQueue = async (message) => {
  if (!channel) {
    console.error("RabbitMQ channel not initialized");
    return;
  }
  channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)), { persistent: true });
  console.log(`📩 Message sent to queue: ${JSON.stringify(message)}`);
};

module.exports = { connectRabbitMQ, publishToQueue };