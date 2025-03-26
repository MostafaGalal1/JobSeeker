require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 3000,
  DB_USER: process.env.DB_USER,
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_PORT: process.env.DB_PORT,
  MQ_HOST: process.env.MQ_HOST,
  MQ_USER: process.env.MQ_USER,
  MQ_PASSWORD: process.env.MQ_PASSWORD,
  SI_HOST: process.env.SI_HOST,
  SI_PORT: process.env.SI_PORT,
  SI_INDEX: process.env.SI_INDEX,
};