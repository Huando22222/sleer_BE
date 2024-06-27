const Post = require('../models/post');
const User = require('../models/user');

module.exports = {
  NewPost: async (req, res) => {
    try {
		const { owner, message } = req.body;
		const images = req.file? req.file.filename : "";

		const post = new Post({
			owner: owner,
			message: message,
			images: images, 
			likes: 0,
    });
    console.log(owner );
      // console.log( "----------------test image ok------------------------");
      console.log(images );

      await post
        .save()
        .then(() => {
          // console.log("posted successfully");
        
        })
        .catch((err) => console.log(err));
        const newP = await Post.findOne({owner:owner}).sort({ createdAt: -1 }).populate("owner")
          // .populate("owner")
          res.status(200).json({
             message: "posted successfully", post : newP /////////////////////
            
          });
          // console.log(newP);
    } catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
    }
  },

  GetPost: async (req, res) => {
	try {
		// console.log("----------------send posts to client------------------------");
		const post = await Post.find()
			.populate("owner")
			.sort({ createdAt: -1 });
		res.status(200).json({ message: "OK" , data : post});
    } catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server Error" });
    }
  },
};
