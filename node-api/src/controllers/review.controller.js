import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Review from '../models/review.model.js'
import User from "../models/user.model.js"

const add = async (req, res) => {
    const _id = req.user;
    const { rating, text, placeId } = req.body;

    const user = await User.findById(_id)

    const review = await Review.create({
        author_name: user.firstName + " " + user.lastName,
        user: _id,
        rating,
        text,
        placeId
    });

    res.status(200).json(new ApiResponse(201, review, "Review added successfully"));
}

const myReviews = async (req, res) => {
    const _id = req.user;

    const review = await Review.find({ user: _id });

    res.status(200).json(new ApiResponse(200, review, "Review fetched successfully"));
}



export { add, myReviews };
