const express = require("express");
const PostLocationController = require("../controllers/post-location-controller");
const router = express.Router();




router.post("/new", PostLocationController.NewPostLocation);
router.post("/delete", PostLocationController.DeletePostLocation);
router.get("/", PostLocationController.GetPostLocations);

module.exports = router;
