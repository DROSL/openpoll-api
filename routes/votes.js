const express = require("express");
const router = express.Router();

const setCookie = require("../middleware/setCookie");
const checkPermission = require("../middleware/checkPermission");

const Answer = require("../models/answer");
const Vote = require("../models/vote");

// vote for an answer
router.post("/answers/:answerId/vote", setCookie, checkPermission, async (req, res) => {
	try {
		const { event, poll, answer } = res.locals;
		if (!(poll.started && !poll.stopped)) {
			return res.status(403).send("Poll not active (anymore)");
		}

		if (answer.hidden) {
			return res.status(404).send("Answer not found");
		}

		const { userId } = req.session;
		if (!poll.allowMultipleVotesPerAnswer) {
			const oldVote = await Vote.findOne({
				answer: answer._id,
				participant: userId,
			});
			if (oldVote) {
				return res.status(403).send("You have already voted for this answer");
			}
		}

		const votesPerParticipant = poll.votesPerParticipant;
		const votesOfThisParticipant = await Vote.countDocuments({
			poll: poll._id,
			participant: userId,
		});
		if (votesPerParticipant > 0 && votesOfThisParticipant >= votesPerParticipant) {
			return res.status(403).send("You have already used all of your votes for this poll.");
		}

		const vote = new Vote({
			poll: poll._id,
			answer: answer._id,
			participant: userId,
		});
		await vote.save();

		io.to(event.code).emit("vote-new", event.code, poll._id, answer._id);

		return res.status(200).json(vote);
	} catch (err) {
		console.log(err);
		return res.status(500).send("Something went wrong...");
	}
});

// get my votes
router.get("/polls/:pollId/votes", setCookie, checkPermission, async (req, res) => {
	try {
		const { poll, userId } = res.locals;

		const votes = await Vote.find({
			poll: poll._id,
			participant: userId,
		});

		return res.status(200).json(votes);
	} catch (err) {
		console.log(err);
		return res.status(500).send("Something went wrong...");
	}
});

// get results of poll
router.get("/polls/:pollId/results", setCookie, checkPermission, async (req, res) => {
	try {
		const { poll, isParticipant } = res.locals;

		const answers = await Answer.aggregate([
			{
				$match: {
					poll: poll._id,
					...(isParticipant && { hidden: false }),
				},
			},
			{
				$lookup: {
					from: Vote.collection.name,
					localField: "_id",
					foreignField: "answer",
					as: "votes",
				},
			},
			{
				$project: {
					_id: 1,
					title: 1,
					hidden: 1,
					votes: { $size: "$votes" },
				},
			},
		]);

		return res.status(200).json(answers);
	} catch (err) {
		console.log(err);
		return res.status(500).send("Something went wrong...");
	}
});

// delete results of poll
router.delete("/polls/:pollId/results", setCookie, checkPermission, async (req, res) => {
	try {
		const { poll, isOrganisator } = res.locals;

		if (!isOrganisator) {
			return res.status(403).send("You are not an organisator of this event");
		}

		poll.started = false;
		poll.stopped = false;
		await poll.save();

		await Vote.deleteMany({
			poll: poll._id
		});

		return res.status(200).send("OK");
	} catch (err) {
		console.log(err);
		return res.status(500).send("Something went wrong...");
	}
});

module.exports = router;
