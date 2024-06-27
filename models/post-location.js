const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  latitude: { type: Number,required: true }, 
  longitude: { type: Number,required: true },
  }
)


const PostLocationSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    message: { type: "string" },
    location: locationSchema,
    isDeleted: { type: Boolean, required: true,default: false}
    },
  { timestamps: true }
);

module.exports = mongoose.model("postLocations", PostLocationSchema);
