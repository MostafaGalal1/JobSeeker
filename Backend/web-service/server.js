const app = require("./src/app");
const { PORT } = require("./src/config/env");
const { connectRabbitMQ } = require("./src/config/mq");

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectRabbitMQ();
});