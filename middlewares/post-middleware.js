const path = require("path");
const multer = require("multer");
const fs = require("fs");
const CryptoJS = require("crypto-js");

const hashFileName = (fileName, key) => {
	const hash = CryptoJS.HmacSHA256(fileName, key).toString(CryptoJS.enc.Hex);
	return hash;
};

const createMulterMiddleware = (uploadPath, fileName) => {
	const storage = multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, uploadPath);
		},
		filename: function (req, file, cb) {
			// console.log("origin file name", file.originalname);
			console.log("Uploading file:", fileName);
			let dbFileName = fileName + path.extname(file.originalname);
			cb(null, `${dbFileName}`); 
			req.imageName = dbFileName;
		},
	});

	return multer({ storage });
};


module.exports = {
	AuthorizeAccess: (req, res, next) => {
		try {
			const postId = req.params.postId;
			// Trả về next nếu userId là bạn của chủ sở hữu postId, ngược lại false
			next();
		} catch (error) {
			next(error);
		}
	},

    UploadPhoto: (req, res, next) => {
		try {
			
			const phone = req.payload.phone; //folder
			
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
			const hashedFileName = hashFileName(
				fileName,
				process.env.HASH_FILE_NAME
			);
			const uploadPhoto = createMulterMiddleware(
				uploadPath,
				hashedFileName
			);

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