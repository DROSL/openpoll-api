const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VoteModel = Schema({
	poll: {
		type: Schema.Types.ObjectId,
		ref: "Poll",
	},
	answer: {
		type: Schema.Types.ObjectId,
		ref: "Answer",
	},
	participant: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Vote", VoteModel);
