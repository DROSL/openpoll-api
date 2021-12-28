const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fs = require("fs");

const FileSchema = Schema({
	name: {
		type: String,
		required: true,
	},
	size: {
		type: Number,
		default: 0,
	},
	mimetype: {
		type: String,
	},
	path: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

FileSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
	try {
		console.log(`Delete ${this.path}`);
		fs.unlinkSync(this.path);
	} catch (err) {
		console.log(err);
		console.log(`Failed to delete ${this.path}`);
	}
	next();
});

module.exports = mongoose.model("File", FileSchema);
