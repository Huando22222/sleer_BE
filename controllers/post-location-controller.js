const PostLocation = require('../models/post-location');
const User = require('../models/user');
const schoolData = require('../hardcode/school');
module.exports = {
    DeletePostLocation: async (req, res) => {
        try {
          const { postId } = req.body;
          const updatedPostLocation = await PostLocation.findByIdAndUpdate(
            postId,
            { isDeleted: true }, // Update isDeleted directly to true
            { new: true }
          ).populate("owner");
    
          if (!updatedPostLocation) {
            return res.status(404).json({ message: "Post not found" });
          }
    
          res.status(200).json({
            message: "Post location marked as deleted successfully",
            postLocation: updatedPostLocation,
          });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Server Error" });
        }
      },
  NewPostLocation: async (req, res) => {
    try {

      const { owner, message, latitude, longitude } = req.body;
      console.log(owner+ "- "+ message+ "- "+ latitude+"- "+ longitude+"- ");
      const postLocation = new PostLocation({
        owner: owner,
        message: message,
        location: {
            latitude:latitude,
            longitude:longitude,
        },
      });

      await postLocation.save();
      const newPostLocation = await PostLocation.findOne({ owner: owner }).sort({ createdAt: -1 }).populate("owner");
      
      res.status(200).json({
        message: "posted successfully",
        postLocation: newPostLocation,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  GetPostLocations: async (req, res) => {
    try {
      const postLocations = await PostLocation.find({ isDeleted: false })
        .populate("owner")
        .sort({ createdAt: -1 });
      res.status(200).json({ data: postLocations });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  },
  
};
