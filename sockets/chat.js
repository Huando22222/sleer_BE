// chatSocketManager.js
const Message = require("../models/message");
const Room = require("../models/room");
const User = require("../models/user");
function generateRandomRoomName(length) {
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let result = "";
	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		result += characters.charAt(randomIndex);
	}
	return result;
}

module.exports = function (io) {

	io.on("connection", (socket) => {
		console.log(`Chat Socket connected: ${socket.id}`);


		socket.on("join-room", async (room) => {// khi tao moi user thi user da tạo sẵn phòng với id là id user của user rồi
			socket.join(room);
			//check ng dung co trong room khong ?? => middleware // later add this
			const data = await Message.find({ room: room }).populate("sender"); //{room: room}
			//hinh nhu chi emit toi ng gui su kien ?? hay toan bo server???
			io.to(room).emit("server-message" , data );
			console.log("server-message", data[0]);
			console.log(
				`Socket ${socket.id} joined room: ${room} - data: ${data.length}`
			);
		});
		/// on create room ?
		socket.on("create-room", async ({ member, msg }) => {
			// const Messages2 = JSON.parse(Messages);
			//firstMsg
			if (Array.isArray(member) && member.length > 0) {
				const newRoom = new Room({
					roomName: generateRandomRoomName(10),
					users: member,
				});
				await newRoom.save();
				const data = await Room.findOne({
					_id: newRoom._id,
				}).populate("users");
				// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				const users = await User.find({ _id: { $in: member } });

				const updatePromises = users.map(async (user) => {
					user.rooms.push(newRoom._id);
					await user.save();
				});

				await Promise.all(updatePromises);
				if (data != null) {
					const newMsg = JSON.parse(msg);
					const newMessage = new Message({
						content: newMsg.content,
						sender:newMsg.sender,
						room: data._id,
					}); // chua check content == nullS ỏ ""
					if (
						newMessage.content != null &&
						newMessage.content != ""
					) {
						await newMessage.save();
						// 	.then(() => {
						// 	io.to(member).emit("add-room", data);
						// 	io.to(data._id).emit("recieve", newMessage);
						// 	console.log("create & emit:  ", newMessage );
						// });
						let dataMsg;
						dataMsg = await Message.findById({
							_id: newMessage._id,
						}).populate("sender").then(() => {
							io.to(member).emit("add-room", data);// 1 member ?? chua test data // nen de trong loop 
							// io.to(data._id).emit("recieve", dataMsg); // client joined room -> server send old msg back to client
							console.log("create & emit:  ", dataMsg);
						}); 
					}
					console.log("created room:", data);
				} else {
					console.log("false in find room process");
				}
				// member.forEach((userId) => {
				// 	console.log("room userID:", userId);
				// });
			} else {
				console.log("Invalid member data received.");
			}
		});



		socket.on("send-to", async(data ) => {
			const message = JSON.parse(data);
			const newMessage = new Message(message);
			if (newMessage.content != null && newMessage.content != "" ) {
				await newMessage.save()
				// .then(() => {
				// 	io.to(message.room).emit("recieve", message);
				// 	console.log("emit:  ", message);
				// 	console.log("emit:  ", newMessage);
				// });
				
				// let dataMsg;
				//dataMsg =
					await Message.findById({
						_id: newMessage._id,
					})
						.populate("sender")
						.then((message) => {
							io.to(message.room.toString()).emit("recieve", message);
							console.log("message: ", message);
							console.log("message.room: ", message.room);
						});  /// k nhan dataMsg
			}
		});
	});

};
