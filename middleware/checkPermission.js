const Event = require("../models/event");
const Poll = require("../models/poll");
const Answer = require("../models/answer");

const checkPermission = async (req, res, next) => {
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

		const pollId = (answer && answer.poll._id) || req.params.pollId;
		if (pollId) {
			poll = await Poll.findOne({
				_id: pollId,
			});
			if (!poll) {
				return res.status(404).send("Poll not found");
			}
		}

		const code = req.params.code;
		const eventId = (poll && poll.event._id) || req.params.eventId;
		if (code) {
			event = await Event.findOne({
				code: code,
			});
		} else if (eventId) {
			event = await Event.findOne({
				_id: eventId,
			});
		}
		if (!event) {
			return res.status(404).send("Event not found");
		}

		const { userId } = req.session;
		const isOrganisator = event.organisators.includes(userId);
		const isParticipant = event.participants.includes(userId);

		if (!isOrganisator && !isParticipant) {
			return res.status(401).send("You have to join this event first to participate");
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

		return next();
	} catch (err) {
		console.log(err);
		return res.status(500).send("Something went wrong...");
	}
};

module.exports = checkPermission;
