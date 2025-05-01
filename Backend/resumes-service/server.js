const app = require("./src/app");
const { connectRabbitMQ } = require("./src/config/mq");
const { getSecrets } = require("./src/services/vaultService");

getSecrets().then(() => {
  console.log("getSecrets succeeded");
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    connectRabbitMQ();
  });
});
