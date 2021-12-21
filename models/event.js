const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventSchema = Schema({
	title: {
		type: String,
		default: "Untitled event",
	},
	code: {
		type: String,
		unique: true,
		required: true,
	},
	open: {
		type: Boolean,
		default: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Event", EventSchema);
