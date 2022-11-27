const config = require("config");

const socketio = require("socket.io");

const User = require("./models/user");
const Event = require("./models/event");

module.exports = (server, session) => {
	const io = socketio(server);

	io.use((socket, next) => session(socket.request, {}, next));

	io.on("connection", async (socket) => {
		console.log(`Socket ${socket.id} connected`);

		socket.on("disconnect", () => {
			console.log(`Socket ${socket.id} disconnected`);
		});

		socket.on("disconnecting", () => {
			[...socket.rooms]
				.filter((room) => room != socket.id)
				.forEach((room) => {
					socket.to(room).emit("user-leave", room);
				});
		});

		// refuse connection if no user id has been set
		if (!socket.request.session.userId) {
			console.log("user does not have a user id");
			socket.disconnect();
		}

		const { userId } = socket.request.session;
		socket.data.userId = userId;

		const events = await Event.find({
			$or: [
				{
					participants: userId,
				},
				{
					organisators: userId,
				},
			],
		});
		events.forEach((event) => {
			socket.to(event.code).emit("user-join", event.code);
			socket.join(event.code);
		});
	});

	return io;
};
