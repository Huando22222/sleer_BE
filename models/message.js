const mongoose = require("mongoose");
const MessageSchema = new mongoose.Schema(
	{
		content: { type: "string", required: true },
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "users",
			required: true,
		},
		room: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "rooms",
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("messages", MessageSchema);
