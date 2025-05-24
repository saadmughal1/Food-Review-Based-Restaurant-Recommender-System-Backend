import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Review from '../models/review.model.js'


import axios from 'axios'

const API_KEY = process.env.GOOGLE_MAP_API_KEY

const searchPlaces = async (req, res) => {
    const keyword = req.query.keyword;
    const location = req.query.location;

    if (!keyword) {
        throw new ApiError(400, "Keyword is required")
    }

    try {

        const searchParams = {
            query: keyword,
            key: API_KEY,
        };

        if (location) {
            searchParams.location = location;
            searchParams.radius = 10000;
        }

        const searchResponse = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json',
            {
                params: searchParams
            }
        );

        const places = searchResponse.data.results;

        if (places.length === 0) {
            throw new ApiError(404, "No places found for " + keyword)
        }

        return res.json(places);
    } catch (error) {
        console.log(error)
        throw new ApiError(500, "Failed to fetch places")
    }
}

const place = async (req, res) => {
    const { placeid } = req.params;

    if (!placeid) {
        throw new ApiError(400, "placeid is required");
    }

    try {
        const placeDetailsResponse = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
            params: {
                place_id: placeid,
                key: API_KEY
            }
        });

        const placeDetails = placeDetailsResponse.data.result;

        if (!placeDetails) {
            throw new ApiError(404, "No place found with placeid: " + placeid);
        }


        const reviews = await Review.find({ placeId: placeid })

        if (reviews.length === 0) {
            return res.json(placeDetails);
        }

        if (placeDetails.reviews && Array.isArray(placeDetails.reviews)) {
            placeDetails.reviews.push(...reviews);
        } else {
            placeDetails.reviews = reviews;
        }

        return res.json(placeDetails);

    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Failed to fetch place details");
    }
};


export { searchPlaces, place };
