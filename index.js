const config = require("config");

const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();

const helmet = require("helmet");
app.use(helmet());

app.enable("trust proxy");

const compression = require("compression");
app.use(compression());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const morgan = require("morgan");
app.use(morgan("tiny"));

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const port = process.env.PORT || process.env.API_PORT;
app.listen(port, () => {
	console.log(`HTTP server running on port ${port}`);
});

const router = require("./router");
app.use(config.path, router);

app.get("/", (req, res) => {
	res.status(200).send("OK");
});

module.exports = app;
