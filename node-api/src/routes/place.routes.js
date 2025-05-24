import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
const router = express.Router();

import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  place,
  searchPlaces
} from "../controllers/place.controller.js";

router.route("/").get(asyncHandler(searchPlaces));
router.route("/:placeid").get(asyncHandler(place));

export default router;
