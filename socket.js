const socketio = require("socket.io");

const Event = require("./models/event");

module.exports = (server, session) => {
	const io = socketio(server);

	io.use((socket, next) => session(socket.request, {}, next));

	io.on("connection", async (socket) => {
		console.log(`Socket ${socket.id} connected`);

		socket.on("disconnecting", () => {
			[...socket.rooms]
				.filter((room) => room != socket.id)
				.forEach((room) => {
					socket.to(room).emit("user-leave", room);
				});
		});

		socket.on("disconnect", () => {
			console.log(`Socket ${socket.id} disconnected`);
		});

		const { userId } = socket.request.session;
		if (!userId) {
			console.log("does not have a user id");
			return socket.disconnect();
		}

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
			socket.join(event.code);
			socket.to(event.code).emit("user-join", event.code);
		});
	});

	return io;
};
