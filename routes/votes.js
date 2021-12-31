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

// get results of poll
router.get("/polls/:pollId/votes", setCookie, checkPermission, async (req, res) => {
	try {
		const { poll, isParticipant } = res.locals;

		console.log(poll._id);
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

module.exports = router;
