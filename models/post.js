
const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
	{
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "users",
			required: true,
		},
		content: { type: "string" },
		images: { type: "string" },
		likes: { type: Number, required: true },
		createdAt: { type: Date, default: Date.now },
	},
	{ timestamps: true }
);
module.exports = mongoose.model("posts", PostSchema);