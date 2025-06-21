import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Review from '../models/review.model.js'


import axios from 'axios'

const API_KEY = process.env.GOOGLE_MAP_API_KEY

const searchPlaces = async (req, res) => {
    const keyword = req.query.keyword;
    const location = req.query.location;
    const userId = req.headers['userid'];

    if (!keyword) {
        throw new ApiError(400, "Keyword is required");
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

        let highRatedPlaces = [];
        let nextPageToken = null;
        let attempts = 0;

        do {
            if (nextPageToken) {
                await new Promise(resolve => setTimeout(resolve, 2000));
                searchParams.pagetoken = nextPageToken;
            }

            const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
                params: searchParams,
            });

            const places = response.data.results || [];

            if (places.length === 0 && highRatedPlaces.length === 0) {
                throw new ApiError(404, "No places found for " + keyword);
            }

            // Filter places with rating >= 4
            const filteredByRating = places.filter(place => place.rating >= 4);

            if (!userId) {
                highRatedPlaces.push(...filteredByRating);
            } else {
                const currentFiltered = await reviewBaseFiltering(filteredByRating, userId);
                highRatedPlaces.push(...currentFiltered);
            }

            nextPageToken = response.data.next_page_token;
            attempts++;

            // Stop if we've reached 20 high-rated places
            if (highRatedPlaces.length >= 20) {
                break;
            }

        } while (highRatedPlaces.length < 20 && nextPageToken && attempts < 3);

        // Sort in DESCENDING order (highest rating first)
        highRatedPlaces.sort((a, b) => b.rating - a.rating);

        // Return exactly 20 places (or all available if less than 20)
        const finalResults = highRatedPlaces.slice(0, 20);

        return res.json(finalResults);

    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Failed to fetch places");
    }
};



const reviewBaseFiltering = async (places, userId) => {
    const placeIds = places.map(place => place.place_id);
    const allReviews = await Review.find({ placeId: { $in: placeIds }, user: userId }).lean();
    const reviewsByPlace = {};

    allReviews.forEach(review => {
        if (!reviewsByPlace[review.placeId]) {
            reviewsByPlace[review.placeId] = [];
        }
        reviewsByPlace[review.placeId].push(review);
    });

    const filteredPlaces = places.filter(place => {
        const reviews = reviewsByPlace[place.place_id] || [];

        if (reviews.length === 0) {
            return true;
        }

        let positive = 0, negative = 0, neutral = 0;

        reviews.forEach(r => {
            if (r.sentiment === "positive") positive++;
            else if (r.sentiment === "negative") negative++;
            else neutral++;
        });

        return negative < positive + neutral;
    });
    return filteredPlaces
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

const photoProxy = async (req, res) => {
    const photoRef = req.query.photoRef;

    if (!photoRef) {
        throw new ApiError(400, "Missing photoRef");
    }

    const googleUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoRef}&key=${API_KEY}`;

    try {
        const response = await axios({
            method: "GET",
            url: googleUrl,
            responseType: "stream",
        });

        res.setHeader("Content-Type", response.headers["content-type"]);
        response.data.pipe(res);
    } catch (err) {
        console.error("Photo proxy error:", err.message);
        throw new ApiError(500, "Error fetching image");
    }
};

export { searchPlaces, place, photoProxy };
