import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
const router = express.Router();

import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  add,
} from "../controllers/review.controller.js";

router.route("/add").post(verifyJWT, asyncHandler(add));

export default router;