const express = require("express");
const PostsController = require("../controllers/post-controller");
const router = express.Router();

const AuthorizationMiddleware = require("../middlewares/authorization-middleware");
const PostMiddleware = require("../middlewares/post-middleware");

router.post(
	"/new",
	AuthorizationMiddleware.VerifyAccessToken,
	PostMiddleware.UploadPhoto,
	PostsController.NewPost
);
router.get(
	"/:phone/:filename",
	// AuthorizationMiddleware.VerifyAccessToken,
	// PostMiddleware.AuthorizeAccess,
	PostsController.GetImage
);

router.get(
	"/",
	AuthorizationMiddleware.VerifyAccessToken,
	PostsController.GetPost,
); //list post that user unseen


module.exports = router;
