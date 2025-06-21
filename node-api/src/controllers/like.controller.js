import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Like from '../models/like.model.js'

const toggleLike = async (req, res) => {
    const _id = req.user;
    const { placeId } = req.body;

    if (!_id || !placeId) {
        throw new ApiError(400, "User or placeId missing");
    }

    const existingLike = await Like.findOne({ user: _id, place_id: placeId });

    if (existingLike) {
        await Like.deleteOne({ _id: existingLike._id });
        res.status(200).json(new ApiResponse(201, {}, "UnLike successfully"));
    } else {
        const newLike = new Like({
            user: _id,
            place_id: placeId,
            createdAt: new Date()
        });
        await newLike.save();
        res.status(200).json(new ApiResponse(201, {}, "Liked successfully"));
    }
}

const isLike = async (req, res) => {
    const _id = req.user;
    const { placeId } = req.body;

    if (!_id || !placeId) {
        throw new ApiError(400, "User or placeId missing");
    }

    const existingLike = await Like.findOne({ user: _id, place_id: placeId });

    res.status(200).json(new ApiResponse(200, existingLike, "Like data fetched successfully"));
}


export { toggleLike,isLike };
