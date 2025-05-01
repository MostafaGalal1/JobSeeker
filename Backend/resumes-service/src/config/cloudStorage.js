const cloudStorage = () => {
  const { Storage } = require("@google-cloud/storage");
  new Storage({
    keyFilename: process.env.GOOGLE_STORAGE_CREDENTIALS,
  });
};

module.exports = { cloudStorage };
