const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const path = require("path");
const User = require("../models/user");
const Account = require("../models/account");
const Room = require("../models/room");
function convertToLocalPhoneNumber(phoneNumber) {
	if (phoneNumber.startsWith("+")) {
		const countryCode = phoneNumber.substring(
			1,
			phoneNumber.indexOf("0", 1)
		);
		const localPart = phoneNumber.substring(phoneNumber.indexOf("0", 1));

		switch (countryCode) {
			case "1":
				return localPart;
			case "84":
				return "0" + phoneNumber.substring(3);
			case "86":
				return phoneNumber.substring(3);
			case "81":
				return "0" + phoneNumber.substring(3);
			case "44":
				return "0" + phoneNumber.substring(3);
			case "61":
				return "0" + phoneNumber.substring(3);
			default:
				return phoneNumber;
		}
	} else {
		return phoneNumber;
	}
}


module.exports = {
	//delete refresh token
	Logout: async (req, res) => {
		try {
			const payload = req.payload;
			const user = await User.findOneAndUpdate(
				{ phone: payload.phone },
				{ refreshToken: "" },
				{ new: true }
			);
			console.log("logout:", user);
			res.status(200).json({
				message: "logout successful",
			});
		} catch (error) {
			res.status(500).json("Internal Server Error");
		}
	},

	AddFriendRequest: async (req, res) => {
		//! user accept //
		try {
			const id = req.payload.id; 
			const { idFriend } = req.body; 

			const user = await User.findById(id);
			const friend = await User.findById(idFriend);

			if (!user || !friend) {
				return res.status(404).json({ message: "User not found" });
			}

			if (
				user.friends.includes(idFriend) ||
				friend.friends.includes(id)
			) {
				return res.status(400).json({ message: "Already friends" });
			}

			user.friends.push(idFriend);
			friend.friends.push(id);

			await user.save();
			await friend.save();

			res.status(200).json({
				message: "Friend request accepted successfully",
			});
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "Internal Server Error" });
		}
	},

	DeleteUser: async (req, res) => {
		try {
			await User.deleteMany();
			await Account.deleteMany();
			res.status(200).json({ message: "All users have been deleted." });
		} catch (error) {
			res.status(500).json({ message: "Internal Server Error" });
			console.error("test message: " + error.message);
		}
	},
	TokenUser: async (req, res) => {
		try {
			const token = req.payload.id;
			res.status(200).json({ message: "token id: " + token });
		} catch (error) {
			res.status(500).json({ message: "Internal Server Error" });
			console.error("test message: " + error.message);
		}
	},

	RefreshToken: async (req, res) => {
		//check refresh token in user table
		try {
			const payload = req.payload;
			// phai check con trong db khong da
			const accessToken = jwt.sign(
				{ phone: payload.phone },
				process.env.ACCESS_TOKEN_SECRET,
				{ expiresIn: "5d" }
			);
			res.json({ accessToken });
		} catch (error) {
			res.status(500).json("Internal Server Error");
		}
	},

	Login: async (req, res) => {
		try {
			const { phone, password } = req.body;

			const acc = await Account.findOne({phone: phone});

			if (acc && (await bcrypt.compare(password, acc.password))) {
				const user = await User.findOne({ phone })
					.populate({
						path: "friends",
						select: "_id displayName avatar phone",
					})
					.sort({ createdAt: -1 });
				if (!user) {
					return res.status(404).json({ message: "User not found" });
				}
				const payload = {
					id: user.id,
					phone: user.phone,
				};

				const accessToken = jwt.sign(
					payload,
					process.env.ACCESS_TOKEN_SECRET
					// { expiresIn: "5d" }
				);
				const refreshToken = jwt.sign(
					payload,
					process.env.REFRESH_TOKEN_SECRET
					// { expiresIn: '30s' }
				);

				user.refreshToken = refreshToken;
				await user.save();

				console.log("login: ", accessToken); //, user
				res.status(200).json({
					message: "Login successful",
					user: user,
					accessToken,
				});
			} else {
				res.status(401).json("thông tin xác thực không đúng.");
			}
		} catch (error) {
			res.status(500).json("Internal Server Error");
		}
	},

	profileUpdate: async (req, res) => {
		try {
			const { displayName, idAcc } = req.body;

			const avatar = req.file ? req.file.filename : null;

			console.log("user profile updated: " + displayName, idAcc);

			const existingUser = await User.findOne({ idAcc });

			if (avatar !== null) {
				existingUser.avatar = avatar;
			}

			// existingUser.firstName = firstName || existingUser.firstName;
			// existingUser.lastName = lastName || existingUser.lastName;
			// existingUser.birthDay = birthDay || existingUser.birthDay;
			// existingUser.gender = gender || existingUser.gender;
			// existingUser.phone = phone || existingUser.phone;
			existingUser.displayName = displayName;
			existingUser.avatar = avatar;
			// const updatedUser = await existingUser.save();
			const updatedUser = await existingUser.updateOne();

			res.status(200).json({
				message: "User profile updated successfully",
				user: updatedUser,
			});
		} catch (error) {
			res.status(500).json({ message: "Failed to update user profile" });
		}
	},

	profile: async (req, res) => {
		try {
			const {
				firstName,
				lastName,
				birthDay,
				gender,
				// avatar,
				phone,
				idAcc,
			} = req.body;
			const avatar = req.file.filename;

			const user = new User({
				firstName,
				lastName,
				birthDay,
				gender,
				avatar: avatar,
				phone,
				idAcc,
			});
			// console.log("profile filled " + user);
			await user
				.save()
				.then(() => {
					const userId = user._id;
					User.updateOne(
						{ _id: userId },
						{ $push: { rooms: userId } }
					);
					res.status(200).json({
						message: "profile filled thành công",
						user: user,
					});
				})
				.catch((err) => console.log(err));
		} catch (error) {
			res.status(500).json("false load user");
		}
	},

	Register: async (req, res) => {
		const session = await mongoose.startSession();
		session.startTransaction();

		try {
			const { phone, password } = req.body;
			console.log("ok");
			console.log(phone, password);

			let domesticPhoneNumber = convertToLocalPhoneNumber(phone);
			const acc = await Account.findOne({
				phone: domesticPhoneNumber,
			}).session(session);
			console.log("ok");
			if (acc !== null) {
				console.log("acc already exists " + acc);
				await session.abortTransaction();
				session.endSession();

				return res.status(409).json({
					message: "acc already exists",
				});
			}
			console.log("ok");
			const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);
			const hashedPassword = await bcrypt.hash(password, saltRounds);
			const account = new Account({
				phone: domesticPhoneNumber,
				password: hashedPassword,
			});
			await account.save({ session });
			console.log("ok");
			const user = new User({ phone: domesticPhoneNumber, friends: [], });
			await user.save({ session });

			user.friends.push(user._id);
			await user.save({ session });
			
			await session.commitTransaction();
			session.endSession();

			console.log(
				"Đã đăng ký tài khoản thành công " + user,
				domesticPhoneNumber,
				password
			);
			return res.status(201).json({
				message: "Đã đăng ký tài khoản thành công",
				user,
			});
		} catch (error) {
			await session.abortTransaction();
			session.endSession();
			console.error(error);
			return res.status(500).json({
				message: "Lỗi trong quá trình đăng ký tài khoản",
			});
		}
	},
};
