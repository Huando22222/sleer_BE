const mongoose = require("mongoose");
const PostLocationSchema = new mongoose.Schema(
	{
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "users",
			required: true,
        },
		message: { type: "string" },
        location: [{type: Number, required: true }],
        available: { type: Boolean, required: true , default: true},
		createdAt: { type: Date, default: Date.now },
	},
	{ timestamps: true }
);
module.exports = mongoose.model("postsLocation", PostLocationSchema);
