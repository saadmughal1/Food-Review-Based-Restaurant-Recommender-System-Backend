import mongoose from "mongoose";

const LikeSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: 'User',
    },
    place_id: {
      type: String,
      required:true
    }
  },
  { timestamps: true }
);

const Like = mongoose.model("LikedPlaces", LikeSchema);

export default Like;
