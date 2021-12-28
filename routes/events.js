const config = require("config");

const express = require("express");
const router = express.Router();

const multer = require("multer");

const setCookie = require("../middleware/setCookie");
const checkPermission = require("../middleware/checkPermission");

const Event = require("../models/event");
const File = require("../models/file");

const CODE_LENGTH = 6;
const CODE_CHARS = "abcdefghijklmnopqrstuvwxyz";
const SECRET_LENGTH = 24;
const SECRET_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const generateRandomString = (length, chars) => {
	let result = "";
	for (let i = 0; i < length; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
};

// create a new event
router.post("/events", setCookie, async (req, res) => {
	try {
		const { userId } = req.session;
		const event = new Event({
			code: generateRandomString(CODE_LENGTH, CODE_CHARS),
			secret: generateRandomString(SECRET_LENGTH, SECRET_CHARS),
			organisators: [userId],
		});
		await event.save();

		return res.status(200).json({
			title: event.title,
			code: event.code,
			secret: event.secret,
			createdAt: event.createdAt,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).send("Something went wrong...");
	}
});

// join an existing event as a participant
router.post("/events/:code/join", setCookie, async (req, res) => {
	try {
		const { code } = req.params;
		const event = await Event.findOne({
			code: code,
		});

		if (!event) {
			return res.status(404).send("Event not found");
		}

		if (!event.open) {
			return res.status(403).send("Event is currently closed for new participants");
		}

		const { userId } = req.session;
		if (!event.participants.includes(userId)) {
			event.participants.push(userId);
			await event.save();
		}

		return res.status(200).send("OK");
	} catch (err) {
		console.log(err);
		return res.status(500).send("Something went wrong...");
	}
});

// join an existing meeting as a organisator
router.post("/events/:secret/edit", setCookie, async (req, res) => {
	try {
		const { secret } = req.params;
		const event = await Event.findOne({
			secret: secret,
		});

		if (!event) {
			return res.status(404).send("Event not found");
		}

		const { userId } = req.session;
		if (!event.organisators.includes(userId)) {
			event.organisators.push(userId);
			await event.save();
		}

		return res.status(200).send({
			title: event.title,
			code: event.code,
			secret: event.secret,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).send("Something went wrong");
	}
});

// get event information
router.get("/events/:code", setCookie, checkPermission, async (req, res) => {
	try {
		const { event, isOrganisator } = res.locals;

		const file = event.file ? await File.findOne({ _id: event.file._id }) : null;

		return res.status(200).json({
			title: event.title,
			description: event.description,
			file: file && {
				_id: file._id,
				name: file.name,
				size: file.size,
				mimetype: file.mimetype,
				createdAt: file.createdAt,
			},
			code: event.code,
			createdAt: event.createdAt,
			...(isOrganisator && { secret: event.secret }),
		});
	} catch (err) {
		console.log(err);
		return res.status(500).send("Something went wrong...");
	}
});

// edit event information
router.put("/events/:code", setCookie, checkPermission, async (req, res) => {
	try {
	} catch (err) {
		console.log(err);
		res.status(500).send("Something went wrong...");
	}
});

// attach file to event information
const upload = multer({ dest: config.upload.dest, limits: config.upload.limits }).single("file");

router.post("/events/:code/file", setCookie, checkPermission, (req, res) => {
	try {
		const { event, isOrganisator } = res.locals;

		if (!isOrganisator) {
			return res.status(403).send("You are not an organisator of this event");
		}

		upload(req, res, async (err) => {
			if (err || !req.file) {
				return res.status(500).send("File upload failed");
			}

			// create new file
			const file = new File({
				name: req.file.originalname,
				size: req.file.size,
				mimetype: req.file.mimetype,
				path: req.file.path,
			});
			await file.save();

			// update event
			event.file = file;
			await event.save();

			return res.status(200).json({
				_id: file._id,
				name: file.name,
				size: file.size,
				mimetype: file.mimetype,
				createdAt: file.createdAt,
			});
		});
	} catch (err) {
		console.log(err);
		res.status(500).send("Something went wrong...");
	}
});

// download attached file
router.get("/events/:code/file", setCookie, checkPermission, async (req, res) => {
	try {
		const { event } = res.locals;

		const file = await File.findOne({ _id: event.file });
		if (!file) {
			return res.status(404).send("File not found");
		}

		return res.download(file.path, file.name);
	} catch (err) {
		console.log(err);
		return res.status(500).send("Something went wrong...");
	}
});

// delete attached file from event information
router.delete("/events/:code/file", setCookie, checkPermission, async (req, res) => {
	try {
		const { event, isOrganisator } = res.locals;

		if (!isOrganisator) {
			return res.status(403).send("You are not an organisator of this event");
		}

		if (!event.file) {
			return res.status(400).send("No file attached to this event");
		}

		const file = await File.findOne({ _id: event.file });

		event.file = null;
		await event.save();
		await file.deleteOne();

		return res.status(200).send("OK");
	} catch (err) {
		console.log(err);
		res.status(500).send("Something went wrong...");
	}
});

// delete event
router.delete("/events/:code", setCookie, checkPermission, async (req, res) => {
	try {
		const { event, isOrganisator } = res.locals;

		if (!isOrganisator) {
			return res.status(403).send("You are not an organisator of this event");
		}

		await event.deleteOne();

		return res.status(200).send("OK");
	} catch (err) {
		console.log(err);
		return res.status(500).send("Something went wrong...");
	}
});

module.exports = router;
