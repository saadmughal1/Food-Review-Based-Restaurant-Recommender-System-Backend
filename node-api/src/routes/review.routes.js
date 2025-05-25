import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
const router = express.Router();

import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  add,
  myReviews
} from "../controllers/review.controller.js";

router.route("/add").post(verifyJWT, asyncHandler(add));
router.route("/my").get(verifyJWT, asyncHandler(myReviews));

export default router;