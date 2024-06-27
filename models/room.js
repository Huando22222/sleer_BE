const mongoose = require("mongoose");
const RoomSchema = new mongoose.Schema(
	{
		roomName: { type: String, required: true },
		users: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "users",
				required: true,
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("rooms", RoomSchema);
