const User = require("../models/user");

const setCookie = async (socket, next) => {
	try {
		const session = socket.request.session;

		if (!session.userId) {
			const user = new User();
			await user.save();

			session.userId = user._id;
			session.save();
		}

		next();
	} catch (err) {
		return res.status(500).send("Something went wrong...");
	}
};

module.exports = setCookie;
