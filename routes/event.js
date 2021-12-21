const express = require("express");
const router = express.Router();

const Event = require("../models/event");

const CODE_LENGTH = 6;
const CODE_CHARS = "abcdefghijklmnopqrstuvwxyz";
const SECRET_LENGTH = 24;
const SECRET_CHARS =
	"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const generateRandomString = (length, chars) => {
	let result = "";
	for (let i = 0; i < length; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
};

// create a new event
router.post("/event", async (req, res) => {
	try {
		const event = new Event({
			code: generateRandomString(CODE_LENGTH, CODE_CHARS),
			secret: generateRandomString(CODE_LENGTH, CODE_CHARS),
		});
		await event.save();

		return res.status(200).json(event);
	} catch (err) {
		return res.status(500).send("Something went wrong...");
	}
});

router.post("/join", (req, res) => {});

router.get("/event/:codeOrSecret", async (req, res) => {
	const { codeOrSecret } = req.params;

	if (codeOrSecret.length == SECRET_LENGTH) {
		const event = await Event.findOne({
			secret: codeOrSecret,
		});
		if (!event) {
			return res.status(404).send("Event not found");
		}

		res.cookie("secret", codeOrSecret);
		res.clearCookie("code");

		return res.status(200).json({
			title: event.title,
			code: event.code,
			secret: event.secret,
			createdAt: event.createdAt,
		});
	} else if (codeOrSecret.length == CODE_LENGTH) {
		const event = await Event.findOne({
			code: codeOrSecret,
		});

		if (!event) {
			return res.status(404).send("Event not found");
		}

		if (!event.open) {
			return res
				.status(403)
				.send("Event is currently closed for new participants");
		}

		res.clearCookie("secret");
		res.cookie("code", event.code);

		return res.status(200).json({
			title: event.title,
			code: event.code,
			created: event.createdAt,
		});
	}
});

router.delete("/event/:code", async (req, res) => {
	const { code } = req.params;
	const { secret } = req.cookies;
	if (!secret) {
		return res.status(403).send("Not an organisator");
	}

	const event = Event.findOne({
		code: code,
		secret: secret,
	});
	if (!event) {
		return res.status(404).send("Event not found");
	}

	await event.delete();

	res.clearCookie("secret");

	res.status(200).send("OK");
});

module.exports = router;
