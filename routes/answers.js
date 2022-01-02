const express = require("express");
const router = express.Router();

const setCookie = require("../middleware/setCookie");
const checkPermission = require("../middleware/checkPermission");

const Answer = require("../models/answer");

// add new answer to poll
router.post("/polls/:pollId/answers", setCookie, checkPermission, async (req, res) => {
	try {
		const { title, hidden } = req.body;
		if (!title) {
			return res.status(400).send("Title required");
		}

		const { event, poll, isParticipant } = res.locals;

		const oldAnswer = await Answer.findOne({
			title: title.trim(),
			poll: poll._id,
		});
		if (oldAnswer) {
			return res.status(409).send("Another answer with this title already exists");
		}

		if (isParticipant && !poll.allowCustomAnswers) {
			return res.status(403).send("Only organisators can add answers");
		}

		// TODO: forbidden title checker

		const answer = new Answer({
			title: title.trim(),
			poll: poll._id,
			hidden: Boolean(hidden),
		});
		await answer.save();

		io.to(event.code).emit("answer-add", event.code, poll._id, answer._id, answer.title);

		return res
			.status(200)
			.json({ _id: answer._id, title: answer.title, hidden: answer.hidden });
	} catch (err) {
		console.log(err);
		res.status(500).send("Something went wrong...");
	}
});

// get answers of poll
router.get("/polls/:pollId/answers", setCookie, checkPermission, async (req, res) => {
	try {
		const { poll, isParticipant } = res.locals;

		const answers = await Answer.find({
			poll: poll._id,
			...(isParticipant && { hidden: false }),
		});

		return res.status(200).json(
			answers.map((answer) => ({
				_id: answer._id,
				title: answer.title,
				hidden: answer.hidden,
			}))
		);
	} catch (err) {
		console.log(err);
		return res.status(500).send("Something went wrong");
	}
});

// edit an answer
router.put("/answers/:answerId", setCookie, checkPermission, async (req, res) => {
	try {
		const { answer, isOrganisator } = res.locals;

		if (!isOrganisator) {
			return res.status(403).send("You are not an organisator of this event");
		}

		const { title, hidden } = req.body;

		if (title) {
			const oldAnswer = await Answer.findOne({
				title: title.trim(),
				poll: poll._id,
			});
			if (oldAnswer) {
				return res.status(409).send("Another answer with this title already exists");
			}

			answer.title = title.trim();
		}

		if (hidden == true || hidden == false) {
			answer.hidden = hidden;
		}

		await answer.save();
		return res.status(200).json({
			_id: answer._id,
			title: answer.title,
			hidden: answer.hidden,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).send("Something went wrong...");
	}
});

// delete an answer
router.delete("/answers/:answerId", setCookie, checkPermission, async (req, res) => {
	try {
		const { answer, isOrganisator } = res.locals;

		if (!isOrganisator) {
			return res.status(403).send("You are not an organisator of this event");
		}

		await answer.deleteOne();

		return res.status(200).send("OK");
	} catch (err) {
		console.log(err);
		return res.status(500).send("Something went wrong...");
	}
});

module.exports = router;
