const express = require('express');
const router = express.Router(); 
const UsersController = require('../controllers/user-controller');
const path = require("path");
const multer = require("multer");
const AuthorizationMiddleware = require('../middlewares/authorization-middleware');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		// return cb(null, "../public/images");
		return cb(null, path.join(__dirname, "../public/images"));
	},
	filename: function (req, file, cb) {
		return cb(null, `${Date.now()}_${file.originalname}`);
	},
});

// const checkUserId = (req, res, next) => {
// 	const userId = req.params.id; // Assuming the user ID is in the route parameters
// 	// Check if the user has the right to access the folder
// 	if (userId === "12345") {
// 		next(); // Continue to the next middleware or route handler
// 	} else {
// 		res.status(403).json({ message: "Unauthorized access" });
// 	}
// };
const upload = multer({ storage });
router.post("/delete-user-test-only", UsersController.DeleteUser);
router.post(
	"/refresh-token",
	AuthorizationMiddleware.VerifyRefreshToken,
	UsersController.RefreshToken
);
router.post("/login", UsersController.Login);
router.post("/logout", AuthorizationMiddleware.VerifyAccessToken,UsersController.Logout);
router.post("/register", UsersController.Register);
router.post("/profile", upload.single("avatar"), UsersController.profile);
router.post("/profileUpdate", upload.single("avatar"), UsersController.profileUpdate);
// router.post("/", UsersController.test);


module.exports = router;
