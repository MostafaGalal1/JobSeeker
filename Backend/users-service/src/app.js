const express = require("express");
const compression = require("compression");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(compression());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

const apiRouter = express.Router();

apiRouter.use("/users", userRoutes);

app.use("/api", apiRouter);

module.exports = app;