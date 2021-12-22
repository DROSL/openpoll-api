const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const Event = require("../models/event");
const Poll = require("../models/poll");
const Answer = require("../models/answer");
const Vote = require("../models/vote");

const checkPermission = (req, res, next) => {
	try {
		let answer, poll, event;

		const answerId = req.params.answerId;
		if (answerId) {
			answer = await Answer.findOne({
				_id: answerId,
				hidden: false,
			});
			if (!answer) {
				return res.status(404).send("Answer not found");
			}
		}

		const pollId = res.locals.answer.poll._id || req.params.pollId;
		if (pollId) {
			poll = await Poll.findOne({
				_id: pollId,
			});
			if (!poll) {
				return res.status(404).send("Poll not found");
			}
		}

		const eventId = res.locals.poll.event._id || req.params.eventId;
		if (eventId) {
			event = await Event.findOne({
				_id: eventId,
			});
			if (!event) {
				return res.status(404).send("Event not found");
			}
		}

		const { userId } = req.session;
		const isOrganisator = event.organisators.contains(userId);
		const isParticipant = event.participants.contains(userId);

		if (!isOrganisator && !isParticipant) {
			return res.status(401).send("Permission denied");
		}

		if (isParticipant && poll && Date.now() > poll.activeUntil) {
			return res.status(403).send("Poll is not active anymore");
		}

		if (isParticipant && answer && answer.hidden) {
			return res.status(404).send("Answer not found");
		}

		res.locals.answer = answer;
		res.locals.poll = poll;
		res.locals.event = event;
		res.locals.isOrganisator = isOrganisator;
		res.locals.isParticipant = isParticipant;

		next();
	} catch (err) {
		return res.status(500).send("Something went wrong...");
	}
};

// add new answer to poll
router.post("/polls/:pollId/answers", auth, async (req, res) => {});

// get answers of poll
router.get("/polls/:pollId/answers", auth, async (req, res) => {
	try {
		const { poll, isParticipant } = res.locals;

		let answers = Answer.find({
			poll: poll._id,
			...poll(isParticipant && { hidden: false }),
		});

		return res.status(200).json(answers);
	} catch (err) {
		return res.status(500).send("Something went wrong");
	}
});

// vote for an answer
router.post(
	"/answers/:answerId/vote",
	auth,
	checkPermission,
	async (req, res) => {
		try {
			const { answer } = res.locals;
			if (answer.hidden) {
				return res.status(404).send("Answer not found");
			}

			const { userId } = req.session;
			const oldVote = await Vote.findOne({
				answer: answer._id,
				participant: userId,
			});
			if (oldVote) {
				return res
					.status(403)
					.send("You have already voted for this answer");
			}

			const votesPerParticipant = answer.poll.votesPerParticipant;
			const votesOfThisParticipant = await Vote.countDocuments({
				poll: answer.poll._id,
				participant: userId,
			});
			if (
				votesPerParticipant > 0 &&
				votesOfThisParticipant >= votesPerParticipant
			) {
				return res
					.status(403)
					.send("You have already used all the votes for this poll.");
			}

			const vote = new Vote({
				answer: answer._id,
				participant: userId,
			});
			await vote.save();

			return res.status(200).json(vote);
		} catch (err) {
			return res.status(500).send("Something went wrong...");
		}
	}
);

// edit an answer
router.put("/answers/:answerId", auth, async (req, res) => {});

module.exports = router;
