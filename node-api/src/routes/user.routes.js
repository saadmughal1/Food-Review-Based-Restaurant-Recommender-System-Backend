import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
const router = express.Router();

import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  signup,
  login,
  logout,
  refreshAccessToken,
} from "../controllers/user.controller.js";

router.route("/login").post(asyncHandler(login));
router.route("/signup").post(asyncHandler(signup));
router.route("/logout").post(verifyJWT, asyncHandler(logout));

router.route("/refresh-access-token").post(asyncHandler(refreshAccessToken));

export default router;
