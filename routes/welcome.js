const express = require("express");
const router = express.Router();

const Event = require("../models/event");

router.get("/welcome", (req, res) => {
	res.status(200).send("Welcome! 🙌");
});

module.exports = router;
