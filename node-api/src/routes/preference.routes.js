import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
const router = express.Router();

import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  save,
  loadPreferences
} from "../controllers/preference.controller.js";

router.route("/").get(verifyJWT, asyncHandler(loadPreferences));
router.route("/save").post(verifyJWT, asyncHandler(save));

export default router;