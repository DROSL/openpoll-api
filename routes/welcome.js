const express = require("express");
const router = express.Router();

const setCookie = require("../middleware/setCookie");

router.get("/welcome", setCookie, (req, res) => {
	res.status(200).send("Welcome! 🙌");
});

module.exports = router;
