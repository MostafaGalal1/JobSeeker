const { getChannel } = require("./src/config/mq");

async function startWorker() {
  const channel = await getChannel();

  const inputQueue = "jobs_queue";
  const outputExchange = "jobs_exchange";

  console.log("Starting worker...");

  await channel.assertQueue(inputQueue, { durable: true });
  await channel.assertExchange(outputExchange, 'fanout', { durable: true });

  channel.consume(
    inputQueue,
    async (msg) => {
      if (msg !== null) {
        const job = JSON.parse(msg.content.toString());
        console.log("Received job:", job);

        const response = await fetch(`http://jobs-service:5000/api/jobs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(job),
        });

        if (!response.ok) {
          console.error("Error processing job:", response.statusText);
          channel.nack(msg, false, false);
          return;
        }

        console.log("Job processed successfully:");

        const result = { status: "done", job };
        channel.publish(
          outputExchange,
          "",
          Buffer.from(JSON.stringify(result)),
          { persistent: true }
        );

        console.log("Sent processed job:", result);
        channel.ack(msg);
      }
    },
    { noAck: false }
  );
}

module.exports = { startWorker };
