
const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
	{
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "users",
			required: true,
		},
		content: { type: String, default: "" },
		image: { type: String, required: true },
		reaction: { type: Number, default: 0 },
		recipients: [
			{
				user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
				sent: { type: Boolean, default: false },
			},
		],
		createdAt: { type: Date, default: Date.now },
	},
	{ timestamps: true }
);
module.exports = mongoose.model("posts", PostSchema);