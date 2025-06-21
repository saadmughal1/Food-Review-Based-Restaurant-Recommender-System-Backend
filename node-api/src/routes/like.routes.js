import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
const router = express.Router();

import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  toggleLike
} from "../controllers/like.controller.js";

router.route("/toggle-like").post(verifyJWT, asyncHandler(toggleLike));

export default router;