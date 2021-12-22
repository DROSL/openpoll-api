const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const Event = require("../models/event");
const Poll = require("../models/poll");
const Answer = require("../models/answer");

// create new poll
router.post("/events/:code/polls", auth, async (req, res) => {
	try {
		const { code } = req.params;
		const event = await Event.findOne({
			code: code,
		});

		if (!event) {
			return res.status(404).send("Event not found");
		}

		const { userId } = req.session;
		if (!event.organisators.contains(userId)) {
			return res
				.status(403)
				.send("You are not an organisator of the event");
		}

		const { title } = req.body;
		if (!title) {
			return res.status(400).send("Title required");
		}

		const poll = new Poll({
			title: title,
			event: event._id,
			votesPerParticipant: 1,
			allowCustomAnswers: false,
			activeUntil: Date.now() + 3 * 60,
		});
		await poll.save();

		// TODO: Add answers

		return res.status(200).json({
			_id: poll._id,
		});
	} catch (err) {
		return res.status(500).send("Something went wrong...");
	}
});

// get polls of event
router.get("/events/:code/polls", auth, async (req, res) => {});

// edit a poll
router.put("/polls/:pollId", auth, async (req, res) => {});

// delete a poll
router.delete("/polls/:pollId", auth, async (req, res) => {
	try {
		const { pollId } = req.params;
		const poll = await Poll.findOne({
			_id: pollId,
		}).populate("event");

		if (!poll) {
			return res.status(404).send("Poll not found");
		}

		const { userId } = req.session;
		if (!poll.event.organisators.contains(userId)) {
			return res
				.status(401)
				.send("You are not an organisator of the event of this poll");
		}

		await poll.delete();
		return res.status(200).send("OK");
	} catch (err) {
		console.log(err);
	}
});

module.exports = router;
