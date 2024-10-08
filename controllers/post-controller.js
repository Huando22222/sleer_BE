const path = require("path");
const fs = require("fs");
// const archiver = require("archiver");

const Post = require("../models/post");
const User = require("../models/user");

module.exports = {
	NewPost: async (req, res) => {
		try {
			const id = req.payload.id;
			const {  content, nonRecipients } = req.body;
			// const phone = req.payload.phone;
			console.log("body: ", id);

			const user = await User.findById(id).populate("friends");
			if (!user) {
				return res.status(404).json({ message: "User not found" });
			}

			const recipients = user.friends
				.filter(
					(friend) => !nonRecipients?.includes(friend._id.toString())
				)
				.map((friend) => ({
					user: friend._id,
					sent: false,
				}));

			const post = new Post({
				owner: id,
				content: content,
				image: req.imageName,
				recipients: recipients,
			});

			await post.save();
			//chua xac thuc nguoi dung da nhan hay chua //ack //if recieved => sent: true
			
			const populatedPost = await Post.findById(post._id)
				.populate({
					path: "owner",
					select: "_id displayName avatar phone",
				})
				.select("-recipients");
			let updatedRecipients = [];

			recipients.forEach((recipient) => {
				req.io
					.to(recipient.user.toString())
					.emit("new_post", populatedPost, async (ack) => {
						if (ack) {
							updatedRecipients.push(recipient.user);
							console.log(
								`Client ${recipient.user.toString()} đã nhận postId: ${
									post._id
								}`
							);
						}
					});
			});

			if (updatedRecipients.length > 0) {
				await Post.updateMany(
					{
						_id: post._id,
						"recipients.user": { $in: updatedRecipients },
					},
					{ $set: { "recipients.$[].sent": true } }
				);
				console.log(
					`Cập nhật thành công cho các recipient: ${updatedRecipients}`
				);
			}

			res.status(200).json({
				message: "posted successfully",
			});
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "Internal Server Error" });
		}
	},

	GetPost: async (req, res) => {
		try {
			const payload = req.payload;
			const payloadId = req.payload.id;

			if (!Array.isArray(payloadId) || payloadId.length === 0) {
				return res
					.status(400)
					.json({ message: "Invalid or empty postIds array" });
			}

			const posts = await Post.find(
				{ _id: { $in: payloadId } }, 
				{ recipients: 0 }
			)
				.populate({
					path: "owner",
					select: "_id displayName avatar phone",
				})
				.sort({ createdAt: -1 });

			const baseUrl = `${req.protocol}://${req.get("host")}`;
			const postsWithImageUrls = posts.map((post) => ({
				...post._doc,
				image: post.image
					? `${baseUrl}/posts/${post.owner.phone}/${post.image}`
					: null,
			}));
			res.status(200).json({ message: "OK", data: postsWithImageUrls });
			await Post.updateMany(
				{
					_id: { $in: payloadId },
					"recipients.user": payload._id,
					"recipients.received": false,
				},
				{
					$set: { "recipients.$[elem].received": true },
				},
				{
					arrayFilters: [{ "elem.user": payload.id }],
				}
			);

			
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "Server Error" });
		}
	},

	GetImage: async (req, res) => {
		try {
			const { phone, filename } = req.params;
			const filePath = path.resolve(
				"public",
				"images",
				"users",
				phone,
				filename
			);
			fs.access(filePath, fs.constants.F_OK, (err) => {
				if (err) {
					console.error("File not found:", filePath);
					return res.status(404).json({ message: "File not found" });
				}

				res.sendFile(filePath, (err) => {
					if (err) {
						console.error("Error sending file:", err);
						res.status(500).json({ message: "Error sending file" });
					}
				});
			});
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "Server Error" });
		}
	},
};
// GetPost: async (req, res) => {
// 	try {
// 		// must add fr first // this is for temporary
// 		const payload = req.payload;
// 		console.log("payload: ", payload.phone);
// 		const posts = await Post.find()
// 			.populate({
// 				path: "owner",
// 				select: "_id displayName avatar phone createdAt",
// 			})
// 			.sort({ createdAt: -1 });
// 		// res.status(200).json({ message: "OK" , data : post});
// 		const imageFiles = posts.map((post) => ({
// 			filename: post.image,
// 			filepath: path.join(
// 				// __dirname,
// 				"public",
// 				"images",
// 				"users",
// 				post.owner.phone,
// 				post.image
// 			),
// 		}));

// 		console.log("imageFiles: ", imageFiles);

// 		const archive = archiver("zip", { zlib: { level: 9 } });
// 		res.attachment("images.zip");
// 		archive.pipe(res);

// 		imageFiles.forEach((file) => {
// 			archive.file(file.filepath, { name: file.filename });
// 		});

// 		archive.finalize();
// 	} catch (error) {
// 		console.error(error);
// 		res.status(500).json({ message: "Server Error" });
// 	}
// },
