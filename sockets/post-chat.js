const socketAuthMiddleware = require("../middlewares/socket-auth-middleware");
const User = require("../models/user");
const Post = require("../models/post");

module.exports = function (io) {
	io.use(socketAuthMiddleware);

	io.on("connection", async (socket) => {
		console.log(
			`Socket connected: ${socket.id}, Authenticated: ${socket.isAuthenticated}, payload: ${socket.payload?.phone}`
		);

		if (!socket.isAuthenticated) {
			const payloadId = socket.payload;
			await User.findByIdAndUpdate(payloadId.id, {
				online: true,
				currentSocketId: socket.id,
			});

			socket.join(payloadId.id.toString());
			
			const unsentPosts = await Post.find({
				"recipients.user": payloadId.id,
				"recipients.sent": false,
			}).populate("owner", "displayName");
	
			for (const post of unsentPosts) {
				socket.emit("new_post", {
					postId: post._id,
					ownerId: post.owner._id,
					ownerName: post.owner.displayName,
				});
	
				await Post.updateOne(
					{ _id: post._id, "recipients.user": payloadId.id },
					{ $set: { "recipients.$.sent": true } }
				);
			}
		}



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
			if (socket.isAuthenticated) {
				await User.findByIdAndUpdate(socket.payload.id, {
					online: false,
					currentSocketId: "",
				});
			}
			console.log(
				`-------------Socket disconnected: ${socket.id}-------------`
			);
		});
	});
	
};

