import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
const router = express.Router();

import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  getPreferenceRecommendations
} from "../controllers/recommendation.controller.js";

router.route("/get-preference-recomendations").get(verifyJWT, asyncHandler(getPreferenceRecommendations));


export default router;