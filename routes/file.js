const config = require("config");

const express = require("express");
const router = express.Router();

const multer = require("multer");

const setCookie = require("../middleware/setCookie");
const checkPermission = require("../middleware/checkPermission");

const File = require("../models/file");

// upload file to event
const upload = multer({ dest: config.upload.dest, limits: config.upload.limits }).single("file");

router.post("/events/:code/file", setCookie, checkPermission, (req, res) => {
	try {
		const { event, isOrganisator } = res.locals;

		if (!isOrganisator) {
			return res.status(403).send("You are not an organisator of this event");
		}

		upload(req, res, async (err) => {
			if (err) {
				if (err.code === "LIMIT_FILE_SIZE") {
					return res.status(400).send("File too large");
				}

				return res.status(500).send("File upload failed");
			}

			if (!req.file) {
				return res.status(500).send("File upload failed");
			}

			// delete old file
			const oldFile = await File.findOne({ _id: event.file });
			console.log(oldFile);
			if (oldFile) {
				await oldFile.deleteOne();
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

// download file
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

// delete file
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

module.exports = router;
