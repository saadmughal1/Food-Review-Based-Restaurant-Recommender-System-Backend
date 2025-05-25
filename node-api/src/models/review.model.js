import mongoose from "mongoose";

const ReviewSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: 'User',
    },
    author_name: {
      type: String,
      required: true
    },
    placeId: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true
    },
    relative_time_description: {
      type: String,
    },
    text: {
      type: String,
      required: true
    },
    sentiment: {
      type: String,
      required: true
    },
    polarity: {
      type: Number,
      required: true
    },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", ReviewSchema);

export default Review;
