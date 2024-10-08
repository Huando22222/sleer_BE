const fs = require("fs");
// const fs = require("fs").promises;
const path = require("path");

const socketAuthMiddleware = require("../middlewares/socket-auth-middleware");
const User = require("../models/user");
const Post = require("../models/post");

module.exports = function (io) {
	io.use(socketAuthMiddleware);

	io.on("connection", async (socket) => {
		socket.on("test", (data) => {
			socket.emit("test1", () => {
				console.log("test1:");
			});
			io.to(data).emit("test", data, (answer) => {
				console.log("run anyway:");
				if (answer) {
					console.log("recieved:");
				} else {
					console.log("not recieved:", socket.id);
				}
			});
			console.log("test data:", data);
		});

		// setInterval(() => {
		// 	console.log("Sending hello event to client");
		// 	socket.emit("hello", "world" ,(response) => {

		// 		console.log(response);
		// 		if (response === "Client received the event") {
		// 			console.log(true);
		// 		} else {
		// 			console.log(false);
		// 		}

		// 	});
		// }, 2000);

		socket.on("join", (room) => {
			socket.join(room);
			console.log("join:", room);
		});
		////////////////////////////////////////////
		console.log(
			`Socket connected: ${socket.id}, Authenticated: ${socket.isAuthenticated}, payload.id: ${socket.payload?.id}`
		);

		if (socket.isAuthenticated) {
			const payload = socket.payload;
			await User.findByIdAndUpdate(payload.id, {
				online: true,
				currentSocketId: socket.id,
			});

			console.log("joined: ",payload.id);
			socket.join(payload.id);

			const unsentPosts = await Post.find({
				"recipients.user": payload.id,
				"recipients.sent": false,
			})
				.populate({
					path: "owner",
					select: "_id displayName avatar phone",
				})
				.select("-recipients");

			if (unsentPosts.length > 0) {
				console.log(`Unsent ${unsentPosts.length} posts : `); //${unsentPosts}


				socket.emit("pending_post", unsentPosts, async (answer) => {
					if (answer === "recieved") {
						try {
							// console.log(
							// 	"Client recieved pendingPosts: " +
							// 		JSON.stringify(unsentPosts)
							// );

							// const postIds = postsWithImages.map((post) => post._id);

							// const postIds = unsentPosts.map((post) => post._id);
							// await Post.updateMany(
							// 	{
							// 		_id: { $in: postIds },
							// 		"recipients.user": payload.id,
							// 	},
							// 	{ $set: { "recipients.$.sent": true } }
							// );
						} catch (error) {
							console.log(`pending_post error: ${error}`);
						}
					}
				});
			}

			socket.on("privateEvent", (data) => {
				if (!socket.isAuthenticated) {
					return socket.emit("error", "Unauthorized");
				}
				console.log("Private event received:", data);
			});

			socket.on("disconnect", async () => {
				try {
					if (socket.isAuthenticated) {
						await User.findByIdAndUpdate(socket.payload.id, {
							online: false,
							currentSocketId: "",
						});
					}
				} catch (error) {
					console.log(error);
				}
			});
		}

		socket.on("public-event", (data) => {
			console.log("Public event received:", data);
		});

		socket.on("disconnect", async () => {
			try {
				console.log(
					`-------------Socket disconnected: ${socket.id}-------------\n`
				);
			} catch (error) {
				console.log(error);
			}
		});
	});
};

// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);

// const port = 3000;

// app.get("/", (req, res) => {
// 	res.send("Hello from the server!");
// });

// io.on("connection", (socket) => {
// 	socket.leave
// 	console.log("A user connected");
// 	socket.emit("welcome", "Welcome to the chat!");

// 	socket.on("chat message", (msg) => {
// 		console.log("message: " + msg);
// 		io.emit("chat message", msg);
// 	});

// 	socket.on("disconnect", () => {
// 		console.log("A user disconnected");
// 	});
// });

// server.listen(port, () => {
// 	console.log(`Server listening on port ${port}`);
// });
