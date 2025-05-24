import mongoose from "mongoose";

const PreferencesSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: 'User',
    },
    cuisine: {
      type: [String],
    },
  },
  { timestamps: true }
);

const Preference = mongoose.model("Preference", PreferencesSchema);

export default Preference;
