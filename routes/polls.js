const express = require("express");
const router = express.Router();

const setCookie = require("../middleware/setCookie");
const checkPermission = require("../middleware/checkPermission");

const Poll = require("../models/poll");

// create new poll
router.post("/events/:code/polls", setCookie, checkPermission, async (req, res) => {
	try {
		const { event, isOrganisator } = res.locals;

		if (!isOrganisator) {
			return res.status(403).send("You are not an organisator of this event");
		}

		const { title, type, votesPerParticipant, allowCustomAnswers, duration } = req.body;
		if (!title) {
			return res.status(400).send("Title required");
		}

		const poll = new Poll({
			title: title,
			event: event._id,
			votesPerParticipant: 1,
			allowCustomAnswers: false,
			duration: 180,
			activeUntil: null,
		});
		await poll.save();

		// TODO: Add answers

		return res.status(200).json({
			_id: poll._id,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).send("Something went wrong...");
	}
});

// get polls of event
router.get("/events/:code/polls", setCookie, checkPermission, async (req, res) => {
	try {
		const { event, isParticipant } = res.locals;

		const polls = await Poll.find({
			event: event._id,
			...(isParticipant && { activeUntil: { $gte: Date.now() } }),
		});

		// TODO return answers

		return res.status(200).send(polls);
	} catch (err) {
		console.log(err);
		return res.status(500).send("Something went wrong...");
	}
});

// start a poll
router.put("/polls/:pollId/start", setCookie, checkPermission, async (req, res) => {
	try {
		const { poll, isOrganisator } = res.locals;

		if (!isOrganisator) {
			return res.status(403).send("You are not an organisator of this event");
		}

		const activeUntil = new Date();
		activeUntil.setSeconds(activeUntil.getSeconds() + poll.duration);

		poll.activeUntil = activeUntil;
		await poll.save();

		return res.status(200).send("OK");
	} catch (err) {
		console.log(err);
		res.status(500).send("Something went wrong...");
	}
});

// start a poll
router.put("/polls/:pollId/stop", setCookie, checkPermission, async (req, res) => {
	try {
		const { poll, isOrganisator } = res.locals;

		if (!isOrganisator) {
			return res.status(403).send("You are not an organisator of this event");
		}

		poll.activeUntil = null;
		await poll.save();

		return res.status(200).send("OK");
	} catch (err) {
		console.log(err);
		res.status(500).send("Something went wrong...");
	}
});

// edit a poll
router.put("/polls/:pollId", setCookie, checkPermission, async (req, res) => {
	try {
	} catch (err) {
		console.log(err);
		res.status(500).send("Something went wrong...");
	}
});

// delete a poll
router.delete("/polls/:pollId", setCookie, checkPermission, async (req, res) => {
	try {
		const { poll, isOrganisator } = res.locals;

		if (!isOrganisator) {
			return res.status(403).send("You are not an organisator of this event");
		}

		await poll.delete();
		return res.status(200).send("OK");
	} catch (err) {
		console.log(err);
		res.status(500).send("Something went wrong...");
	}
});

module.exports = router;
