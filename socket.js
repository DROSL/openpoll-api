const socketio = require("socket.io");

const Event = require("./models/event");

class SocketHandler {
	constructor(server, session) {
		this.io = socketio(server);

		this.io.use((socket, next) => session(socket.request, {}, next));
	}
}

module.exports = (server, session) => new SocketHandler(server, session);

module.exports = (server, session) => {
	const io = socketio(server);

	io.use((socket, next) => session(socket.request, {}, next));

	io.on("connection", async (socket) => {
		console.log(`Socket ${socket.io} connected`);

		socket.on("disconnect", () => {
			console.log(`Socket ${socket.id} disconnected`);
		});

		const { userId } = socket.request.session.userId;
		if (!userId) {
			return socket.disconnect();
		}

		const events = await Event.findAll({
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
		});
	});

	return io;
};
