const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventSchema = Schema({
	title: {
		type: String,
		default: "Untitled event",
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Event", EventSchema);
