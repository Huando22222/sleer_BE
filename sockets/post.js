const socketAuthMiddleware = require("../middlewares/socket-auth-middleware");


module.exports = function (io) {
	io.use(socketAuthMiddleware);

	io.on("connection", (socket) => {
		console.log(
			`Socket connected: ${socket.id}, Authenticated: ${socket.isAuthenticated}, tokenPayload: ${socket.tokenPayload?.phone}`
		);

		socket.on("public-event", (data) => {
			console.log("Public event received:", data);
		});

		socket.on("privateEvent", (data) => {
			if (!socket.isAuthenticated) {
				return socket.emit("error", "Unauthorized");
			}
			console.log("Private event received:", data);
		});

		socket.on("disconnect", async () => {
			console.log(
				`-------------Socket disconnected: ${socket.id}-------------`
			);
		});

		
	});
	
};

// Cập nhật trạng thái offline cho người dùng khi socket ngắt kết nối
		// const user = socket.tokenPayload; // Truy cập tokenPayload
		// if (user) {
		// 	await UserStatus.findOneAndUpdate(
		// 		{ userId: user._id },
		// 		{ online: false, socketId: null }
		// 	);
		// 	console.log(`User ${user._id} is now offline`);
		// }