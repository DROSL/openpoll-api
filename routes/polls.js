const express = require("express");
const router = express.Router();

const setCookie = require("../middleware/setCookie");
const checkPermission = require("../middleware/checkPermission");

const Poll = require("../models/poll");
const Answer = require("../models/answer");

// create new poll
router.post("/events/:code/polls", setCookie, checkPermission, async (req, res) => {
	try {
		const { event, isOrganisator } = res.locals;

		if (!isOrganisator) {
			return res.status(403).send("You are not an organisator of this event");
		}

		const {
			title,
			answers,
			allowCustomAnswers,
			votesPerParticipant,
			allowMultipleVotesPerAnswer,
		} = req.body;

		if (!(title && title.trim())) {
			return res.status(400).send("Title required");
		}

		const answers_ = answers.filter((answer) => answer.trim());
		if (answers_.length < 1) {
			return res.status(400).send("At least 1 answer required");
		}

		const poll = new Poll({
			title: title.trim(),
			event: event._id,
			...(allowCustomAnswers === Boolean(allowCustomAnswers) && {
				allowCustomAnswers: Boolean(allowCustomAnswers),
			}),
			...(Number(votesPerParticipant) > 0 && {
				votesPerParticipant: Number(votesPerParticipant),
			}),
			...(allowMultipleVotesPerAnswer === Boolean(allowMultipleVotesPerAnswer) && {
				allowMultipleVotesPerAnswer: Boolean(allowMultipleVotesPerAnswer),
			}),
		});
		await poll.save();

		await Answer.insertMany(
			answers_.map((answer) => ({
				title: answer.trim(),
				poll: poll._id,
				hidden: false,
			}))
		);

		return res.status(200).json(poll);
	} catch (err) {
		console.log(err);
		return res.status(500).send("Something went wrong...");
	}
});

// edit a poll
router.put("/polls/:pollId", setCookie, checkPermission, async (req, res) => {
	try {
		const { poll, isOrganisator } = res.locals;

		if (!isOrganisator) {
			return res.status(403).send("You are not an organisator of this event");
		}

		const {
			title,
			answers,
			allowCustomAnswers,
			votesPerParticipant,
			allowMultipleVotesPerAnswer,
		} = req.body;

		if (title && title.trim()) {
			poll.title = title.trim();
		}

		if (allowCustomAnswers === Boolean(allowCustomAnswers)) {
			poll.allowCustomAnswers = Boolean(allowCustomAnswers);
		}

		if (Number(votesPerParticipant) > 0) {
			poll.votesPerParticipant = Number(votesPerParticipant);
		}

		if (allowMultipleVotesPerAnswer === Boolean(allowMultipleVotesPerAnswer)) {
			poll.allowMultipleVotesPerAnswer = Boolean(allowMultipleVotesPerAnswer);
		}

		await poll.save();

		return res.status(200).send(poll);
	} catch (err) {
		console.log(err);
		res.status(500).send("Something went wrong...");
	}
});

// get polls of event
router.get("/events/:code/polls", setCookie, checkPermission, async (req, res) => {
	try {
		const { event, isParticipant } = res.locals;

		const polls = await Poll.find({
			event: event._id,
			...(isParticipant && { started: true }),
		});

		// TODO: return answers

		return res.status(200).send(polls);
	} catch (err) {
		console.log(err);
		return res.status(500).send("Something went wrong...");
	}
});

// get a poll by id
router.get("/polls/:pollId", setCookie, checkPermission, async (req, res) => {
	try {
		const { poll } = res.locals;

		// TODO: return answers

		return res.status(200).send(poll);
	} catch (err) {
		console.log(err);
		return res.status(500).send("Something went wrong...");
	}
});

// start a poll
router.put("/polls/:pollId/start", setCookie, checkPermission, async (req, res) => {
	try {
		const { event, poll, isOrganisator } = res.locals;

		if (!isOrganisator) {
			return res.status(403).send("You are not an organisator of this event");
		}

		// TODO: check if other polls are currently active

		poll.started = true;
		await poll.save();

		io.to(event.code).emit("poll-start", event.code, poll._id, poll.title);

		return res.status(200).send("OK");
	} catch (err) {
		console.log(err);
		res.status(500).send("Something went wrong...");
	}
});

// start a poll
router.put("/polls/:pollId/stop", setCookie, checkPermission, async (req, res) => {
	try {
		const { event, poll, isOrganisator } = res.locals;

		if (!isOrganisator) {
			return res.status(403).send("You are not an organisator of this event");
		}

		poll.stopped = true;
		await poll.save();

		io.to(event.code).emit("poll-end", event.code, poll._id);

		return res.status(200).send("OK");
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

		await poll.deleteOne();

		return res.status(200).send("OK");
	} catch (err) {
		console.log(err);
		res.status(500).send("Something went wrong...");
	}
});

module.exports = router;
