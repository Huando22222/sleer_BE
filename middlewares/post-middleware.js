const path = require("path");
const multer = require("multer");

const createMulterMiddleware = (uploadPath, fileName) => {
	const storage = multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, path.join(__dirname, uploadPath));
		},
		filename: function (req, file, cb) {
			cb(null, `${fileName}_${file.originalname}`);
		},
	});

	return multer({ storage });
};

// const examplePath = "../public/images";
// const exampleName = Date.now();

module.exports = {
    UploadPhoto: (req, res, next) => {
        try {
            const { examplePath, exampleName } = req.body; //tam thoi thoi //truyen vao header roi gui về server
			//path = phone  , name = phone+date
            if (!examplePath || !exampleName) {
                console.log("empty path , name");
                return res
					.status(400)
					.json({ error: "examplePath or exampleName is missing" });
			}
            const uploadPhoto = createMulterMiddleware(
				examplePath,
				exampleName
			);

			uploadPhoto.single("image")(req, res, (err) => {
				if (err instanceof multer.MulterError) {
					return res.status(400).json({ error: "Upload failed" });
				} else if (err) {
					return res.status(500).json({ error: "Server error" });
				}
				next();
			});
        } catch (error) {
            next(error);
        }
	},
};