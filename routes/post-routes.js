const express = require("express");
const PostsController = require("../controllers/post-controller");
const router = express.Router();

const AuthorizationMiddleware = require("../middlewares/authorization-middleware");
const PostMiddleware = require("../middlewares/post-middleware");

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

router.post(
	"/new",
	AuthorizationMiddleware.VerifyAccessToken,
	// upload.single("image"),
	PostMiddleware.UploadPhoto,
	PostsController.NewPost
);
// router.get("/", express.static(path.join(__dirname, "../public/images")), PostsController.GetPost);
router.get(
	"/",
	AuthorizationMiddleware.VerifyAccessToken,
	PostsController.GetPost,
);

module.exports = router;
