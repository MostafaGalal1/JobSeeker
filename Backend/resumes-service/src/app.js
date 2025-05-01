const express = require("express");
const compression = require("compression");
const bodyParser = require("body-parser");
const resumeRoutes = require("./routes/resumeRoutes");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(compression());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

const apiRouter = express.Router();

apiRouter.use("/resumes", resumeRoutes);

app.use("/api", apiRouter);

module.exports = app;