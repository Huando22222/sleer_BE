const path = require("path");
const fs = require("fs");
const archiver = require("archiver");

const Post = require("../models/post");
const User = require("../models/user");

module.exports = {
	NewPost: async (req, res) => {
		try {
			const { id, content, nonRecipients } = req.body;
			// const phone = req.tokenPayload.phone;
			console.log("body: ", id);

			const user = await User.findById(id).populate("friends");
			if (!user) {
				return res.status(404).json({ message: "User not found" });
			}

			let recipients = [];
			if (!nonRecipients || nonRecipients.length === 0) {
				recipients = user.friends.map((friend) => ({
					user: friend._id,
					sent: false,
				}));
			} else {
				recipients = user.friends
					.filter(
						(friend) =>
							!nonRecipients.includes(friend._id.toString())
					)
					.map((friend) => ({
						user: friend._id,
						sent: false,
					}));
			}

			const post = new Post({
				owner: id,
				content: content,
				image: req.imageName,
				recipients: recipients,
			});

			await post
				.save()
				.then(() => {})
				.catch((err) => console.log(err));
			// const newP = await Post.findOne({owner:owner}).sort({ createdAt: -1 }).populate("owner")
			//   // .populate("owner")
			res.status(200).json({
				message: "posted successfully",
				// post: newP
			});
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "Internal Server Error" });
		}
	},

	GetPost: async (req, res) => {
		try {
			// must add fr first // this is for temporary
			const tokenPayload = req.tokenPayload;
			const posts = await Post.find()
				.populate({
					path: "owner",
					select: "_id displayName avatar phone createdAt",
				})
				.sort({ createdAt: -1 });
			
			const baseUrl = `${req.protocol}://${req.get("host")}`;
			const postsWithImageUrls = posts.map((post) => ({
				...post._doc,
				image: `${baseUrl}/posts/${post.owner.phone}/${post.image}`,
			}));
			
			res.status(200).json({ message: "OK", data: postsWithImageUrls });
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
			// Check if the file exists
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
	}
};
// GetPost: async (req, res) => {
// 	try {
// 		// must add fr first // this is for temporary
// 		const tokenPayload = req.tokenPayload;
// 		console.log("tokenPayload: ", tokenPayload.phone);
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
