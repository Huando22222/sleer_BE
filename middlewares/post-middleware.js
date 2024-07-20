const path = require("path");
const multer = require("multer");
const fs = require("fs");

const createMulterMiddleware = (uploadPath, fileName) => {
	const storage = multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, uploadPath);
		},
		filename: function (req, file, cb) {
			console.log("Uploading file:", file.originalname);
			cb(null, `${fileName}_${file.originalname}`);
		},
	});

	return multer({ storage });
};


module.exports = {
    UploadPhoto: (req, res, next) => {
		try {
			//tam thoi thoi //truyen vao header roi gui về server
			//path = phone  , name = phone+date => hash da~
			const phone = req.tokenPayload.phone; //folder
			
			
			console.log("Uploading phôto");
			if (!phone) {
				console.log("empty path , name");
				return res
					.status(400)
					.json({ error: "examplePath or exampleName is missing" });
			}

			const uploadPath = path.join(__dirname, "../public/images/users", phone);
			if (!fs.existsSync(uploadPath)) {
				// Create the directory
				fs.mkdirSync(uploadPath, { recursive: true });
			}

			const fileName = `${phone}_${Date.now()}`;
			const uploadPhoto = createMulterMiddleware(uploadPath , fileName);

			uploadPhoto.single("image")(req, res, (err) => {
				if (err instanceof multer.MulterError) {
					console.log(err);
					return res.status(400).json({ error: "Upload failed" });
				} else if (err) {
					console.log(err);
					return res.status(500).json({ error: "Server error" });
				}
				next();
			});
		} catch (error) {
            next(error);
        }
	},
};