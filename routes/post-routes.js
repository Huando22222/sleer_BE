// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const Images = require("../models/Images");
// const Posts = require("../models/Posts");
// const router = express.Router();


// const storage = multer.diskStorage({
// 	destination: function (req, file, cb) {
// 		// return cb(null, "../public/images");
// 		return cb(null, path.join(__dirname, "../public/images"));
// 	},
// 	filename: function (req, file, cb) {
// 		return cb(null, `${Date.now()}_${file.originalname}`);
// 	},
// });

// const upload = multer({ storage });



// router.get("/images/:path", async (req, res) => {
// 	const  imagePath = req.params.path;
// 	try {
// 		// Tìm đường dẫn ảnh trong cơ sở dữ liệu
// 		const image = await Images.findOne({ path: imagePath });

// 		if (!image) {
// 			return res.status(404).json({ message: "Image not found" });
// 		}

// 		// Trả về đường dẫn ảnh cho người dùng
// 		res.sendFile(path.join(__dirname, `../public/images/${imagePath}`));
// 	} catch (err) {
// 		console.error(err);
// 		res.status(500).json({ message: "Internal Server Error" });
// 	}
// });

// router.post("/images", upload.single("file"), async (req, res) => {
// 	// const imagePath = path.join("/public/images", req.file.filename);
	
// 	const imagePath = req.file.filename;
// 	console.log(imagePath);
// 	const newImage = new Images({ path: imagePath });
// 	await newImage.save();

// 	res.status(200).json({ message: "OK", path: imagePath });
// 	// console.log(req.body);
// 	console.log(req.file);
// });

// router.post("/new", async (req, res)=> {
// 	try {
// 		// const { message } = req.body;
// 		// const Authorization = req.headers["Authorization"];
// 		// const Authorization = req.getHeader("Authorization");
// 		const Authorization = req.headers["User-Agent"];
// 		console.log("body: "+ req.body["message"]);
// 		console.log("header: " + Authorization);
// 		res.status(200).json({ data: req.body });
// 	} catch (error) {
// 		console.log(error);
// 	}
// });

// router.get("/", async (req, res) => {
// 	try {
// 		const post = await Posts.find()
// 			.sort({ createdAt: -1 })
// 			.populate("images owner");
		
// 		// const firstImagePath = post[0].images ? post[0].images.path : null;
// 		const imagePaths = post.map((post) =>
// 			post.images ? post.images.path : null
// 		);
// 		res.status(200).json({
// 			message: "OK",
// 			data: post,
// 			// imagePath: firstImagePath,
// 			imagePath: imagePaths,
// 		});
// 	} catch (error) {
		
// 	}
// });
// module.exports = router;
//////////////////////////////////////////////////////////////////////////////////////////
const express = require("express");
const PostsController = require("../controllers/post-controller");
const router = express.Router();
const path = require("path");
const multer = require("multer");


const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		// return cb(null, "../public/images");
		return cb(null, path.join(__dirname, "../public/images"));
	},
	filename: function (req, file, cb) {
		return cb(null, `${Date.now()}_${file.originalname}`);
	},
});

const upload = multer({ storage });

router.post("/new", upload.single("images"), PostsController.NewPost);
// router.get("/", express.static(path.join(__dirname, "../public/images")), PostsController.GetPost);
router.get("/", PostsController.GetPost);
// router.post("/images", upload.single("file"), async (req, res) => {
// 	// const imagePath = path.join("/public/images", req.file.filename);
	
// 	const imagePath = req.file.filename;
// 	console.log(imagePath);
// 	// const newImage = new Images({ path: imagePath });
// 	// await newImage.save();

// 	res.status(200).json({ message: "OK", path: imagePath });
// 	// console.log(req.body);
// 	console.log(req.file);
// });
// router.get("/", PostsController.GetPost);

module.exports = router;
