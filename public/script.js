const info = document.getElementById("info");
const code = document.getElementById("code");
const join = document.getElementById("join");

join.addEventListener("click", () => {
	fetch(`/events/${code.value}/join`, {
		method: "POST",
	})
		.then((res) => {
			console.log(res);
		})
		.catch((err) => {
			console.log(err);
		});
});

const socket = io("http://localhost:4000");

socket.on("user-join", (room) => {
	console.log(`A new user joined to room ${room}`);
});

socket.on("user-leave", (room) => {
	console.log(`A user left the room ${room}`);
});
