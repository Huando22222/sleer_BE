const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
	{
		displayName: { type: String, default: "" },
		// birthDay: { type: Date, required: true },
		avatar: { type: String, default: "default-avatar.svg" },
		friends: [
			{ type: mongoose.Schema.Types.ObjectId, ref: "users", default: [] },
		],
		refreshToken: { type: String, default: "" },
		rooms: [{ type: mongoose.Schema.Types.ObjectId, default: [] } ],
		// idAcc: { type: String, required: true },
		phone: { type: String, required: true, unique: true },
		createdAt: { type: Date, default: Date.now },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("users", UserSchema);