const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

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
router.post("/events", auth, async (req, res) => {
	try {
		const event = new Event({
			code: generateRandomString(CODE_LENGTH, CODE_CHARS),
			secret: generateRandomString(SECRET_LENGTH, SECRET_CHARS),
			user: req.session.userId,
		});
		await event.save();

		return res.status(200).json({
			title: event.title,
			code: event.code,
			secret: event.secret,
			createdAt: event.createdAt,
		});
	} catch (err) {
		return res.status(500).send("Something went wrong...");
	}
});

// join an existing event as a participant
router.post("/events/:code/join", auth, async (req, res) => {
	const { code } = req.params;
	const event = await Event.findOne({
		code: code,
	});

	if (!event) {
		return res.status(404).send("Event not found");
	}

	if (!event.open) {
		return res
			.status(403)
			.send("Event is currently closed for new participants");
	}

	try {
		const { userId } = req.session;
		if (!event.participants.contains(userId)) {
			event.participants.push(userId);
			await event.save();
		}

		return res.status(200).send("OK");
	} catch (err) {
		return res.status(500).send("Something went wrong...");
	}
});

// join an existing meeting as a organisator
router.post("/events/:secret/edit", auth, async (req, res) => {
	const { secret } = req.params;
	const event = await Event.findOne({
		secret: secret,
	});

	if (!event) {
		return res.status(404).send("Event not found");
	}

	try {
		const { userId } = req.session;
		if (!event.organisators.contains(userId)) {
			event.organisators.push(userId);
			await event.save();
		}

		return res.status(200).send({
			title: event.title,
			code: event.code,
			secret: event.secret,
		});
	} catch (err) {
		return res.status(500).send("Something went wrong");
	}
});

// get event information
router.get("/events/:code", auth, async (req, res) => {
	const { code } = req.params;
	const event = await Event.findOne({
		code: codeOrSecret,
	});

	if (!event) {
		return res.status(404).send("Event not found");
	}

	const { userId } = req.session;
	const isOrganisator = event.organisators.contains(userId);
	const isParticipant = event.participants.contains(userId);
	if (!isOrganisator && !isParticipant) {
		return res
			.status(403)
			.send("You have to join this event first to participate");
	}

	return res.status(200).json({
		title: event.title,
		code: event.code,
		created: event.createdAt,
		...(isOrganisator && { secret: event.secret }),
	});
});

router.delete("/events/:code", auth, async (req, res) => {
	const { code } = req.params;

	const event = await Event.findOne({
		code: code,
	});
	if (!event) {
		return res.status(404).send("Event not found");
	}

	const { userId } = req.session;
	if (!event.organisators.contains(userId)) {
		return res.status(403).send("Permission denied");
	}

	await event.delete();

	return res.status(200).send("OK");
});

module.exports = router;
