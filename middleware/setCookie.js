const User = require("../models/user");

const setCookie = async (req, res, next) => {
	try {
		if (!req.session.userId) {
			const user = new User();
			await user.save();

			req.session.userId = user._id;
		}

		next();
	} catch (err) {
		return res.status(500).send("Something went wrong...");
	}
};

module.exports = setCookie;
