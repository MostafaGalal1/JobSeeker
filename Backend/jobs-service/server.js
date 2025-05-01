const app = require("./src/app");
const { startWorker } = require("./worker");
const { getSecrets } = require("./src/services/vaultService");

getSecrets().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    startWorker();
  });
});
