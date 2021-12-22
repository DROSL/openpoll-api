const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Vote = require("./vote");

const AnswerSchema = Schema({
	title: {
		type: String,
		required: true,
	},
	poll: {
		type: Schema.Types.ObjectId,
		ref: "Poll",
		required: true,
	},
	hidden: {
		type: Boolean,
		default: false,
	},
});

AnswerSchema.pre("remove", async function (next) {
	await Vote.deleteMany({ answer: this._id });
	next();
});

module.exports = mongoose.model("Answer", AnswerSchema);
