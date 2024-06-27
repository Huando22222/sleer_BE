const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
	phone: { type: String, required: true, unique: true },
	password: { type: String, required: true },

	createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model("accounts", accountSchema);
