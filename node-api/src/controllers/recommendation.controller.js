import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import axios from 'axios'
import Preference from "../models/preferences.model.js";

const getPreferenceRecommendations = async (req, res) => {
    const _id = req.user;

    const preferences = await Preference.find().populate('user');

    const userPreferences = preferences
        .filter(p => p.user !== null)
        .map(p => ({
            userId: p.user._id.toString(),
            name: `${p.user.firstName} ${p.user.lastName}`,
            cuisines: p.cuisine
        }));

    try {
        const response = await axios.post(`${process.env.FLASK_BASE_URL}/api/recomendation/recommend-preferences`, {
            user_id: _id.toString(),
            userPreferences
        });

        return res.status(200).json(new ApiResponse(200, response.data, "Here is the recommended cousine preferences for you"));
        
    } catch (error) {
        console.error('Error fetching recommendations from Flask:', error.message);
        throw new ApiError(500, "Failed to fetch recommendations.")
    }
}

export { getPreferenceRecommendations };
