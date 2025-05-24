import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
import Preference from "../models/preferences.model.js";


const save = async (req, res) => {
    const _id = req.user;
    const { cuisinePreferences } = req.body;

    let preference = await Preference.findOne({ user: _id });

    if (!preference) {
        const newPreference = await new Preference.create({
            user: _id,
            cuisine: cuisinePreferences,
        });
        res.status(200).json(new ApiResponse(201, newPreference, "Cuisine added successfully"));
    }

    preference = await Preference.findByIdAndUpdate(
        preference._id,
        { cuisine: cuisinePreferences },
        { new: true }
    );

    res.status(200).json(new ApiResponse(200, preference, "Cuisine updated successfully"))
}


export { save };
