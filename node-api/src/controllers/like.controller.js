import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Like from '../models/like.model.js'
import axios from 'axios'

const API_KEY = process.env.GOOGLE_MAP_API_KEY

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


const myLikedPlaces = async (req, res) => {
    const _id = req.user;

    const likedPlaces = await Like.find({ user: _id });

    const placeIds = likedPlaces.map((like) => like.place_id);

    if (placeIds.length === 0) {
        return res.status(200).json(new ApiResponse(200, [], "No liked places found"));
    }

    const placeDetailsPromises = placeIds.map(async (placeId) => {
        try {
            const placeDetailsResponse = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
                params: {
                    place_id: placeId,
                    key: API_KEY
                }
            });

            return placeDetailsResponse.data.result;

        } catch (error) {
            console.error(`Failed to fetch details for placeId: ${placeId}`, error);
            return null;
        }
    });

    const fullPlaceDetails = await Promise.all(placeDetailsPromises);

    const filteredPlaces = fullPlaceDetails.filter((place) => place !== null);

    res.status(200).json(new ApiResponse(200, filteredPlaces, "Like data fetched successfully"));
}

export { toggleLike, isLike, myLikedPlaces };
