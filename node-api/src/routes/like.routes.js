import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
const router = express.Router();

import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  toggleLike,
  isLike
} from "../controllers/like.controller.js";

router.route("/toggle-like").post(verifyJWT, asyncHandler(toggleLike));
router.route("/islike").post(verifyJWT, asyncHandler(isLike));

export default router;